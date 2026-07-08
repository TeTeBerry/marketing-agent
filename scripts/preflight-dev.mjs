#!/usr/bin/env node
/**
 * Local dev preflight for Raven Content Engine.
 * Validates .env, backend health, and marketing-ai routes.
 */
import { config as loadDotenv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv({ path: path.join(packageRoot, '.env') });

const baseUrl = process.env.BACKEND_INTERNAL_API_URL?.trim().replace(/\/+$/, '');
const apiKey = process.env.INTERNAL_API_KEY?.trim();

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`✓ ${message}`);
}

if (!baseUrl) {
  fail('BACKEND_INTERNAL_API_URL is missing — copy .env.example to .env');
}
if (!apiKey) {
  fail('INTERNAL_API_KEY is missing — must match sync-app-backend/.env');
}

const apiPrefix = baseUrl.endsWith('/api') ? '' : '/api';
const healthUrl = `${baseUrl.replace(/\/api$/, '')}${apiPrefix}/health`;
const headers = { 'x-internal-api-key': apiKey };

console.log('Raven Content Engine — local preflight\n');

console.log(`Backend: ${baseUrl}`);
console.log(`Health:  ${healthUrl}\n`);

const healthRes = await fetch(healthUrl);
if (!healthRes.ok) {
  fail(
    `Backend not reachable (HTTP ${healthRes.status}). Start sync-app-backend:\n` +
      '  cd sync-app-backend && pnpm run dev:all',
  );
}
ok('Backend health OK');

async function checkGet(pathSuffix, label) {
  const url = `${baseUrl}${apiPrefix}/internal/marketing-ai/${pathSuffix}`;
  const res = await fetch(url, { headers });
  if (res.status === 401) {
    fail(`${label}: HTTP 401 — INTERNAL_API_KEY does not match backend`);
  }
  if (res.status === 404) {
    fail(`${label}: HTTP 404 — redeploy backend with MarketingAiModule`);
  }
  if (!res.ok) {
    const body = (await res.text()).slice(0, 200);
    fail(`${label}: HTTP ${res.status} — ${body}`);
  }
  ok(`${label} OK`);
  return res.json();
}

const seriesPayload = await checkGet('content-series', 'Content series');
const seriesCount = seriesPayload?.data?.length ?? 0;
console.log(`  → ${seriesCount} content series loaded`);

const festivalsPayload = await checkGet('upcoming-festivals', 'Upcoming festivals');
const festivalCount = festivalsPayload?.data?.length ?? 0;
console.log(`  → ${festivalCount} festivals loaded`);

const generateUrl = `${baseUrl}${apiPrefix}/internal/marketing-ai/generate-content`;
const probeRes = await fetch(generateUrl, {
  method: 'POST',
  headers: { ...headers, 'content-type': 'application/json' },
  body: JSON.stringify({
    brandVoice: 'preflight',
    festival: { name: 'Preflight Festival', activityLegacyId: 1 },
    seriesType: 'community_discussion',
    platforms: ['threads'],
    language: 'en',
  }),
});

if (probeRes.status === 401) {
  fail('generate-content: HTTP 401 — check INTERNAL_API_KEY');
}
if (probeRes.status === 404) {
  fail('generate-content: HTTP 404 — Content Engine route missing');
}
if (probeRes.status === 503) {
  ok('generate-content route exists (503 — set HUNYUAN_API_KEY in backend for LLM)');
} else if (probeRes.ok) {
  ok('generate-content route OK (LLM configured)');
} else {
  console.warn(`⚠️  generate-content probe: HTTP ${probeRes.status}`);
}

console.log('\nPreflight passed. Start the console:\n  npm run console:dev\n');

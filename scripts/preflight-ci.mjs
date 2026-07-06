#!/usr/bin/env node
/**
 * CI preflight: validate secrets and that production backend exposes marketing-ai.
 */
const baseUrl = process.env.BACKEND_INTERNAL_API_URL?.trim().replace(/\/+$/, '');
const apiKey = process.env.INTERNAL_API_KEY?.trim();
const feishuWebhook = process.env.FEISHU_WEBHOOK_URL?.trim();

function fail(message) {
  console.error(`❌ Preflight failed: ${message}`);
  process.exit(1);
}

if (!baseUrl) fail('BACKEND_INTERNAL_API_URL secret is missing');
if (!apiKey) fail('INTERNAL_API_KEY secret is missing');
if (!feishuWebhook) {
  console.warn('⚠️  FEISHU_WEBHOOK_URL secret is missing — Feishu notify step will be skipped');
}

const marketingPath = baseUrl.endsWith('/api')
  ? '/internal/marketing-ai/generate-platform-content'
  : '/api/internal/marketing-ai/generate-platform-content';
const marketingUrl = `${baseUrl}${marketingPath}`;
const healthUrl = baseUrl.endsWith('/api')
  ? `${baseUrl.replace(/\/api$/, '')}/api/health`
  : `${baseUrl}/api/health`;

console.log(`Checking health: ${healthUrl}`);
const healthRes = await fetch(healthUrl);
if (!healthRes.ok) {
  fail(`Backend health returned HTTP ${healthRes.status}`);
}
console.log('✓ Backend health OK');

console.log(`Checking marketing-ai route: ${marketingUrl}`);
const probeRes = await fetch(marketingUrl, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-internal-api-key': apiKey,
  },
  body: JSON.stringify({
    brandVoice: 'preflight',
    festival: { name: 'Preflight' },
    platform: 'threads',
    contentType: 'news',
    language: 'en',
  }),
});

const probeBody = await probeRes.text();
console.log(`Marketing-ai probe: HTTP ${probeRes.status}`);

if (probeRes.status === 404) {
  fail(
    'Marketing AI route not found on production backend (HTTP 404). ' +
      'Redeploy sync-app-backend with MarketingAiModule to CloudBase, then re-run workflow.',
  );
}

if (probeRes.status === 401) {
  fail(
    'Invalid INTERNAL_API_KEY for production backend (HTTP 401). ' +
      'Ensure GitHub secret matches CloudBase INTERNAL_API_KEY.',
  );
}

if (probeRes.status === 503) {
  console.warn(
    '⚠️  Marketing-ai returned 503 — HUNYUAN_API_KEY may be missing on production, but route exists.',
  );
} else if (!probeRes.ok && probeRes.status !== 400) {
  console.warn(`⚠️  Unexpected probe status ${probeRes.status}: ${probeBody.slice(0, 200)}`);
} else {
  console.log('✓ Marketing-ai route reachable');
}

const assetsPath = baseUrl.endsWith('/api')
  ? '/internal/marketing-ai/generate-instagram-assets'
  : '/api/internal/marketing-ai/generate-instagram-assets';
const assetsUrl = `${baseUrl}${assetsPath}`;

console.log(`Checking instagram-assets route: ${assetsUrl}`);
const assetsProbeRes = await fetch(assetsUrl, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-internal-api-key': apiKey,
  },
  body: JSON.stringify({}),
});

console.log(`Instagram-assets probe: HTTP ${assetsProbeRes.status}`);
if (assetsProbeRes.status === 404) {
  fail(
    'Instagram assets route not found on production backend (HTTP 404). ' +
      'Redeploy sync-app-backend with MarketingAiImageService, then re-run workflow.',
  );
}
if (assetsProbeRes.status === 401) {
  fail('Invalid INTERNAL_API_KEY for instagram-assets (HTTP 401).');
}
if (assetsProbeRes.status === 400) {
  console.log('✓ Instagram-assets route reachable (validation rejected empty body as expected)');
} else if (!assetsProbeRes.ok && assetsProbeRes.status !== 503) {
  console.warn(
    `⚠️  Unexpected instagram-assets probe status ${assetsProbeRes.status}`,
  );
} else {
  console.log('✓ Instagram-assets route reachable');
}

console.log('Preflight passed');

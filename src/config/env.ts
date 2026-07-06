import { config as loadDotenv } from 'dotenv';
import type { MarketingContentType } from '../types/index.js';

loadDotenv();

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const env = {
  backendInternalApiUrl: normalizeBaseUrl(
    requireEnv('BACKEND_INTERNAL_API_URL'),
  ),
  internalApiKey: requireEnv('INTERNAL_API_KEY'),
  brandVoice:
    process.env.BRAND_VOICE?.trim() ||
    'Raven: sharp, festival-savvy, community-first. We help ravers discover lineups, plan trips, and find their crew — never corporate, never cringe.',
  contentType: (process.env.CONTENT_TYPE?.trim() ||
    'news') as MarketingContentType,
  language: process.env.LANGUAGE?.trim() || 'en',
};

export function marketingAiEndpoint(): string {
  const base = env.backendInternalApiUrl;
  const path = base.endsWith('/api')
    ? '/internal/marketing-ai/generate-platform-content'
    : '/api/internal/marketing-ai/generate-platform-content';
  return `${base}${path}`;
}

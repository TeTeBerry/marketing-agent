import { config as loadDotenv } from 'dotenv';

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
  /** Daily markdown reports are always generated in English. */
  dailyReportLanguage: 'en' as const,
};

export function marketingAiEndpointPath(action: string): string {
  const base = env.backendInternalApiUrl;
  const prefix = base.endsWith('/api')
    ? '/internal/marketing-ai'
    : '/api/internal/marketing-ai';
  return `${base}${prefix}/${action}`;
}

export function upcomingFestivalsEndpoint(): string {
  return marketingAiEndpointPath('upcoming-festivals');
}

import { env } from '../config/env.js';
import { fetchBackend } from './backend-fetch.js';

function backendHealthUrl(): string {
  const base = env.backendInternalApiUrl;
  return base.endsWith('/api')
    ? `${base.replace(/\/api$/, '')}/api/health`
    : `${base}/api/health`;
}

export function formatFetchError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = error.cause;
  if (cause instanceof Error && cause.message && cause.message !== error.message) {
    return `${error.message} (${cause.message})`;
  }

  return error.message;
}

export async function assertBackendReachable(): Promise<void> {
  const healthUrl = backendHealthUrl();

  try {
    const response = await fetchBackend(healthUrl);
    if (!response.ok) {
      throw new Error(`health check returned HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      [
        `Backend unreachable at ${env.backendInternalApiUrl}`,
        formatFetchError(error),
        'Start sync-app-backend locally: cd sync-app-backend && pnpm run start:dev',
      ].join(' — '),
    );
  }
}

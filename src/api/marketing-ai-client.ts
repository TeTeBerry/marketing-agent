import { env, marketingAiEndpoint } from '../config/env.js';
import { fetchBackend } from '../utils/backend-fetch.js';
import type {
  ApiSuccessResponse,
  GeneratePlatformContentRequest,
  PlatformContentResult,
} from '../types/index.js';

export class MarketingAiApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message);
    this.name = 'MarketingAiApiError';
  }
}

export function formatMarketingAiApiError(
  error: MarketingAiApiError,
): string {
  const backendMessage = parseBackendErrorMessage(error.body);
  if (backendMessage) {
    return `${error.message}: ${backendMessage}`;
  }
  return error.message;
}

function parseBackendErrorMessage(body?: string): string | undefined {
  if (!body?.trim()) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(body) as { message?: string };
    return parsed.message?.trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function generatePlatformContent(
  request: GeneratePlatformContentRequest,
): Promise<PlatformContentResult> {
  const url = marketingAiEndpoint();

  const response = await fetchBackend(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-internal-api-key': env.internalApiKey,
    },
    body: JSON.stringify(request),
  });

  const rawBody = await response.text();

  if (!response.ok) {
    throw new MarketingAiApiError(
      `Marketing AI API failed (${response.status} ${response.statusText})`,
      response.status,
      rawBody,
    );
  }

  let parsed: ApiSuccessResponse<PlatformContentResult>;
  try {
    parsed = JSON.parse(rawBody) as ApiSuccessResponse<PlatformContentResult>;
  } catch {
    throw new MarketingAiApiError(
      'Marketing AI API returned invalid JSON',
      response.status,
      rawBody,
    );
  }

  if (parsed.code !== 200 || !parsed.data) {
    throw new MarketingAiApiError(
      `Marketing AI API error: ${parsed.message ?? 'unknown'}`,
      response.status,
      rawBody,
    );
  }

  return parsed.data;
}

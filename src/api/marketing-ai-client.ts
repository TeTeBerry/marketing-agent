import { env, marketingAiEndpoint } from '../config/env.js';
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

export async function generatePlatformContent(
  request: GeneratePlatformContentRequest,
): Promise<PlatformContentResult> {
  const url = marketingAiEndpoint();

  const response = await fetch(url, {
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

import { env } from '../config/env.js';
import type {
  ApiSuccessResponse,
  InstagramAssetRequest,
  InstagramAssetsResult,
} from '../types/index.js';
import { MarketingAiApiError } from './marketing-ai-client.js';

function instagramAssetsEndpoint(): string {
  const base = env.backendInternalApiUrl;
  const path = base.endsWith('/api')
    ? '/internal/marketing-ai/generate-instagram-assets'
    : '/api/internal/marketing-ai/generate-instagram-assets';
  return `${base}${path}`;
}

export async function generateInstagramAssets(
  request: InstagramAssetRequest,
): Promise<InstagramAssetsResult> {
  const url = instagramAssetsEndpoint();

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
      `Instagram assets API failed (${response.status} ${response.statusText})`,
      response.status,
      rawBody,
    );
  }

  let parsed: ApiSuccessResponse<InstagramAssetsResult>;
  try {
    parsed = JSON.parse(rawBody) as ApiSuccessResponse<InstagramAssetsResult>;
  } catch {
    throw new MarketingAiApiError(
      'Instagram assets API returned invalid JSON',
      response.status,
      rawBody,
    );
  }

  if (parsed.code !== 200 || !parsed.data) {
    throw new MarketingAiApiError(
      `Instagram assets API error: ${parsed.message ?? 'unknown'}`,
      response.status,
      rawBody,
    );
  }

  return parsed.data;
}

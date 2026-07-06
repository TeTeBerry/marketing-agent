import { env, upcomingFestivalsEndpoint } from '../config/env.js';
import { mockFestivals } from './mock-festivals.js';
import type { ApiSuccessResponse, Festival } from '../types/index.js';
import { fetchBackend } from '../utils/backend-fetch.js';
import { formatFetchError } from '../utils/backend-health.js';
import { normalizeFestivalsForEnglishReport } from '../utils/festival-english.js';

type BackendFestival = Festival;

async function fetchUpcomingFestivalsFromBackend(): Promise<Festival[]> {
  const url = upcomingFestivalsEndpoint();

  const response = await fetchBackend(url, {
    method: 'GET',
    headers: {
      'x-internal-api-key': env.internalApiKey,
    },
  });

  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `upcoming-festivals failed (${response.status} ${response.statusText})${rawBody ? `: ${rawBody.slice(0, 200)}` : ''}`,
    );
  }

  let parsed: ApiSuccessResponse<BackendFestival[]>;
  try {
    parsed = JSON.parse(rawBody) as ApiSuccessResponse<BackendFestival[]>;
  } catch {
    throw new Error('upcoming-festivals returned invalid JSON');
  }

  if (parsed.code !== 200 || !Array.isArray(parsed.data)) {
    throw new Error(
      `upcoming-festivals error: ${parsed.message ?? 'invalid response shape'}`,
    );
  }

  return parsed.data;
}

export async function loadUpcomingFestivals(): Promise<Festival[]> {
  try {
    const festivals = await fetchUpcomingFestivalsFromBackend();
    if (festivals.length === 0) {
      console.warn(
        'Backend returned no upcoming festivals — falling back to mock data',
      );
      return normalizeFestivalsForEnglishReport(mockFestivals);
    }

    console.log(`Loaded ${festivals.length} upcoming festival(s) from backend`);
    return normalizeFestivalsForEnglishReport(festivals);
  } catch (error) {
    console.warn(
      `Failed to load festivals from backend (${formatFetchError(error)}) — falling back to mock data`,
    );
    return normalizeFestivalsForEnglishReport(mockFestivals);
  }
}

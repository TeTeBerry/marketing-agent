const baseUrl = (
  import.meta.env.VITE_BACKEND_INTERNAL_API_URL ??
  import.meta.env.BACKEND_INTERNAL_API_URL ??
  'http://127.0.0.1:3000/api'
).replace(/\/+$/, '');

const apiKey =
  import.meta.env.VITE_INTERNAL_API_KEY ??
  import.meta.env.INTERNAL_API_KEY ??
  '';

const prefix = baseUrl.endsWith('/api')
  ? '/internal/marketing-ai'
  : '/api/internal/marketing-ai';

function endpoint(path: string): string {
  return `${baseUrl}${prefix}/${path}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-internal-api-key': apiKey,
      ...(init?.headers ?? {}),
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(body || `Request failed (${response.status})`);
  }

  const parsed = JSON.parse(body) as { code: number; data: T; message?: string };
  if (parsed.code !== 200) {
    throw new Error(parsed.message ?? 'API error');
  }
  return parsed.data;
}

export type Festival = {
  activityLegacyId: number;
  id: string;
  name: string;
  venue: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  genres: string[];
  headlineArtists: Array<{ name: string; genreLabel: string }>;
  description: string;
  priority: number;
};

export type ContentSeriesMeta = {
  id: string;
  label: string;
  description: string;
  featured: boolean;
  requiresArtist?: boolean;
};

export type ContentPlatform = 'instagram' | 'threads' | 'tiktok' | 'seo';

export type ContentGenerationResult = {
  seriesType: string;
  platform: string;
  topic: string;
  hook?: string;
    result: {
    platform: string;
    title: string;
    content: string;
    hashtags: string[];
    cta: string;
    contentStyle: string;
    notes: string;
    decisionQuestion?: string;
    targetAudience?: string;
    recommendation?: string;
    hook?: string;
    contentStructure?: string;
    visualBrief?: {
      visualType: string;
      imagePrompt?: string;
      videoPrompt?: string;
      designLayout?: string;
      overlayText?: string[];
    };
    carousel?: Array<{ slide: number; headline: string; body: string }>;
  };
};

export type ArtistSearchHit = {
  name: string;
  genre: string;
  country?: string;
};

export const BRAND_VOICE =
  import.meta.env.VITE_BRAND_VOICE?.trim() ||
  'Raven: sharp, festival-savvy, community-first. We help ravers discover lineups, plan trips, and find their crew — never corporate, never cringe.';

export function listFestivals() {
  return apiFetch<Festival[]>('upcoming-festivals');
}

export function listContentSeries() {
  return apiFetch<ContentSeriesMeta[]>('content-series');
}

export function searchArtists(query: string) {
  return apiFetch<ArtistSearchHit[]>(
    `artists/search?q=${encodeURIComponent(query)}&limit=8`,
  );
}

export function generateContent(input: {
  brandVoice: string;
  festival: Record<string, unknown>;
  seriesType: string;
  platforms: ContentPlatform[];
  language: string;
  artistName?: string;
  topicHint?: string;
}) {
  return apiFetch<ContentGenerationResult[]>('generate-content', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

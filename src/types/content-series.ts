export const CONTENT_SERIES = [
  'festival_guide',
  'travel_guide',
  'lineup_breakdown',
  'artist_spotlight',
  'festival_intelligence',
  'community_discussion',
  'budget_guide',
  'packing_guide',
  'news_update',
] as const;

export type ContentSeries = (typeof CONTENT_SERIES)[number];

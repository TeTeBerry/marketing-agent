import type { MarketingPlatform } from './index.js';
import type { ContentSeries } from './content-series.js';

export const PLAN_CONTENT_TYPES = [
  'news',
  'guide',
  'discussion',
  'founder',
  'artist',
  'tips',
  'countdown',
] as const;

export type PlanContentType = (typeof PLAN_CONTENT_TYPES)[number];

export interface ContentPlan {
  seriesType: ContentSeries;
  platform: MarketingPlatform;
  festivalId: string;
  topic: string;
  contentType: PlanContentType;
  priority: number;
  artistName?: string;
}

import type { MarketingPlatform } from './index.js';

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
  platform: MarketingPlatform;
  festivalId: string;
  topic: string;
  contentType: PlanContentType;
  priority: number;
}

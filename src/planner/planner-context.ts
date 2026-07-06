import type { Festival } from '../types/index.js';

/** Optional signals for future planner inputs (trends, analytics, etc.). */
export type PlannerSignals = {
  redditTrending?: string[];
  googleTrends?: string[];
  analytics?: Record<string, number>;
};

export type PlannerInput = {
  festivals: Festival[];
  date: Date;
  signals?: PlannerSignals;
};

export type PlatformQuota = Record<
  'threads' | 'instagram' | 'tiktok' | 'x' | 'reddit',
  number
>;

export const DAILY_PLATFORM_QUOTAS: PlatformQuota = {
  threads: 5,
  instagram: 1,
  tiktok: 1,
  x: 1,
  reddit: 2,
};

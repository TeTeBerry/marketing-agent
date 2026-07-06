import type { ContentPlan } from './content-plan.js';
import type {
  FestivalLineupArtist,
  FestivalTimelineEntry,
} from './instagram-publishing-package.js';
import type { VisualBrief } from './visual-brief.js';

export const MARKETING_PLATFORMS = [
  'threads',
  'instagram',
  'tiktok',
  'x',
  'reddit',
] as const;

export const MARKETING_CONTENT_TYPES = [
  'news',
  'guide',
  'hook',
  'discussion',
  'seo',
] as const;

export type MarketingPlatform = (typeof MARKETING_PLATFORMS)[number];
export type MarketingContentType = (typeof MARKETING_CONTENT_TYPES)[number];

export type Festival = {
  /** Matches sync-app-backend activity catalog legacyId when set. */
  activityLegacyId?: number;
  id: string;
  name: string;
  /** Festival site, e.g. Wisdom Valley — shown on poster dashboard line. */
  venue: string;
  /** City or region, e.g. Pattaya. */
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  genres: string[];
  headlineArtists: FestivalLineupArtist[];
  lineupSchedulePublished?: boolean;
  /** Official timetable rows — only when lineupSchedulePublished is true. */
  timeline?: FestivalTimelineEntry[];
  description: string;
  priority: number;
  ticketUrl?: string;
  websiteUrl?: string;
};

export type GeneratePlatformContentRequest = {
  brandVoice: string;
  festival: Record<string, unknown>;
  platform: MarketingPlatform;
  contentType: MarketingContentType;
  language: string;
};

export type PlatformContentResult = {
  platform: MarketingPlatform;
  title: string;
  content: string;
  hashtags: string[];
  cta: string;
  contentStyle?: string;
  notes?: string;
  visualBrief?: VisualBrief;
  publishTime?: string;
  carousel?: Array<{
    slide: number;
    headline: string;
    body: string;
  }>;
};

export type ApiSuccessResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type FestivalPlatformContent = {
  festival: Festival;
  platform: MarketingPlatform;
  result: PlatformContentResult;
};

export type PlannedContentEntry = {
  plan: ContentPlan;
  festival: Festival | null;
  result: PlatformContentResult;
  instagramPackage?: import('./instagram-publishing-package.js').InstagramPublishingPackage;
};

export type PlannedContentFailure = {
  topic: string;
  platform: MarketingPlatform;
  error: string;
};

export type { ContentPlan, PlanContentType } from './content-plan.js';
export type { VisualBrief } from './visual-brief.js';
export type {
  CarouselSlideAssetInput,
  FestivalLineupArtist,
  FestivalTimelineEntry,
  InstagramAssetBrandStyle,
  InstagramAssetFestival,
  InstagramAssetPublishingPackage,
  InstagramAssetRequest,
  InstagramAssetsResult,
  InstagramCarouselSlide,
  InstagramGeneratedImage,
  InstagramPublishingPackage,
} from './instagram-publishing-package.js';

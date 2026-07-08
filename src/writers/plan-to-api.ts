import type { ContentPlan } from '../types/content-plan.js';
import type {
  Festival,
  GeneratePlatformContentRequest,
  MarketingContentType,
} from '../types/index.js';
import type { ContentSeries } from '../types/content-series.js';

const SERIES_TO_LEGACY_CONTENT_TYPE: Record<ContentSeries, MarketingContentType> =
  {
    festival_guide: 'seo',
    travel_guide: 'guide',
    lineup_breakdown: 'guide',
    artist_spotlight: 'guide',
    festival_intelligence: 'guide',
    community_discussion: 'discussion',
    budget_guide: 'guide',
    packing_guide: 'guide',
    news_update: 'news',
  };

const FOUNDER_FESTIVAL_CONTEXT = {
  context: 'founder-build-in-public',
  scope: 'product-startup-ai-travel',
  note: 'Not tied to a specific festival — founder insight post',
};

export function mapPlanToApiRequest(
  plan: ContentPlan,
  festival: Festival | null,
  brandVoice: string,
  language: string,
): GeneratePlatformContentRequest {
  const festivalPayload =
    plan.platform === 'x' || !festival
      ? {
          ...FOUNDER_FESTIVAL_CONTEXT,
          planTopic: plan.topic,
          plannerContentType: plan.contentType,
          seriesType: plan.seriesType,
        }
      : {
          ...festival,
          planTopic: plan.topic,
          plannerContentType: plan.contentType,
          seriesType: plan.seriesType,
          ...(plan.artistName ? { artistName: plan.artistName } : {}),
        };

  return {
    brandVoice,
    festival: festivalPayload,
    platform: plan.platform,
    contentType: SERIES_TO_LEGACY_CONTENT_TYPE[plan.seriesType],
    language,
    seriesType: plan.seriesType,
  };
}

import type { ContentPlan } from '../types/content-plan.js';
import type {
  Festival,
  GeneratePlatformContentRequest,
  MarketingContentType,
} from '../types/index.js';

const PLAN_TO_API_CONTENT_TYPE: Record<
  ContentPlan['contentType'],
  MarketingContentType
> = {
  news: 'news',
  guide: 'guide',
  discussion: 'discussion',
  founder: 'discussion',
  artist: 'guide',
  tips: 'guide',
  countdown: 'news',
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
        }
      : {
          ...festival,
          planTopic: plan.topic,
          plannerContentType: plan.contentType,
        };

  return {
    brandVoice,
    festival: festivalPayload,
    platform: plan.platform,
    contentType: PLAN_TO_API_CONTENT_TYPE[plan.contentType],
    language,
  };
}

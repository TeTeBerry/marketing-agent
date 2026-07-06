import type { ContentPlan } from '../types/content-plan.js';
import type { Festival, PlatformContentResult } from '../types/index.js';
import {
  DEFAULT_RAVEN_BRAND_STYLE,
  type CarouselSlideAssetInput,
  type InstagramAssetRequest,
} from '../types/instagram-publishing-package.js';

type BuildInstagramAssetRequestInput = {
  plan: ContentPlan;
  festival: Festival;
  result: PlatformContentResult;
};

function formatFestivalDates(festival: Festival): string {
  const start = new Date(`${festival.startDate}T00:00:00Z`);
  const end = new Date(`${festival.endDate}T00:00:00Z`);
  const startMonth = start.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const endMonth = end.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getUTCDate()}–${end.getUTCDate()}`;
  }

  return `${startMonth} ${start.getUTCDate()}–${endMonth} ${end.getUTCDate()}`;
}

function buildSlideImageDescription(
  slide: NonNullable<PlatformContentResult['carousel']>[number],
  festival: Festival,
  slideIndex: number,
  visualBriefImagePrompt?: string,
): string {
  if (slideIndex === 0 && visualBriefImagePrompt) {
    return visualBriefImagePrompt.slice(0, 500);
  }

  return [
    `Premium editorial festival travel visual for ${festival.name}`,
    `highlighting "${slide.headline}"`,
    slide.body ? `with context: ${slide.body}` : '',
    'subtle stage light accents and clean negative space',
  ]
    .filter(Boolean)
    .join(', ')
    .slice(0, 500);
}

function buildSlideOverlayText(
  slide: NonNullable<PlatformContentResult['carousel']>[number],
  overlayLines: string[] | undefined,
  slideIndex: number,
): string[] {
  const fromBrief = overlayLines?.[slideIndex]?.trim();
  if (fromBrief) {
    return [fromBrief];
  }

  return [slide.headline, slide.body].map((line) => line.trim()).filter(Boolean);
}

function buildCarouselAssetInputs(
  result: PlatformContentResult,
  festival: Festival,
): CarouselSlideAssetInput[] {
  const slides = result.carousel ?? [];
  const overlayLines = result.visualBrief?.overlayText;
  const visualBriefImagePrompt = result.visualBrief?.imagePrompt;

  return slides.map((slide, index) => ({
    slide: slide.slide,
    headline: slide.headline,
    body: slide.body,
    imageDescription: buildSlideImageDescription(
      slide,
      festival,
      index,
      visualBriefImagePrompt,
    ),
    overlayText: buildSlideOverlayText(slide, overlayLines, index),
    aspectRatio: '4:5' as const,
  }));
}

export function buildInstagramAssetRequest(
  input: BuildInstagramAssetRequestInput,
): InstagramAssetRequest {
  const { plan, festival, result } = input;

  return {
    festival: {
      id: festival.id,
      name: festival.name,
      location: festival.location,
      country: festival.country,
      dates: formatFestivalDates(festival),
      genres: festival.genres,
      artists: festival.headlineArtists,
    },
    publishingPackage: {
      topic: plan.topic,
      caption: result.content,
      hashtags: result.hashtags,
      publishTime: result.publishTime ?? '18:30 GMT+7',
    },
    brandStyle: DEFAULT_RAVEN_BRAND_STYLE,
    carousel: buildCarouselAssetInputs(result, festival),
  };
}

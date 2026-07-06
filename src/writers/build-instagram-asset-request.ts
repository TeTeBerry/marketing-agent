import type { ContentPlan } from '../types/content-plan.js';
import type { Festival, PlatformContentResult } from '../types/index.js';
import type { VisualBrief } from '../types/visual-brief.js';
import {
  DEFAULT_RAVEN_BRAND_STYLE,
  type CarouselSlideAssetInput,
  type FestivalLineupArtist,
  type FestivalTimelineEntry,
  type InstagramAssetRequest,
  type PosterSizeId,
} from '../types/instagram-publishing-package.js';
import { resolveFestivalCoverImageKey } from '../utils/festival-activity-image.js';

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

function buildMockTimeline(
  artists: FestivalLineupArtist[],
): FestivalTimelineEntry[] {
  const times = ['6:30 PM', '9:00 PM', '11:30 PM', '1:00 AM'];

  return artists.slice(0, 4).map((artist, index) => ({
    time: times[index] ?? times[times.length - 1],
    artistName: artist.name,
    stageLabel: 'Main Stage',
    genreLabel: artist.genreLabel,
  }));
}

function resolvePosterSizeId(visualBrief?: VisualBrief): PosterSizeId {
  const ratio = visualBrief?.aspectRatio;
  if (
    ratio === '1:1' ||
    ratio === '4:5' ||
    ratio === '9:16' ||
    ratio === '16:9'
  ) {
    return ratio;
  }
  return '4:5';
}

function buildCarouselAssetInputs(
  result: PlatformContentResult,
): CarouselSlideAssetInput[] {
  const slides = result.carousel ?? [];
  const aspectRatio = resolvePosterSizeId(result.visualBrief);

  return slides.map((slide) => ({
    slide: slide.slide,
    headline: slide.headline,
    body: slide.body,
    imageDescription: slide.headline,
    overlayText: [slide.headline],
    aspectRatio,
  }));
}

export function buildInstagramAssetRequest(input: {
  plan: ContentPlan;
  festival: Festival;
  result: PlatformContentResult;
}): InstagramAssetRequest {
  const { plan, festival, result } = input;
  const lineupSchedulePublished = festival.lineupSchedulePublished ?? false;

  return {
    festival: {
      id: festival.id,
      name: festival.name,
      venue: festival.venue,
      location: festival.location,
      country: festival.country,
      dates: formatFestivalDates(festival),
      startDate: festival.startDate,
      endDate: festival.endDate,
      lineupArtists: festival.headlineArtists,
      lineupSchedulePublished,
      timeline: lineupSchedulePublished
        ? (festival.timeline ?? buildMockTimeline(festival.headlineArtists))
        : undefined,
      image: resolveFestivalCoverImageKey(festival.id),
    },
    publishingPackage: {
      topic: plan.topic,
      caption: result.content,
      hashtags: result.hashtags,
      publishTime: result.publishTime ?? '18:30 GMT+7',
    },
    brandStyle: DEFAULT_RAVEN_BRAND_STYLE,
    carousel: buildCarouselAssetInputs(result),
  };
}

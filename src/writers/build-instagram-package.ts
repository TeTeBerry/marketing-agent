import type { PlatformContentResult } from '../types/index.js';
import type { InstagramGeneratedImage } from '../types/instagram-publishing-package.js';
import { buildInstagramPosterMarkdown } from '../outputs/instagram-poster-markdown.js';
import {
  INSTAGRAM_PUBLISHING_CHECKLIST,
  type InstagramAssetRequest,
  type InstagramCarouselSlide,
  type InstagramPublishingPackage,
} from '../types/instagram-publishing-package.js';

type BuildInstagramPackageInput = {
  topic: string;
  result: PlatformContentResult;
  assetRequest: InstagramAssetRequest;
  language: string;
  posterImages?: InstagramGeneratedImage[];
};

export function buildInstagramPublishingPackage(
  input: BuildInstagramPackageInput,
): InstagramPublishingPackage {
  const carousel: InstagramCarouselSlide[] = (input.result.carousel ?? []).map(
    (slide) => ({
      slide: slide.slide,
      headline: slide.headline,
      body: slide.body,
    }),
  );

  return {
    topic: input.topic,
    caption: input.result.content,
    hashtags: input.result.hashtags,
    publishTime: input.result.publishTime ?? '18:30 GMT+7',
    assetRequest: input.assetRequest,
    posterMarkdown: buildInstagramPosterMarkdown(
      input.assetRequest,
      input.language,
    ),
    posterImages: input.posterImages ?? [],
    carousel,
    checklist: [...INSTAGRAM_PUBLISHING_CHECKLIST],
  };
}

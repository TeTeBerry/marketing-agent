import type { PlatformContentResult } from '../types/index.js';
import {
  INSTAGRAM_PUBLISHING_CHECKLIST,
  type InstagramCarouselSlide,
  type InstagramGeneratedImage,
  type InstagramPublishingPackage,
} from '../types/instagram-publishing-package.js';

type BuildInstagramPackageInput = {
  topic: string;
  result: PlatformContentResult;
  images: InstagramGeneratedImage[];
};

export function buildInstagramPublishingPackage(
  input: BuildInstagramPackageInput,
): InstagramPublishingPackage {
  const poster = input.images[0];
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
    posterImagePath: poster?.imagePath,
    carousel,
    checklist: [...INSTAGRAM_PUBLISHING_CHECKLIST],
  };
}

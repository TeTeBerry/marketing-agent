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

function mergeCarouselWithImages(
  carousel: InstagramCarouselSlide[],
  images: InstagramGeneratedImage[],
): InstagramCarouselSlide[] {
  const imageBySlide = new Map(
    images.map((image) => [image.slide, image.imagePath]),
  );

  return carousel.map((slide) => ({
    ...slide,
    imagePath: imageBySlide.get(slide.slide),
  }));
}

export function buildInstagramPublishingPackage(
  input: BuildInstagramPackageInput,
): InstagramPublishingPackage {
  const carousel = mergeCarouselWithImages(
    input.result.carousel ?? [],
    input.images,
  );

  return {
    topic: input.topic,
    caption: input.result.content,
    hashtags: input.result.hashtags,
    publishTime: input.result.publishTime ?? '18:30 GMT+7',
    carousel,
    checklist: [...INSTAGRAM_PUBLISHING_CHECKLIST],
  };
}

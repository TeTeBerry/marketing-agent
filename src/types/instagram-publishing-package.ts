export type InstagramCarouselSlide = {
  slide: number;
  headline: string;
  body: string;
  imagePath?: string;
};

export type InstagramGeneratedImage = {
  slide: number;
  title: string;
  imageUrl: string;
  cloudPath: string;
};

export type InstagramPublishingPackage = {
  topic: string;
  caption: string;
  hashtags: string[];
  publishTime: string;
  carousel: InstagramCarouselSlide[];
  checklist: string[];
};

export const INSTAGRAM_PUBLISHING_CHECKLIST = [
  'Review spelling',
  'Verify lineup',
  'Upload carousel',
  'Paste caption',
  'Paste hashtags',
] as const;

export type GenerateInstagramAssetsRequest = {
  festival: Record<string, unknown>;
  caption: string;
  carousel: Array<{
    slide: number;
    headline: string;
    body: string;
  }>;
  brandStyle: string;
  language: string;
};

export type InstagramAssetsResult = {
  images: InstagramGeneratedImage[];
};

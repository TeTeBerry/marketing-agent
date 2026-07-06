export type InstagramAssetFestival = {
  id: string;
  name: string;
  location?: string;
  country?: string;
  dates?: string;
  genres?: string[];
  artists?: string[];
};

export type InstagramAssetPublishingPackage = {
  topic: string;
  caption: string;
  hashtags: string[];
  publishTime?: string;
};

export type InstagramAssetBrandStyle = {
  brandName: 'Raven';
  mood: 'premium' | 'minimal' | 'editorial';
  background: 'dark';
  colorPalette: string[];
  typography: 'clean sans-serif';
  visualTone: string[];
  avoid: string[];
};

export type CarouselSlideAssetInput = {
  slide: number;
  headline: string;
  body: string;
  imageDescription: string;
  overlayText: string[];
  aspectRatio: '4:5';
};

export type InstagramAssetRequest = {
  festival: InstagramAssetFestival;
  publishingPackage: InstagramAssetPublishingPackage;
  brandStyle: InstagramAssetBrandStyle;
  carousel: CarouselSlideAssetInput[];
};

export type InstagramCarouselSlide = {
  slide: number;
  headline: string;
  body: string;
  imagePath?: string;
  imageUrl?: string;
  imageLocalPath?: string;
};

export type InstagramGeneratedImage = {
  slide: number;
  title: string;
  imagePath: string;
  imageUrl: string;
  imageLocalPath?: string;
  promptUsed?: string;
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

export const DEFAULT_RAVEN_BRAND_STYLE: InstagramAssetBrandStyle = {
  brandName: 'Raven',
  mood: 'premium',
  background: 'dark',
  colorPalette: ['deep purple', 'electric blue', 'black'],
  typography: 'clean sans-serif',
  visualTone: [
    'festival travel',
    'minimal',
    'premium',
    'editorial',
    'not nightclub flyer',
  ],
  avoid: [
    'crowded party photos',
    'cheap EDM flyer style',
    'too many neon elements',
    'overly busy layout',
    'unreadable small text',
  ],
};

export type InstagramAssetsResult = {
  images: InstagramGeneratedImage[];
};

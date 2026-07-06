export type FestivalLineupArtist = {
  name: string;
  genreLabel: string;
};

export type FestivalTimelineEntry = {
  time: string;
  artistName: string;
  stageLabel: string;
  genreLabel: string;
};

export type InstagramAssetFestival = {
  id: string;
  name: string;
  /** Festival site / venue, e.g. Wisdom Valley. */
  venue?: string;
  location?: string;
  country?: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  lineupArtists?: FestivalLineupArtist[];
  lineupSchedulePublished?: boolean;
  timeline?: FestivalTimelineEntry[];
  image?: string;
  coverImageUrl?: string;
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

export type PosterSizeId =
  | '4:5'
  | '1:1'
  | '9:16'
  | '4:3'
  | '16:9'
  | 'mobile'
  | 'desktop';

export type CarouselSlideAssetInput = {
  slide: number;
  headline: string;
  body: string;
  imageDescription: string;
  overlayText: string[];
  aspectRatio: PosterSizeId;
};

export type InstagramAssetRequest = {
  festival: InstagramAssetFestival;
  publishingPackage: InstagramAssetPublishingPackage;
  brandStyle: InstagramAssetBrandStyle;
  outputSize?: PosterSizeId;
  carousel: CarouselSlideAssetInput[];
};

export type InstagramCarouselSlide = {
  slide: number;
  headline: string;
  body: string;
  imagePath?: string;
};

export type InstagramGeneratedImage = {
  slide: number;
  title: string;
  imagePath: string;
  promptUsed?: string;
  width?: number;
  height?: number;
  sizeId?: PosterSizeId;
  downloadUrl?: string;
};

export type InstagramPublishingPackage = {
  topic: string;
  caption: string;
  hashtags: string[];
  publishTime: string;
  assetRequest: InstagramAssetRequest;
  posterMarkdown: string;
  carousel: InstagramCarouselSlide[];
  checklist: string[];
};

export const DEFAULT_RAVEN_BRAND_STYLE: InstagramAssetBrandStyle = {
  brandName: 'Raven',
  mood: 'premium',
  background: 'dark',
  colorPalette: ['#8b7cf8', '#6e66e8', '#08080c'],
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

export const INSTAGRAM_PUBLISHING_CHECKLIST = [
  'Review spelling',
  'Verify lineup',
  'Export poster from Markdown Poster',
  'Paste caption',
  'Paste hashtags',
] as const;

export type InstagramAssetsResult = {
  images: InstagramGeneratedImage[];
};

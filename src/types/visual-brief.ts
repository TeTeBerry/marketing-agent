export type VisualBrief = {
  visualType:
    | 'carousel'
    | 'single-image'
    | 'reel'
    | 'short-video'
    | 'text-only';
  imagePrompt?: string;
  videoPrompt?: string;
  designLayout?: string;
  aspectRatio?: '1:1' | '4:5' | '9:16' | '16:9';
  assetsNeeded?: string[];
  referenceStyle?: string;
  overlayText?: string[];
  notes?: string;
};

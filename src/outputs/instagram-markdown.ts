import type { InstagramPublishingPackage } from '../types/instagram-publishing-package.js';

const SECTION_DIVIDER = '----------------------------';

function formatHashtags(hashtags: string[]): string {
  if (hashtags.length === 0) {
    return '_none_';
  }
  return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
}

function renderSlideImage(
  slide: InstagramPublishingPackage['carousel'][number],
): string[] {
  const imageSrc = slide.imageLocalPath ?? slide.imageUrl;
  if (imageSrc) {
    const lines = [
      'Image',
      '',
      `![Slide ${slide.slide}](${imageSrc})`,
      '',
    ];
    if (slide.imagePath) {
      lines.push(`_${slide.imagePath}_`, '');
    }
    return lines;
  }

  return [
    'Image',
    '',
    slide.imagePath ?? '_pending generation_',
    '',
  ];
}

function renderCarouselSlide(
  slide: InstagramPublishingPackage['carousel'][number],
): string[] {
  return [
    `### Slide ${slide.slide}`,
    '',
    slide.headline,
    '',
    slide.body,
    '',
    ...renderSlideImage(slide),
    SECTION_DIVIDER,
    '',
  ];
}

export function renderInstagramPublishingPackage(
  pkg: InstagramPublishingPackage,
): string[] {
  const lines = [
    '# Instagram',
    '',
    '## Topic',
    '',
    pkg.topic,
    '',
    SECTION_DIVIDER,
    '',
    '## Publish Time',
    '',
    pkg.publishTime,
    '',
    SECTION_DIVIDER,
    '',
    '## Caption',
    '',
    pkg.caption,
    '',
    SECTION_DIVIDER,
    '',
    '## Hashtags',
    '',
    formatHashtags(pkg.hashtags),
    '',
    SECTION_DIVIDER,
    '',
    '## Carousel',
    '',
  ];

  for (const slide of pkg.carousel) {
    lines.push(...renderCarouselSlide(slide));
  }

  lines.push(
    '## Publishing Checklist',
    '',
    ...pkg.checklist.map((item) => `✓ ${item}`),
    '',
  );

  return lines;
}

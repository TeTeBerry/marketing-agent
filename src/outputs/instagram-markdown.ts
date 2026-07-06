import type { InstagramPublishingPackage } from '../types/instagram-publishing-package.js';

const SECTION_DIVIDER = '----------------------------';

function formatHashtags(hashtags: string[]): string {
  if (hashtags.length === 0) {
    return '_none_';
  }
  return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
}

function renderContentSection(
  slide: InstagramPublishingPackage['carousel'][number],
): string[] {
  return [
    `### ${slide.slide}. ${slide.headline}`,
    '',
    slide.body,
    '',
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
    '## Poster Image',
    '',
    pkg.posterImagePath ?? '_pending generation_',
    '',
    SECTION_DIVIDER,
    '',
    '## Content Sections',
    '',
    '_Consolidated into the poster image above._',
    '',
  ];

  for (const slide of pkg.carousel) {
    lines.push(...renderContentSection(slide));
  }

  lines.push(
    '## Publishing Checklist',
    '',
    ...pkg.checklist.map((item) => `✓ ${item}`),
    '',
  );

  return lines;
}

import type { InstagramPublishingPackage } from '../types/instagram-publishing-package.js';

const SECTION_DIVIDER = '----------------------------';

function formatHashtags(hashtags: string[]): string {
  if (hashtags.length === 0) {
    return '_none_';
  }
  return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
}

export function renderInstagramPublishingPackage(
  pkg: InstagramPublishingPackage,
): string[] {
  const posterImage = pkg.posterImages[0];
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
  ];

  if (posterImage) {
    lines.push(
      `**File:** \`${posterImage.imagePath}\``,
      '',
      `**Size:** ${posterImage.sizeId ?? '1:1'} (${posterImage.width ?? '?'}×${posterImage.height ?? '?'})`,
      '',
    );
    if (posterImage.downloadUrl) {
      lines.push(`**Download:** ${posterImage.downloadUrl}`, '');
    }
    if (posterImage.promptUsed) {
      lines.push(`**Render:** ${posterImage.promptUsed}`, '');
    }
  } else {
    lines.push('_Poster image was not generated._', '');
  }

  lines.push(
    SECTION_DIVIDER,
    '',
    '## Poster Markdown',
    '',
    '_Source copy used for the rendered poster (centered travel guide layout)._',
    '',
    '```markdown',
    pkg.posterMarkdown.trimEnd(),
    '```',
    '',
    SECTION_DIVIDER,
    '',
    '## Publishing Checklist',
    '',
    ...pkg.checklist.map((item) => `✓ ${item}`),
    '',
  );

  return lines;
}

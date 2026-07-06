import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MarketingPlatform, PlannedContentEntry } from '../types/index.js';
import type { VisualBrief } from '../types/visual-brief.js';
import {
  isPromotionalXContent,
  X_FOUNDER_NOTE,
  X_PROMO_WARNING,
} from '../utils/x-content-guard.js';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const PLATFORM_SECTION_ORDER: MarketingPlatform[] = [
  'threads',
  'instagram',
  'tiktok',
  'x',
  'reddit',
];

const PLATFORM_HEADINGS: Record<MarketingPlatform, string> = {
  threads: 'Threads',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X',
  reddit: 'Reddit',
};

export function todayDateString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function dailyMarkdownPath(date = new Date()): string {
  return path.join(
    packageRoot,
    'generated',
    'daily',
    `${todayDateString(date)}.md`,
  );
}

function formatList(items: string[] | undefined): string {
  if (!items || items.length === 0) {
    return '_none_';
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function renderVisualBrief(visualBrief?: VisualBrief): string[] {
  if (!visualBrief || visualBrief.visualType === 'text-only') {
    return ['### Visual Brief', '', 'Visual: text-only', ''];
  }

  return [
    '### Visual Brief',
    '',
    `**Visual Type:** ${visualBrief.visualType}`,
    `**Aspect Ratio:** ${visualBrief.aspectRatio ?? '_unspecified_'}`,
    `**Overlay Text:**`,
    formatList(visualBrief.overlayText),
    '',
    `**Assets Needed:**`,
    formatList(visualBrief.assetsNeeded),
    '',
    `**Image Prompt:** ${visualBrief.imagePrompt ?? '_none_'}`,
    '',
    `**Video Prompt:** ${visualBrief.videoPrompt ?? '_none_'}`,
    '',
    `**Design Layout:**`,
    visualBrief.designLayout ?? '_none_',
    '',
    `**Reference Style:** ${visualBrief.referenceStyle ?? '_none_'}`,
    '',
    `**Notes:** ${visualBrief.notes ?? '_none_'}`,
    '',
  ];
}

function formatHashtags(hashtags: string[]): string {
  if (hashtags.length === 0) {
    return '_none_';
  }
  return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
}

function renderPost(entry: PlannedContentEntry, postNumber: number): string[] {
  const { plan, festival, result } = entry;
  const lines = [`### Post ${postNumber}`, ''];

  lines.push(`**Topic:** ${plan.topic}`, '');
  lines.push(`**Content type:** ${plan.contentType}`, '');

  if (festival) {
    lines.push(
      `**Festival:** ${festival.name} (${festival.location}, ${festival.country})`,
      '',
    );
  } else if (plan.platform === 'x') {
    lines.push('**Festival:** _not tied to a festival (founder post)_', '');
  }

  if (result.title) {
    lines.push(`**Title:** ${result.title}`, '');
  }

  lines.push(result.content, '');

  if (result.hashtags.length > 0) {
    lines.push(`**Hashtags:** ${formatHashtags(result.hashtags)}`, '');
  }

  if (result.cta) {
    lines.push(`**CTA:** ${result.cta}`, '');
  }

  if (result.contentStyle) {
    lines.push(`**Style:** ${result.contentStyle}`, '');
  }

  if (result.notes?.trim()) {
    lines.push(`**Notes:** ${result.notes.trim()}`, '');
  }

  if (plan.platform === 'x' && isPromotionalXContent(result.content)) {
    lines.push(X_PROMO_WARNING, '');
  }

  lines.push(...renderVisualBrief(result.visualBrief));

  return lines;
}

function renderPlatformSection(
  platform: MarketingPlatform,
  entries: PlannedContentEntry[],
): string[] {
  const platformEntries = entries.filter(
    (entry) => entry.plan.platform === platform,
  );
  if (platformEntries.length === 0) {
    return [];
  }

  const lines = [`## ${PLATFORM_HEADINGS[platform]}`, ''];

  if (platform === 'x') {
    lines.push(`> ${X_FOUNDER_NOTE}`, '');
  }

  platformEntries.forEach((entry, index) => {
    lines.push(...renderPost(entry, index + 1));
  });

  return lines;
}

export async function writeDailyMarkdown(
  entries: PlannedContentEntry[],
  date = new Date(),
): Promise<string> {
  const outputPath = dailyMarkdownPath(date);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const lines = [
    '# Raven Daily Content Plan',
    '',
    `_${todayDateString(date)} · ${entries.length} planned post(s)_`,
    '',
  ];

  for (const platform of PLATFORM_SECTION_ORDER) {
    lines.push(...renderPlatformSection(platform, entries));
  }

  await writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
  return outputPath;
}

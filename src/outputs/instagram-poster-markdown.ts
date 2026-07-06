import { getFestivalPosterCopy } from '../content/festival-poster-copy.js';
import type { InstagramAssetRequest } from '../types/instagram-publishing-package.js';

const COUNTRY_FLAG_EMOJI: Record<string, string> = {
  Thailand: '🇹🇭',
  Japan: '🇯🇵',
  'South Korea': '🇰🇷',
  Korea: '🇰🇷',
  Belgium: '🇧🇪',
  Netherlands: '🇳🇱',
  'United States': '🇺🇸',
  USA: '🇺🇸',
  'United Kingdom': '🇬🇧',
  UK: '🇬🇧',
  Romania: '🇷🇴',
  UAE: '🇦🇪',
  China: '🇨🇳',
};

function resolveCountryFlag(country?: string): string {
  if (!country?.trim()) {
    return '';
  }

  return COUNTRY_FLAG_EMOJI[country.trim()] ?? '';
}

function formatPosterDates(
  festival: InstagramAssetRequest['festival'],
  language: string,
): string {
  if (!festival.startDate || !festival.endDate) {
    return festival.dates?.trim() ?? '';
  }

  const start = new Date(`${festival.startDate}T00:00:00Z`);
  const end = new Date(`${festival.endDate}T00:00:00Z`);
  const year = start.getUTCFullYear();
  const locale = language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
  const startMonth = start.toLocaleString(locale, {
    month: 'long',
    timeZone: 'UTC',
  });
  const endMonth = end.toLocaleString(locale, {
    month: 'long',
    timeZone: 'UTC',
  });

  if (startMonth === endMonth) {
    if (language.toLowerCase().startsWith('zh')) {
      return `${year}年${startMonth}${start.getUTCDate()}–${end.getUTCDate()}日`;
    }

    return `${startMonth} ${start.getUTCDate()}–${end.getUTCDate()}, ${year}`;
  }

  if (language.toLowerCase().startsWith('zh')) {
    return `${year}年${startMonth}${start.getUTCDate()}日–${endMonth}${end.getUTCDate()}日`;
  }

  return `${startMonth} ${start.getUTCDate()}–${endMonth} ${end.getUTCDate()}, ${year}`;
}

function formatLocationLine(festival: InstagramAssetRequest['festival']): string {
  const place = [festival.venue?.trim(), festival.location?.trim()].filter(Boolean).join(', ');
  return place ? `📍 ${place}` : '';
}

function formatLineupArtists(festival: InstagramAssetRequest['festival']): string[] {
  const artists = festival.lineupArtists ?? [];
  if (artists.length === 0) {
    return [];
  }

  return artists.slice(0, 3).map((artist) => artist.name);
}

function formatGuideItems(
  guideItems: ReturnType<typeof getFestivalPosterCopy>['guideItems'],
): string[] {
  const lines: string[] = [];

  for (const item of guideItems) {
    lines.push(item.heading, item.subtitle, '');
  }

  if (lines.length > 0) {
    lines.pop();
  }

  return lines;
}

export function buildInstagramPosterMarkdown(
  input: InstagramAssetRequest,
  language = 'en',
): string {
  const copy = getFestivalPosterCopy(language);
  const festival = input.festival;
  const flag = resolveCountryFlag(festival.country);
  const titleSuffix = flag ? ` ${flag}` : '';
  const locationLine = formatLocationLine(festival);
  const lines = [
    `# ${festival.name.trim()}${titleSuffix}`,
    '',
    `## ${copy.sectionTitle}`,
    '',
    ...(locationLine ? [locationLine] : []),
    `📅 ${formatPosterDates(festival, language)}`,
    '',
    copy.separator,
    '',
  ];

  const lineup = formatLineupArtists(festival);
  if (lineup.length > 0) {
    lines.push(copy.lineupHeading, '', ...lineup, '', copy.separator, '');
  }

  lines.push(...formatGuideItems(copy.guideItems), '', copy.separator, '', copy.follow, '', copy.tagline, '');

  return lines.join('\n');
}

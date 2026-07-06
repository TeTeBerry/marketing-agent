import { getSyncWebHomeCopy } from '../content/sync-web-home-copy.js';
import type {
  InstagramAssetRequest,
  FestivalTimelineEntry,
} from '../types/instagram-publishing-package.js';

function buildFestivalMeta(festival: InstagramAssetRequest['festival']): string {
  const cityLine = [festival.location, festival.country]
    .filter(Boolean)
    .join(', ');

  const placeLine = [festival.venue?.trim(), cityLine]
    .filter(Boolean)
    .join(' · ');

  return [placeLine, festival.dates].filter(Boolean).join(' · ');
}

function buildFlightRoute(
  festival: InstagramAssetRequest['festival'],
  language: string,
): string {
  const destination = festival.location?.trim() || festival.country?.trim() || 'festival city';
  if (language.toLowerCase().startsWith('zh')) {
    return `飞往${destination} · 抵达日`;
  }

  return `Fly in → ${destination} · arrival day`;
}

function buildHotelName(
  festival: InstagramAssetRequest['festival'],
  language: string,
): string {
  const venue = festival.location?.trim() || 'venue';
  if (language.toLowerCase().startsWith('zh')) {
    return `${venue} 附近`;
  }

  return `Near ${venue}`;
}

function renderHeadliners(
  festival: InstagramAssetRequest['festival'],
  language: string,
): string[] {
  const artists = festival.lineupArtists ?? [];
  if (artists.length === 0) {
    return [];
  }

  const label = language.toLowerCase().startsWith('zh') ? '阵容亮点' : 'Headliners';
  const lines = [`### ${label}`, ''];

  for (const artist of artists) {
    const style = artist.genreLabel.trim();
    lines.push(
      style ? `- **${artist.name}** · ${style}` : `- **${artist.name}**`,
    );
  }

  lines.push('');
  return lines;
}

function formatTimelineEntry(entry: FestivalTimelineEntry): string {
  const style = entry.genreLabel.trim();
  if (style) {
    return `${entry.time} · ${entry.artistName} · ${style} · ${entry.stageLabel}`;
  }

  return `${entry.time} · ${entry.artistName} · ${entry.stageLabel}`;
}

function renderTimeline(
  festival: InstagramAssetRequest['festival'],
  language: string,
): string[] {
  const entries = festival.timeline ?? [];
  if (!festival.lineupSchedulePublished || entries.length === 0) {
    return [];
  }

  const copy = getSyncWebHomeCopy(language);
  return [
    `### ${copy.tabs.timeline}`,
    '',
    ...entries.map((entry) => `- ${formatTimelineEntry(entry)}`),
    '',
  ];
}

function renderPackingEssentials(
  copy: ReturnType<typeof getSyncWebHomeCopy>,
): string[] {
  return [
    `### ${copy.tabs.packing}`,
    '',
    `**${copy.packing.essentialsLabel}**`,
    '',
    ...copy.packing.essentials.map((item) => `- ${item}`),
    '',
  ];
}

export function buildInstagramPosterMarkdown(
  input: InstagramAssetRequest,
  language = 'en',
): string {
  const copy = getSyncWebHomeCopy(language);
  const festival = input.festival;
  const festivalMeta = buildFestivalMeta(festival);
  const budgetTotal = language.toLowerCase().startsWith('zh') ? '¥4,200' : '$580';
  const showTimeline = Boolean(
    festival.lineupSchedulePublished && (festival.timeline?.length ?? 0) > 0,
  );

  const lines = [
    `# ${festival.name.trim()}`,
    '',
    `> ${festivalMeta}`,
    `> ${copy.heroLead}`,
    '',
    copy.imagePlaceholder,
    '',
    `## ${copy.plannerTitle}`,
    '',
    copy.plannerLead,
    '',
    `**${festival.name.trim()}** · ${festivalMeta}`,
    '',
    `### ${copy.tabs.trip}`,
    '',
    `1. **${copy.trip.flightLabel}** — ${buildFlightRoute(festival, language)}`,
    `2. **${copy.trip.hotelLabel}** — ${buildHotelName(festival, language)} · ${copy.trip.hotelDetail}`,
    `3. **${copy.trip.shuttleLabel}** — ${copy.trip.shuttleDetail}`,
    '',
  ];

  if (showTimeline) {
    lines.push(...renderTimeline(festival, language));
  } else {
    lines.push(...renderHeadliners(festival, language));
  }

  lines.push(
    `### ${copy.tabs.budget}`,
    '',
    `**${budgetTotal}** · ${copy.budget.perPerson}`,
    '',
  );

  for (const [index, item] of copy.budget.items.entries()) {
    lines.push(`${index + 1}. ${item}`);
  }

  lines.push('', ...renderPackingEssentials(copy), '---', '', '@Raven', '', `_${copy.footerTagline}_`, '');

  return lines.join('\n');
}

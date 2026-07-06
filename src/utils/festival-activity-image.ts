/** Maps marketing-agent festival ids to CloudBase activity cover keys. */
const FESTIVAL_COVER_IMAGE_BY_ID: Record<string, string> = {
  'tomorrowland-thailand-2026': 'static/activity/tomorrowland.jpg',
  'ultra-japan-2026': 'static/activity/ultra-japan.jpg',
  'edc-thailand-2026': 'static/activity/edc-thailand.jpg',
  'storm-shenzhen-2026': 'static/activity/storm.webp',
  'edc-korea-2026': 'static/activity/edc-korea.png',
  'defqon1-2026': 'static/activity/defqon1.jpg',
  's2o-korea-2026': 'static/activity/s2o.png',
};

export function resolveFestivalCoverImageKey(festivalId: string): string | undefined {
  const direct = FESTIVAL_COVER_IMAGE_BY_ID[festivalId.trim()];
  if (direct) {
    return direct;
  }

  const code = festivalId
    .trim()
    .toLowerCase()
    .replace(/-\d{4}$/, '')
    .split('-')[0];

  if (!code) {
    return undefined;
  }

  return `static/activity/${code}.jpg`;
}

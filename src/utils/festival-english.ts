import type { Festival } from '../types/index.js';

const CJK_PATTERN = /[\u4e00-\u9fff]/;

const CITY_EN: Record<string, string> = {
  芭提雅: 'Pattaya',
  普吉岛: 'Phuket',
  深圳: 'Shenzhen',
  上海: 'Shanghai',
  东京: 'Tokyo',
  台场: 'Odaiba',
  仁川: 'Incheon',
  荷兰: 'Netherlands',
  比利时: 'Belgium',
  罗马尼亚: 'Romania',
  英国: 'United Kingdom',
  阿联酋: 'United Arab Emirates',
  美国: 'United States',
  沙特: 'Saudi Arabia',
  克罗地亚: 'Croatia',
  日本: 'Japan',
  韩国: 'South Korea',
  泰国: 'Thailand',
  中国: 'China',
};

const FESTIVAL_ENGLISH_BY_CODE: Record<
  string,
  Partial<Pick<Festival, 'name' | 'location' | 'venue' | 'description'>>
> = {
  tomorrowland: {
    location: 'Pattaya',
    venue: 'Wisdom Valley',
  },
  storm: {
    name: 'STORM Festival Shenzhen 2026',
    location: 'Shenzhen',
    venue: 'Shenzhen World Exhibition & Convention Center',
  },
  'edc-thailand': {
    location: 'Phuket',
    venue: 'Rhythm Park',
  },
  s2o: {
    location: 'Seoul',
    venue: 'Seoul Land',
  },
  defqon1: {
    location: 'Biddinghuizen',
    venue: 'Walibi Holland',
  },
  'world-dj-festival': {
    location: 'Tokyo',
    venue: 'Umi no Mori Water Stadium',
  },
  'tomorrowland-belgium': {
    location: 'Boom',
    venue: 'De Schorre',
  },
  'edc-korea': {
    location: 'Incheon',
    venue: 'Inspire Entertainment Resort',
  },
  'untold-romania': {
    location: 'Cluj-Napoca',
    venue: 'Cluj Arena',
  },
  creamfields: {
    location: 'Warrington',
    venue: 'Daresbury Estate',
  },
  'ultra-japan': {
    location: 'Tokyo',
    venue: 'Odaiba',
  },
  'untold-dubai': {
    location: 'Dubai',
    venue: 'Dubai Parks and Resorts',
  },
  'edc-orlando': {
    location: 'Orlando',
    venue: 'Tinker Field',
  },
  soundstorm: {
    location: 'Riyadh',
    venue: 'Boulevard Riyadh',
  },
  'ultra-europe': {
    location: 'Split',
    venue: 'Park Mladeži',
  },
  'tomorrowland-shanghai': {
    name: 'The Magic of Tomorrowland Shanghai 2026',
    location: 'Shanghai',
    venue: 'Bund Conference Center',
  },
};

function containsCjk(text?: string): boolean {
  return Boolean(text?.trim() && CJK_PATTERN.test(text));
}

export function festivalActivityCode(festival: Festival): string {
  return festival.id.trim().toLowerCase().replace(/-\d{4}$/, '');
}

function firstMappedCity(text: string): string | undefined {
  for (const [label, english] of Object.entries(CITY_EN)) {
    if (text.includes(label)) {
      return english;
    }
  }
  return undefined;
}

function extractLatinSegments(text: string): string[] {
  return (text.match(/[A-Za-z][\w\s&.'-]*/g) ?? [])
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function toEnglishLocationFields(
  location: string,
  venue: string,
  code: string,
): { location: string; venue: string } {
  const override = FESTIVAL_ENGLISH_BY_CODE[code];
  if (override?.location && override?.venue) {
    return { location: override.location, venue: override.venue };
  }

  let nextLocation = location.trim();
  let nextVenue = venue.trim();

  if (containsCjk(nextLocation)) {
    const latin = extractLatinSegments(nextLocation);
    const mappedCity = firstMappedCity(nextLocation);
    if (mappedCity) {
      nextLocation = mappedCity;
    } else if (latin.length > 0) {
      nextLocation = latin[0];
    }

    if (latin.length > 0) {
      nextVenue = latin[latin.length - 1];
    }
  }

  if (containsCjk(nextVenue)) {
    const latin = extractLatinSegments(nextVenue);
    if (latin.length > 0) {
      nextVenue = latin[latin.length - 1];
    }
  }

  return { location: nextLocation, venue: nextVenue };
}

function toEnglishName(name: string, code: string): string {
  const override = FESTIVAL_ENGLISH_BY_CODE[code]?.name;
  if (!containsCjk(name)) {
    return name.trim();
  }
  return override?.trim() || name.trim();
}

function toEnglishDescription(
  description: string,
  name: string,
  location: string,
): string {
  if (!containsCjk(description)) {
    return description.trim();
  }

  const place = location || 'TBA';
  return `${name} in ${place} — on the Raven festival calendar.`;
}

function toEnglishUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed || containsCjk(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function normalizeFestivalForEnglishReport(festival: Festival): Festival {
  const code = festivalActivityCode(festival);
  const { location, venue } = toEnglishLocationFields(
    festival.location,
    festival.venue,
    code,
  );
  const name = toEnglishName(festival.name, code);

  const ticketUrl = toEnglishUrl(festival.ticketUrl);
  const websiteUrl = toEnglishUrl(festival.websiteUrl);
  const { ticketUrl: _ignoredTicket, websiteUrl: _ignoredWebsite, ...rest } =
    festival;

  return {
    ...rest,
    name,
    location,
    venue,
    country: festival.country.trim(),
    description: toEnglishDescription(festival.description, name, location),
    ...(ticketUrl ? { ticketUrl } : {}),
    ...(websiteUrl ? { websiteUrl } : {}),
  };
}

export function normalizeFestivalsForEnglishReport(
  festivals: Festival[],
): Festival[] {
  return festivals.map(normalizeFestivalForEnglishReport);
}

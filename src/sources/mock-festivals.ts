import type { Festival } from '../types/index.js';

/**
 * Mock festivals aligned with sync-app-backend activity catalog + itinerary seeds.
 * Lineup artists are top-billed names from official lineup announcements;
 * genreLabel is editorial (catalog seeds still use 风格待补充 until DJ mapping).
 */
export const mockFestivals: Festival[] = [
  {
    activityLegacyId: 1,
    id: 'tomorrowland-thailand-2026',
    name: 'Tomorrowland Thailand 2026',
    venue: 'Wisdom Valley',
    location: 'Pattaya',
    country: 'Thailand',
    startDate: '2026-12-11',
    endDate: '2026-12-13',
    genres: ['EDM', 'Trance', 'House', 'Techno'],
    lineupSchedulePublished: false,
    headlineArtists: [
      { name: 'Martin Garrix', genreLabel: 'Big Room' },
      { name: 'Swedish House Mafia', genreLabel: 'Progressive House' },
      { name: 'Steve Aoki', genreLabel: 'Electro House' },
      { name: 'Dimitri Vegas & Like Mike', genreLabel: 'Big Room' },
      { name: 'Infected Mushroom', genreLabel: 'Psytrance' },
      { name: 'Vini Vici', genreLabel: 'Psytrance' },
    ],
    description:
      'Tomorrowland’s Thailand debut at Wisdom Valley — full lineup announced, official timetable pending.',
    priority: 100,
    ticketUrl: 'https://www.tomorrowland.com',
    websiteUrl: 'https://thailand.tomorrowland.com',
  },
  {
    activityLegacyId: 11,
    id: 'ultra-japan-2026',
    name: 'Ultra Japan 2026',
    venue: 'Odaiba',
    location: 'Tokyo',
    country: 'Japan',
    startDate: '2026-09-19',
    endDate: '2026-09-20',
    genres: ['EDM', 'House', 'Techno'],
    lineupSchedulePublished: false,
    headlineArtists: [],
    description:
      'Ultra Japan returns to Tokyo Odaiba — lineup and timetable not yet in Raven catalog.',
    priority: 80,
    ticketUrl: 'https://ultrajapan.com',
    websiteUrl: 'https://ultrajapan.com',
  },
  {
    activityLegacyId: 5,
    id: 'edc-thailand-2026',
    name: 'EDC Thailand 2026',
    venue: 'Rhythm Park',
    location: 'Phuket',
    country: 'Thailand',
    startDate: '2026-12-18',
    endDate: '2026-12-20',
    genres: ['EDM', 'House', 'Techno', 'Bass'],
    lineupSchedulePublished: false,
    headlineArtists: [
      { name: 'Martin Garrix', genreLabel: 'Big Room' },
      { name: 'DJ Snake', genreLabel: 'Trap' },
      { name: 'Charlotte de Witte', genreLabel: 'Techno' },
      { name: 'Kaskade', genreLabel: 'House' },
      { name: 'Dom Dolla', genreLabel: 'House' },
      { name: 'I Hate Models', genreLabel: 'Techno' },
    ],
    description:
      'EDC’s Thailand debut at Rhythm Park — lineup announced, official set times pending.',
    priority: 70,
    websiteUrl: 'https://thailand.electricdaisycarnival.com',
  },
];

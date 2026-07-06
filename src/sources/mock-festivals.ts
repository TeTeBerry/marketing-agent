import type { Festival } from '../types/index.js';

export const mockFestivals: Festival[] = [
  {
    id: 'tomorrowland-thailand-2026',
    name: 'Tomorrowland Thailand',
    location: 'Pattaya',
    country: 'Thailand',
    startDate: '2026-12-05',
    endDate: '2026-12-07',
    genres: ['EDM', 'Trance', 'House', 'Techno'],
    headlineArtists: [
      'Amelie Lens',
      'Charlotte de Witte',
      'Hardwell',
      'Swedish House Mafia',
    ],
    description:
      'Tomorrowland’s Asia expansion — massive production, global headliners, and a new regional gateway festival.',
    priority: 100,
    ticketUrl: 'https://www.tomorrowland.com',
    websiteUrl: 'https://www.tomorrowland.com',
  },
  {
    id: 'ultra-japan-2026',
    name: 'Ultra Japan',
    location: 'Tokyo',
    country: 'Japan',
    startDate: '2026-09-19',
    endDate: '2026-09-20',
    genres: ['EDM', 'House', 'Techno', 'Bass'],
    headlineArtists: ['Martin Garrix', 'Peggy Gou', 'Tiësto', 'Alesso'],
    description:
      'Tokyo edition of Ultra — city-scale production with strong regional and international headliners.',
    priority: 80,
    ticketUrl: 'https://ultrajapan.com',
    websiteUrl: 'https://ultrajapan.com',
  },
  {
    id: 'edc-thailand-2026',
    name: 'EDC Thailand',
    location: 'Phuket',
    country: 'Thailand',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    genres: ['EDM', 'House', 'Techno', 'Trance'],
    headlineArtists: [
      'Kaskade',
      'John Summit',
      'Dom Dolla',
      'Subtronics',
    ],
    description:
      'Electric Daisy Carnival’s Thailand debut — carnival aesthetics, big-room energy, and regional festival travel demand.',
    priority: 70,
    websiteUrl: 'https://thailand.electricdaisycarnival.com',
  },
];

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildInstagramPosterMarkdown } from '../src/outputs/instagram-poster-markdown.js';
import { DEFAULT_RAVEN_BRAND_STYLE } from '../src/types/instagram-publishing-package.js';

const baseRequest = {
  publishingPackage: {
    topic: 'Travel + vibe guide',
    caption: 'Save this before you fly.',
    hashtags: ['Tomorrowland'],
  },
  brandStyle: DEFAULT_RAVEN_BRAND_STYLE,
  carousel: [],
};

describe('buildInstagramPosterMarkdown', () => {
  it('renders the festival travel guide poster template', () => {
    const markdown = buildInstagramPosterMarkdown(
      {
        ...baseRequest,
        festival: {
          id: 'tomorrowland-thailand-2026',
          name: 'Tomorrowland Thailand 2026',
          venue: 'Wisdom Valley',
          location: 'Pattaya',
          country: 'Thailand',
          startDate: '2026-12-11',
          endDate: '2026-12-13',
          lineupArtists: [
            { name: 'Martin Garrix', genreLabel: 'Big Room' },
            { name: 'Swedish House Mafia', genreLabel: 'Progressive House' },
            { name: 'Steve Aoki', genreLabel: 'Electro House' },
          ],
        },
      },
      'en',
    );

    assert.match(markdown, /^# Tomorrowland Thailand 2026 🇹🇭/);
    assert.match(markdown, /## Festival Travel Guide/);
    assert.match(markdown, /📍\nWisdom Valley\nPattaya, Thailand/);
    assert.match(markdown, /📅 December 11–13, 2026/);
    assert.match(markdown, /🎧 Lineup Highlights\n\nMartin Garrix\nSwedish House Mafia\nSteve Aoki/);
    assert.match(markdown, /🏨 Where To Stay/);
    assert.match(markdown, /Follow @Raven/);
    assert.match(markdown, /Your guide to the world's best festivals 🌎/);
    assert.doesNotMatch(markdown, /Trip Plan/);
  });

  it('omits lineup section when no artists are available', () => {
    const markdown = buildInstagramPosterMarkdown(
      {
        ...baseRequest,
        festival: {
          id: 'ultra-japan-2026',
          name: 'Ultra Japan 2026',
          venue: 'Odaiba',
          location: 'Tokyo',
          country: 'Japan',
          startDate: '2026-09-19',
          endDate: '2026-09-20',
          lineupArtists: [],
        },
      },
      'en',
    );

    assert.match(markdown, /# Ultra Japan 2026 🇯🇵/);
    assert.doesNotMatch(markdown, /Lineup Highlights/);
    assert.match(markdown, /✈️ How To Get There/);
  });
});

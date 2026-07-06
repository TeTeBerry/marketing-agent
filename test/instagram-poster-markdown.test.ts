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

const expectedTomorrowlandPoster = `# Tomorrowland Thailand 2026 🇹🇭

## Festival Travel Guide

📍 Wisdom Valley, Pattaya
📅 December 11–13, 2026

━━━━━━━━━━━━

🎧 LINEUP HIGHLIGHTS

Martin Garrix
Swedish House Mafia
Steve Aoki

━━━━━━━━━━━━

🏨 STAY
Hotels & best areas near the festival

✈️ TRAVEL
Flights · Transport · Planning

💰 BUDGET
Estimated trip cost guide

━━━━━━━━━━━━

FOLLOW @RAVEN

Your guide to the world's best festivals 🌎
`;

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

    assert.equal(markdown, expectedTomorrowlandPoster);
    assert.doesNotMatch(markdown, /Trip Plan/);
    assert.doesNotMatch(markdown, /Festival Tips/);
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
    assert.doesNotMatch(markdown, /LINEUP HIGHLIGHTS/);
    assert.match(markdown, /📍 Odaiba, Tokyo/);
    assert.match(markdown, /✈️ TRAVEL\nFlights · Transport · Planning/);
  });
});

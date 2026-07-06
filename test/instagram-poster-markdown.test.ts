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
  it('renders timeline with artist styles when schedule is published', () => {
    const markdown = buildInstagramPosterMarkdown(
      {
        ...baseRequest,
        festival: {
          id: 'tomorrowland-thailand-2026',
          name: 'Tomorrowland Thailand 2026',
          venue: 'Wisdom Valley',
          location: 'Pattaya',
          country: 'Thailand',
          dates: 'Dec 12–14',
          lineupSchedulePublished: true,
          lineupArtists: [
            { name: 'Amelie Lens', genreLabel: 'Techno' },
            { name: 'Charlotte de Witte', genreLabel: 'Techno' },
          ],
          timeline: [
            {
              time: '6:30 PM',
              artistName: 'Amelie Lens',
              stageLabel: 'Main Stage',
              genreLabel: 'Techno',
            },
            {
              time: '9:00 PM',
              artistName: 'Charlotte de Witte',
              stageLabel: 'Main Stage',
              genreLabel: 'Techno',
            },
          ],
        },
      },
      'en',
    );

    assert.match(markdown, /### Timeline/);
    assert.match(markdown, /6:30 PM · Amelie Lens · Techno · Main Stage/);
    assert.doesNotMatch(markdown, /### Headliners/);
    assert.doesNotMatch(markdown, /Squad of 3/);
    assert.doesNotMatch(markdown, /Travel \+ vibe guide/);
    assert.doesNotMatch(markdown, /8 \/ 12 items packed/);
    assert.doesNotMatch(markdown, /Comfortable sneakers/);
    assert.doesNotMatch(markdown, /### Calendar/);
  });

  it('renders headliners under trip plan when lineup is announced without timetable', () => {
    const markdown = buildInstagramPosterMarkdown(
      {
        ...baseRequest,
        festival: {
          id: 'tomorrowland-thailand-2026',
          name: 'Tomorrowland Thailand 2026',
          venue: 'Wisdom Valley',
          location: 'Pattaya',
          country: 'Thailand',
          dates: 'Dec 11–13',
          lineupSchedulePublished: false,
          lineupArtists: [
            { name: 'Martin Garrix', genreLabel: 'Big Room' },
            { name: 'Swedish House Mafia', genreLabel: 'Progressive House' },
          ],
        },
      },
      'en',
    );

    const tripIndex = markdown.indexOf('### Trip Plan');
    const headlinersIndex = markdown.indexOf('### Headliners');
    const budgetIndex = markdown.indexOf('### Budget');

    assert.ok(tripIndex >= 0 && headlinersIndex > tripIndex);
    assert.ok(headlinersIndex < budgetIndex);
    assert.match(markdown, /- \*\*Martin Garrix\*\* · Big Room/);
    assert.match(
      markdown,
      /\*\*Tomorrowland Thailand 2026\*\* · Wisdom Valley · Pattaya, Thailand · Dec 11–13/,
    );
    assert.doesNotMatch(markdown, /### Timeline/);
  });
});

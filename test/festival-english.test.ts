import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  normalizeFestivalForEnglishReport,
  normalizeFestivalsForEnglishReport,
} from '../src/utils/festival-english.js';
import type { Festival } from '../src/types/index.js';

const stormFestival: Festival = {
  activityLegacyId: 4,
  id: 'storm-2026',
  name: '风暴电音节 深圳站 2026',
  venue: '深圳国际会展中心',
  location: '深圳国际会展中心',
  country: 'China',
  startDate: '2026-06-13',
  endDate: '2026-06-14',
  genres: ['EDM'],
  headlineArtists: [],
  description: '风暴电音节深圳站 — 官方发布',
  priority: 100,
  websiteUrl: '风暴电音节官方发布',
};

describe('festival-english', () => {
  it('maps Chinese catalog fields to English display names', () => {
    const normalized = normalizeFestivalForEnglishReport(stormFestival);

    assert.equal(normalized.name, 'STORM Festival Shenzhen 2026');
    assert.equal(normalized.location, 'Shenzhen');
    assert.equal(
      normalized.venue,
      'Shenzhen World Exhibition & Convention Center',
    );
    assert.match(normalized.description, /STORM Festival Shenzhen 2026 in Shenzhen/);
    assert.doesNotMatch(normalized.description, /[\u4e00-\u9fff]/);
    assert.equal(normalized.websiteUrl, undefined);
  });

  it('keeps already-English festivals unchanged', () => {
    const festival: Festival = {
      id: 'edc-thailand-2026',
      name: 'EDC Thailand 2026',
      venue: 'Rhythm Park',
      location: 'Phuket',
      country: 'Thailand',
      startDate: '2026-12-18',
      endDate: '2026-12-20',
      genres: ['EDM'],
      headlineArtists: [],
      description: 'EDC’s Thailand debut at Rhythm Park.',
      priority: 70,
    };

    const normalized = normalizeFestivalsForEnglishReport([festival])[0];
    assert.equal(normalized.name, 'EDC Thailand 2026');
    assert.equal(normalized.location, 'Phuket');
    assert.equal(normalized.venue, 'Rhythm Park');
  });
});

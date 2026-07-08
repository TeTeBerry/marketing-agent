import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { planDailyContent, totalPlannedPosts } from '../src/planner/content-planner.js';
import { mockFestivals } from '../src/sources/mock-festivals.js';

describe('content-planner', () => {
  const today = new Date('2026-07-06T12:00:00Z');

  it('plans 10 posts with correct platform quotas', () => {
    const plans = planDailyContent({ festivals: mockFestivals, date: today });

    assert.equal(totalPlannedPosts(plans), 10);
    assert.equal(plans.filter((p) => p.platform === 'threads').length, 5);
    assert.equal(plans.filter((p) => p.platform === 'instagram').length, 1);
    assert.equal(plans.filter((p) => p.platform === 'tiktok').length, 1);
    assert.equal(plans.filter((p) => p.platform === 'x').length, 1);
    assert.equal(plans.filter((p) => p.platform === 'reddit').length, 2);
  });

  it('prioritizes higher-priority festivals for instagram', () => {
    const plans = planDailyContent({ festivals: mockFestivals, date: today });
    const instagram = plans.find((p) => p.platform === 'instagram');

    assert.ok(instagram);
    assert.equal(instagram.festivalId, 'tomorrowland-thailand-2026');
    assert.equal(instagram.seriesType, 'lineup_breakdown');
    assert.equal(instagram.contentType, 'guide');
  });

  it('plans series-first content with seriesType on every plan', () => {
    const plans = planDailyContent({ festivals: mockFestivals, date: today });
    for (const plan of plans) {
      assert.ok(plan.seriesType);
    }
  });

  it('plans founder X post without festival binding', () => {
    const plans = planDailyContent({ festivals: mockFestivals, date: today });
    const xPlan = plans.find((p) => p.platform === 'x');

    assert.ok(xPlan);
    assert.equal(xPlan.festivalId, '');
    assert.equal(xPlan.contentType, 'founder');
    assert.ok(xPlan.topic.length > 10);
  });
});

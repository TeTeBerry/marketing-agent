import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { mockFestivals } from '../src/sources/mock-festivals.js';

describe('festival-source', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('returns backend festivals when API succeeds', async () => {
    const backendFestivals = [
      {
        ...mockFestivals[0],
        id: 'tomorrowland-2026',
        priority: 95,
      },
    ];

    mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            code: 200,
            message: 'success',
            data: backendFestivals,
          }),
          { status: 200 },
        ),
    );

    const { loadUpcomingFestivals } = await import(
      '../src/sources/festival-source.js'
    );
    const festivals = await loadUpcomingFestivals();

    assert.equal(festivals.length, 1);
    assert.equal(festivals[0]?.id, 'tomorrowland-2026');
    assert.equal(festivals[0]?.priority, 95);
  });

  it('falls back to mock festivals when API fails', async () => {
    mock.method(globalThis, 'fetch', async () => {
      throw new Error('ECONNREFUSED');
    });

    const { loadUpcomingFestivals } = await import(
      '../src/sources/festival-source.js'
    );
    const festivals = await loadUpcomingFestivals();

    assert.deepEqual(festivals, mockFestivals);
  });

  it('falls back to mock festivals when API returns empty list', async () => {
    mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(
          JSON.stringify({ code: 200, message: 'success', data: [] }),
          { status: 200 },
        ),
    );

    const { loadUpcomingFestivals } = await import(
      '../src/sources/festival-source.js'
    );
    const festivals = await loadUpcomingFestivals();

    assert.deepEqual(festivals, mockFestivals);
  });
});

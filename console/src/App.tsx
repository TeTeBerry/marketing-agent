import { useEffect, useMemo, useState } from 'react';
import {
  BRAND_VOICE,
  type ContentGenerationResult,
  type ContentPlatform,
  type ContentSeriesMeta,
  type Festival,
  generateContent,
  listContentSeries,
  listFestivals,
  searchArtists,
} from './api';

const STEPS = [
  'Choose Festival',
  'Choose Content Series',
  'Choose Platforms',
  'Generate',
] as const;

const PLATFORM_OPTIONS: Array<{ id: ContentPlatform; label: string }> = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'threads', label: 'Threads' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'seo', label: 'SEO' },
];

export function App() {
  const [step, setStep] = useState(0);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [seriesList, setSeriesList] = useState<ContentSeriesMeta[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<ContentSeriesMeta | null>(
    null,
  );
  const [platforms, setPlatforms] = useState<ContentPlatform[]>(['instagram']);
  const [artistName, setArtistName] = useState('');
  const [artistQuery, setArtistQuery] = useState('');
  const [artistHits, setArtistHits] = useState<
    Array<{ name: string; genre: string; country?: string }>
  >([]);
  const [topicHint, setTopicHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootError, setBootError] = useState('');
  const [generateError, setGenerateError] = useState('');
  const [results, setResults] = useState<ContentGenerationResult[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const [festivalRows, seriesRows] = await Promise.all([
          listFestivals(),
          listContentSeries(),
        ]);
        setFestivals(festivalRows);
        setSeriesList(seriesRows);
      } catch (error) {
        setBootError(error instanceof Error ? error.message : String(error));
      }
    })();
  }, []);

  useEffect(() => {
    if (!artistQuery.trim() || selectedSeries?.id !== 'artist_spotlight') {
      setArtistHits([]);
      return;
    }

    const timer = window.setTimeout(() => {
      void searchArtists(artistQuery.trim())
        .then(setArtistHits)
        .catch(() => setArtistHits([]));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [artistQuery, selectedSeries?.id]);

  const featuredSeries = useMemo(
    () => seriesList.filter((item) => item.featured),
    [seriesList],
  );
  const moreSeries = useMemo(
    () => seriesList.filter((item) => !item.featured),
    [seriesList],
  );

  const activeResult = results[activeResultIndex];

  function togglePlatform(platform: ContentPlatform) {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  }

  async function handleGenerate() {
    if (!selectedFestival || !selectedSeries || platforms.length === 0) {
      return;
    }

    setLoading(true);
    setGenerateError('');
    try {
      const rows = await generateContent({
        brandVoice: BRAND_VOICE,
        festival: selectedFestival,
        seriesType: selectedSeries.id,
        platforms,
        language: 'en',
        artistName: artistName.trim() || undefined,
        topicHint: topicHint.trim() || undefined,
      });
      setResults(rows);
      setActiveResultIndex(0);
      setStep(3);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Raven Internal</p>
          <h1 className="app-title">Content Engine</h1>
          <p className="app-subtitle">
            AI operating system for festival content — strategy first, then platform
            adaptation.
          </p>
        </div>
      </header>

      <div className="stepper">
        {STEPS.map((label, index) => (
          <div
            key={label}
            className={[
              'step-pill',
              index === step ? 'is-active' : '',
              index < step ? 'is-done' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {bootError ? <div className="error-banner">{bootError}</div> : null}

      {step === 0 ? (
        <section className="panel">
          <h2 className="panel-title">Choose Festival</h2>
          <p className="panel-desc">Select the festival context for this content run.</p>
          <div className="card-grid">
            {festivals.map((festival) => (
              <button
                key={festival.id}
                type="button"
                className={[
                  'select-card',
                  selectedFestival?.id === festival.id ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedFestival(festival)}
              >
                <span className="select-card__label">{festival.name}</span>
                <span className="select-card__desc">
                  {festival.location}, {festival.country} · {festival.startDate}
                </span>
              </button>
            ))}
          </div>
          <div className="actions">
            <span />
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedFestival}
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="panel">
          <h2 className="panel-title">Choose Content Series</h2>
          <p className="panel-desc">
            Pick the content strategy before choosing platforms.
          </p>
          <div className="card-grid">
            {featuredSeries.map((series) => (
              <button
                key={series.id}
                type="button"
                className={[
                  'select-card',
                  selectedSeries?.id === series.id ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedSeries(series)}
              >
                <span className="select-card__label">{series.label}</span>
                <span className="select-card__desc">{series.description}</span>
              </button>
            ))}
          </div>
          {moreSeries.length > 0 ? (
            <>
              <p className="panel-desc" style={{ marginTop: 24 }}>
                More series
              </p>
              <div className="card-grid">
                {moreSeries.map((series) => (
                  <button
                    key={series.id}
                    type="button"
                    className={[
                      'select-card',
                      selectedSeries?.id === series.id ? 'is-selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedSeries(series)}
                  >
                    <span className="select-card__label">{series.label}</span>
                    <span className="select-card__desc">{series.description}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {selectedSeries?.requiresArtist ? (
            <div className="field" style={{ marginTop: 20 }}>
              <label htmlFor="artist">Artist</label>
              <input
                id="artist"
                value={artistQuery || artistName}
                placeholder="Search artist name"
                onChange={(event) => {
                  setArtistQuery(event.target.value);
                  setArtistName(event.target.value);
                }}
              />
              {artistHits.length > 0 ? (
                <div className="chip-row">
                  {artistHits.map((hit) => (
                    <button
                      key={hit.name}
                      type="button"
                      className={[
                        'chip',
                        artistName === hit.name ? 'is-selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        setArtistName(hit.name);
                        setArtistQuery(hit.name);
                        setArtistHits([]);
                      }}
                    >
                      {hit.name}
                      {hit.genre ? ` · ${hit.genre}` : ''}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="topic">Topic hint (optional)</label>
            <input
              id="topic"
              value={topicHint}
              placeholder="e.g. Hidden gems for melodic techno fans"
              onChange={(event) => setTopicHint(event.target.value)}
            />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={() => setStep(0)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={
                !selectedSeries ||
                (selectedSeries.requiresArtist && !artistName.trim())
              }
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="panel">
          <h2 className="panel-title">Choose Platforms</h2>
          <p className="panel-desc">Multi-select where this series should be adapted.</p>
          <div className="chip-row">
            {PLATFORM_OPTIONS.map((platform) => (
              <label
                key={platform.id}
                className={[
                  'chip',
                  platforms.includes(platform.id) ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="checkbox"
                  checked={platforms.includes(platform.id)}
                  onChange={() => togglePlatform(platform.id)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                {platform.label}
              </label>
            ))}
          </div>
          <div className="actions">
            <button type="button" className="btn" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={platforms.length === 0 || loading}
              onClick={() => void handleGenerate()}
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
          {generateError ? <div className="error-banner">{generateError}</div> : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="panel">
          <h2 className="panel-title">Content Output</h2>
          <p className="panel-desc">
            {selectedSeries?.label} · {selectedFestival?.name}
          </p>

          {results.length === 0 ? (
            <p className="loading">No results yet.</p>
          ) : (
            <>
              <div className="result-tabs">
                {results.map((row, index) => (
                  <button
                    key={`${row.platform}-${index}`}
                    type="button"
                    className={[
                      'result-tab',
                      index === activeResultIndex ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setActiveResultIndex(index)}
                  >
                    {row.platform}
                  </button>
                ))}
              </div>

              {activeResult ? (
                <div className="result-block">
                  <div>
                    <strong>Topic</strong>
                    <pre>{activeResult.topic}</pre>
                  </div>
                  {activeResult.hook ? (
                    <div>
                      <strong>Hook</strong>
                      <pre>{activeResult.hook}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.decisionQuestion ? (
                    <div>
                      <strong>Decision Question</strong>
                      <pre>{activeResult.result.decisionQuestion}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.recommendation ? (
                    <div>
                      <strong>Recommendation</strong>
                      <pre>{activeResult.result.recommendation}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.targetAudience ? (
                    <div>
                      <strong>Target Audience</strong>
                      <pre>{activeResult.result.targetAudience}</pre>
                    </div>
                  ) : null}
                  <div>
                    <strong>Caption / Body</strong>
                    <pre>{activeResult.result.content}</pre>
                  </div>
                  {activeResult.result.hashtags.length > 0 ? (
                    <div>
                      <strong>Hashtags / Keywords</strong>
                      <pre>{activeResult.result.hashtags.join(', ')}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.carousel &&
                  activeResult.result.carousel.length > 0 ? (
                    <div>
                      <strong>Slides</strong>
                      <div className="slide-list">
                        {activeResult.result.carousel.map((slide) => (
                          <div key={slide.slide} className="slide-item">
                            <strong>
                              Slide {slide.slide}: {slide.headline}
                            </strong>
                            <span>{slide.body}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {activeResult.result.visualBrief?.imagePrompt ? (
                    <div>
                      <strong>Image Prompt</strong>
                      <pre>{activeResult.result.visualBrief.imagePrompt}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.visualBrief?.designLayout ? (
                    <div>
                      <strong>Visual Brief</strong>
                      <pre>{activeResult.result.visualBrief.designLayout}</pre>
                    </div>
                  ) : null}
                  {activeResult.result.notes ? (
                    <div>
                      <strong>Notes</strong>
                      <pre>{activeResult.result.notes}</pre>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}

          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setResults([]);
                setStep(2);
              }}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setResults([]);
                setStep(0);
              }}
            >
              New run
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

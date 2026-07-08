import type { ContentPlan, PlanContentType } from '../types/content-plan.js';
import type { ContentSeries } from '../types/content-series.js';
import type { Festival } from '../types/index.js';
import {
  DAILY_PLATFORM_QUOTAS,
  type PlannerInput,
  type PlannerSignals,
} from './planner-context.js';

const FOUNDER_TOPICS = [
  'Product progress: reducing festival planning anxiety',
  'Startup lesson: festival travel is fragmented across too many apps',
  'User insight: people want lineup priority, not just artist lists',
  'AI travel insight: fixed-event trips need different planning logic',
  'Small win: shipping a feature that surfaces stage timing conflicts',
  'Mistake: over-indexing on discovery when users need logistics calm',
  'Market insight: destination tools fail when the event date is immovable',
];

const THREADS_SERIES: ContentSeries[] = [
  'community_discussion',
  'news_update',
  'community_discussion',
  'travel_guide',
  'community_discussion',
];

const THREADS_TOPIC_BUILDERS: Array<(festival: Festival) => string> = [
  (f) => `Hot take: is ${f.name} worth the long-haul trip this year?`,
  (f) => `${f.name} news / lineup update discussion`,
  (f) => `What is your must-see stage or artist at ${f.name}?`,
  (f) => `First-timer tips before ${f.name} (${f.location})`,
  (f) => `Who else is still figuring out travel + lodging for ${f.name}?`,
];

const TIKTOK_SERIES: Array<{ topic: (f: Festival) => string; series: ContentSeries }> =
  [
    {
      topic: (f) => `POV: you just booked ${f.name} and open 6 travel tabs`,
      series: 'travel_guide',
    },
    {
      topic: (f) => `Top 5 mistakes before ${f.name}`,
      series: 'packing_guide',
    },
    {
      topic: (f) => `POV: 72 hours until ${f.name} and your group chat is chaos`,
      series: 'community_discussion',
    },
  ];

const REDDIT_SERIES: ContentSeries[] = ['festival_guide', 'travel_guide'];

const REDDIT_REPLY_TOPICS: Array<(festival: Festival) => string> = [
  (f) => `Helpful reply: first-timer planning for ${f.name}`,
  (f) => `Helpful reply: travel + lodging logistics for ${f.name}`,
  (f) => `Helpful reply: lineup priorities and set conflicts at ${f.name}`,
];

type RankedFestival = Festival & { score: number; daysUntilStart: number };

function daysUntilStart(startDate: string, today: Date): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const day = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  return Math.ceil((start.getTime() - day.getTime()) / 86_400_000);
}

function rankFestivals(festivals: Festival[], today: Date): RankedFestival[] {
  return [...festivals]
    .map((festival) => {
      const daysUntilStartValue = daysUntilStart(festival.startDate, today);
      const urgency =
        daysUntilStartValue > 0 && daysUntilStartValue <= 120
          ? ((120 - daysUntilStartValue) / 120) * 25
          : 0;
      return {
        ...festival,
        daysUntilStart: daysUntilStartValue,
        score: festival.priority + urgency,
      };
    })
    .sort((a, b) => b.score - a.score || b.priority - a.priority);
}

function pickFestival(
  ranked: RankedFestival[],
  index: number,
): RankedFestival | null {
  if (ranked.length === 0) {
    return null;
  }
  return ranked[index % ranked.length] ?? null;
}

function mapSeriesToPlanContentType(series: ContentSeries): PlanContentType {
  switch (series) {
    case 'news_update':
      return 'news';
    case 'community_discussion':
      return 'discussion';
    case 'artist_spotlight':
      return 'artist';
    case 'packing_guide':
    case 'budget_guide':
      return 'tips';
    default:
      return 'guide';
  }
}

function buildPlan(
  seriesType: ContentSeries,
  platform: ContentPlan['platform'],
  festival: RankedFestival,
  topic: string,
  artistName?: string,
): ContentPlan {
  return {
    seriesType,
    platform,
    festivalId: festival.id,
    topic,
    contentType: mapSeriesToPlanContentType(seriesType),
    priority: festival.score,
    ...(artistName ? { artistName } : {}),
  };
}

function buildThreadsPlans(ranked: RankedFestival[]): ContentPlan[] {
  return Array.from({ length: DAILY_PLATFORM_QUOTAS.threads }, (_, index) => {
    const festival = pickFestival(ranked, index)!;
    return buildPlan(
      THREADS_SERIES[index]!,
      'threads',
      festival,
      THREADS_TOPIC_BUILDERS[index]!(festival),
    );
  });
}

function buildInstagramPlans(ranked: RankedFestival[], today: Date): ContentPlan[] {
  const festival = ranked[0]!;
  const useLineupBreakdown = today.getUTCDate() % 2 === 0;

  if (useLineupBreakdown) {
    return [
      buildPlan(
        'lineup_breakdown',
        'instagram',
        festival,
        `3 artists you should prioritize at ${festival.name} if you love melodic techno`,
      ),
    ];
  }

  return [
    buildPlan(
      'travel_guide',
      'instagram',
      festival,
      `${festival.name} festival highlight carousel — travel + vibe guide`,
    ),
  ];
}

function buildTikTokPlan(ranked: RankedFestival[], today: Date): ContentPlan {
  const festival = ranked[0]!;
  const format = TIKTOK_SERIES[today.getUTCDate() % TIKTOK_SERIES.length]!;
  return buildPlan(format.series, 'tiktok', festival, format.topic(festival));
}

function buildFounderPlan(
  today: Date,
  _signals?: PlannerSignals,
): ContentPlan {
  const topic = FOUNDER_TOPICS[today.getUTCDate() % FOUNDER_TOPICS.length]!;
  return {
    seriesType: 'community_discussion',
    platform: 'x',
    festivalId: '',
    topic,
    contentType: 'founder',
    priority: 100,
  };
}

function buildRedditPlans(ranked: RankedFestival[]): ContentPlan[] {
  return Array.from({ length: DAILY_PLATFORM_QUOTAS.reddit }, (_, index) => {
    const festival = pickFestival(ranked, index)!;
    const topicBuilder =
      REDDIT_REPLY_TOPICS[index] ?? REDDIT_REPLY_TOPICS[0]!;
    return buildPlan(
      REDDIT_SERIES[index] ?? 'festival_guide',
      'reddit',
      festival,
      topicBuilder(festival),
    );
  });
}

/**
 * Build today's content plan. Does not call LLM — planning only.
 * Series-first: festival → content series → platform.
 */
export function planDailyContent(input: PlannerInput): ContentPlan[] {
  const ranked = rankFestivals(input.festivals, input.date);

  if (ranked.length === 0) {
    throw new Error('Content planner requires at least one upcoming festival');
  }

  return [
    ...buildThreadsPlans(ranked),
    ...buildInstagramPlans(ranked, input.date),
    buildTikTokPlan(ranked, input.date),
    buildFounderPlan(input.date, input.signals),
    ...buildRedditPlans(ranked),
  ];
}

export function totalPlannedPosts(plans: ContentPlan[]): number {
  return plans.length;
}

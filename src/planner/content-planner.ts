import type { ContentPlan, PlanContentType } from '../types/content-plan.js';
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

const THREADS_CONTENT_TYPES: PlanContentType[] = [
  'discussion',
  'news',
  'discussion',
  'tips',
  'discussion',
];

const THREADS_TOPIC_BUILDERS: Array<(festival: Festival) => string> = [
  (f) => `Hot take: is ${f.name} worth the long-haul trip this year?`,
  (f) => `${f.name} news / lineup update discussion`,
  (f) => `What is your must-see stage or artist at ${f.name}?`,
  (f) => `First-timer tips before ${f.name} (${f.location})`,
  (f) => `Who else is still figuring out travel + lodging for ${f.name}?`,
];

const TIKTOK_FORMATS: Array<{ topic: (f: Festival) => string; type: PlanContentType }> =
  [
    {
      topic: (f) => `POV: you just booked ${f.name} and open 6 travel tabs`,
      type: 'tips',
    },
    {
      topic: (f) => `Top 5 mistakes before ${f.name}`,
      type: 'tips',
    },
    {
      topic: (f) => `POV: 72 hours until ${f.name} and your group chat is chaos`,
      type: 'discussion',
    },
  ];

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

function buildThreadsPlans(ranked: RankedFestival[]): ContentPlan[] {
  return Array.from({ length: DAILY_PLATFORM_QUOTAS.threads }, (_, index) => {
    const festival = pickFestival(ranked, index)!;
    return {
      platform: 'threads',
      festivalId: festival.id,
      topic: THREADS_TOPIC_BUILDERS[index]!(festival),
      contentType: THREADS_CONTENT_TYPES[index]!,
      priority: festival.score,
    };
  });
}

function buildInstagramPlan(ranked: RankedFestival[]): ContentPlan {
  const festival = ranked[0]!;
  return {
    platform: 'instagram',
    festivalId: festival.id,
    topic: `${festival.name} festival highlight carousel — travel + vibe guide`,
    contentType: 'guide',
    priority: festival.score,
  };
}

function buildTikTokPlan(ranked: RankedFestival[], today: Date): ContentPlan {
  const festival = ranked[0]!;
  const format = TIKTOK_FORMATS[today.getUTCDate() % TIKTOK_FORMATS.length]!;
  return {
    platform: 'tiktok',
    festivalId: festival.id,
    topic: format.topic(festival),
    contentType: format.type,
    priority: festival.score,
  };
}

function buildFounderPlan(
  today: Date,
  _signals?: PlannerSignals,
): ContentPlan {
  const topic = FOUNDER_TOPICS[today.getUTCDate() % FOUNDER_TOPICS.length]!;
  return {
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
    return {
      platform: 'reddit',
      festivalId: festival.id,
      topic: topicBuilder(festival),
      contentType: 'guide',
      priority: festival.score,
    };
  });
}

/**
 * Build today's content plan. Does not call LLM — planning only.
 * Designed for future signal injection (trends, analytics, Reddit, etc.).
 */
export function planDailyContent(input: PlannerInput): ContentPlan[] {
  const ranked = rankFestivals(input.festivals, input.date);

  if (ranked.length === 0) {
    throw new Error('Content planner requires at least one upcoming festival');
  }

  return [
    ...buildThreadsPlans(ranked),
    buildInstagramPlan(ranked),
    buildTikTokPlan(ranked, input.date),
    buildFounderPlan(input.date, input.signals),
    ...buildRedditPlans(ranked),
  ];
}

export function totalPlannedPosts(plans: ContentPlan[]): number {
  return plans.length;
}

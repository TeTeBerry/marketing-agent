import { generatePlatformContent } from '../api/marketing-ai-client.js';
import { env } from '../config/env.js';
import {
  planDailyContent,
  totalPlannedPosts,
} from '../planner/content-planner.js';
import { writeDailyMarkdown } from '../outputs/daily-markdown.js';
import { mockFestivals } from '../sources/mock-festivals.js';
import type { Festival, PlannedContentEntry } from '../types/index.js';
import { mapPlanToApiRequest } from '../writers/plan-to-api.js';
import {
  isPromotionalXContent,
  X_PROMO_WARNING,
} from '../utils/x-content-guard.js';

function resolveFestival(
  festivals: Festival[],
  festivalId: string,
): Festival | null {
  if (!festivalId) {
    return null;
  }
  return festivals.find((festival) => festival.id === festivalId) ?? null;
}

async function generateForPlan(
  entry: PlannedContentEntry['plan'],
  festivals: Festival[],
): Promise<PlannedContentEntry> {
  const festival = resolveFestival(festivals, entry.festivalId);

  console.log(`  → ${entry.platform} · ${entry.contentType} · ${entry.topic}`);

  const result = await generatePlatformContent(
    mapPlanToApiRequest(entry, festival, env.brandVoice, env.language),
  );

  return { plan: entry, festival, result };
}

export async function runDailyContentWorkflow(): Promise<string> {
  const festivals = mockFestivals;
  const today = new Date();

  const plans = planDailyContent({ festivals, date: today });

  console.log(
    `Starting daily content workflow: ${totalPlannedPosts(plans)} planned post(s)`,
  );
  console.log(`Language: ${env.language}`);

  const entries: PlannedContentEntry[] = [];
  const failures: Array<{ topic: string; platform: string; error: string }> =
    [];

  for (const [index, plan] of plans.entries()) {
    console.log(`\n[${index + 1}/${plans.length}] ${plan.platform.toUpperCase()}`);

    try {
      const entry = await generateForPlan(plan, festivals);
      entries.push(entry);

      const label = entry.result.title || entry.result.content.slice(0, 60);
      console.log(`  ✓ ${label}${label.length >= 60 ? '…' : ''}`);

      if (plan.platform === 'x' && isPromotionalXContent(entry.result.content)) {
        console.warn(`  ${X_PROMO_WARNING}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      failures.push({
        topic: plan.topic,
        platform: plan.platform,
        error: message,
      });
      console.error(`  ✗ ${message}`);
    }
  }

  if (entries.length === 0) {
    throw new Error(
      `No content generated. ${failures.length} request(s) failed.`,
    );
  }

  const outputPath = await writeDailyMarkdown(entries, today);
  console.log(`\nWrote ${entries.length} post(s) to ${outputPath}`);

  if (failures.length > 0) {
    console.warn(
      `\nWarning: ${failures.length} planned post(s) failed. Output contains partial results.`,
    );
  }

  return outputPath;
}

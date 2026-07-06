import { generatePlatformContent } from '../api/marketing-ai-client.js';
import { generateInstagramAssets } from '../api/instagram-assets-client.js';
import { env } from '../config/env.js';
import {
  planDailyContent,
  totalPlannedPosts,
} from '../planner/content-planner.js';
import { writeDailyMarkdown } from '../outputs/daily-markdown.js';
import { mockFestivals } from '../sources/mock-festivals.js';
import type { ContentPlan, Festival, PlannedContentEntry, PlannedContentFailure } from '../types/index.js';
import { buildInstagramAssetRequest } from '../writers/build-instagram-asset-request.js';
import { buildInstagramPublishingPackage } from '../writers/build-instagram-package.js';
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

async function generateInstagramEntry(
  plan: ContentPlan,
  festival: Festival | null,
): Promise<PlannedContentEntry> {
  console.log(`  → ${plan.platform} · ${plan.contentType} · ${plan.topic}`);

  const apiRequest = mapPlanToApiRequest(plan, festival, env.brandVoice, env.language);
  const result = await generatePlatformContent(apiRequest);

  const carousel = result.carousel ?? [];
  if (carousel.length === 0) {
    throw new Error('Instagram content missing carousel slides');
  }
  if (!festival) {
    throw new Error('Instagram content requires a festival');
  }

  console.log('  → generating Instagram carousel images…');

  const assetRequest = buildInstagramAssetRequest({ plan, festival, result });
  const assets = await generateInstagramAssets(assetRequest);

  console.log(
    `  ✓ Instagram images: ${assets.images.map((image) => image.imagePath).join(', ')}`,
  );

  const instagramPackage = buildInstagramPublishingPackage({
    topic: plan.topic,
    result,
    images: assets.images,
  });

  return { plan, festival, result, instagramPackage };
}

async function generateForPlan(
  entry: PlannedContentEntry['plan'],
  festivals: Festival[],
): Promise<PlannedContentEntry> {
  const festival = resolveFestival(festivals, entry.festivalId);

  if (entry.platform === 'instagram') {
    return generateInstagramEntry(entry, festival);
  }

  console.log(`  → ${entry.platform} · ${entry.contentType} · ${entry.topic}`);

  const result = await generatePlatformContent(
    mapPlanToApiRequest(entry, festival, env.brandVoice, env.language),
  );

  return { plan: entry, festival, result };
}

export async function runDailyContentWorkflow(): Promise<{
  outputPath: string;
  failures: PlannedContentFailure[];
}> {
  const festivals = mockFestivals;
  const today = new Date();

  const plans = planDailyContent({ festivals, date: today });

  console.log(
    `Starting daily content workflow: ${totalPlannedPosts(plans)} planned post(s)`,
  );
  console.log(`Language: ${env.language}`);

  const entries: PlannedContentEntry[] = [];
  const failures: PlannedContentFailure[] = [];

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

  const outputPath = await writeDailyMarkdown(entries, today, failures);
  console.log(`\nWrote ${entries.length} post(s) to ${outputPath}`);

  if (failures.length > 0) {
    console.warn(
      `\nWarning: ${failures.length} planned post(s) failed. Output contains partial results.`,
    );
    for (const failure of failures) {
      console.warn(`  - ${failure.platform}: ${failure.error}`);
    }
  }

  return { outputPath, failures };
}

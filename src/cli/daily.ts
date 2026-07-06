import { runDailyContentWorkflow } from '../workflows/daily-content.workflow.js';

async function main(): Promise<void> {
  try {
    const outputPath = await runDailyContentWorkflow();
    console.log(`\nDone. Daily content: ${outputPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nDaily content workflow failed: ${message}`);
    process.exitCode = 1;
  }
}

await main();

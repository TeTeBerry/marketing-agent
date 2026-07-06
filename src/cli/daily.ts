import { runDailyContentWorkflow } from '../workflows/daily-content.workflow.js';

async function main(): Promise<void> {
  try {
    const { outputPath, failures } = await runDailyContentWorkflow();
    console.log(`\nDone. Daily content: ${outputPath}`);

    if (failures.length > 0) {
      console.error(
        `\nDaily content incomplete: ${failures.length} planned post(s) failed.`,
      );
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nDaily content workflow failed: ${message}`);
    process.exitCode = 1;
  }
}

await main();

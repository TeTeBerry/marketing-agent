#!/usr/bin/env node
/**
 * Send daily report summary to Feishu group bot webhook.
 * GitHub Actions cannot use Cursor Feishu MCP (OAuth); use FEISHU_WEBHOOK_URL instead.
 */
import { readFileSync } from 'node:fs';

const MAX_PREVIEW_CHARS = 2800;

function parseArgs(argv) {
  const options = {
    report: '',
    status: 'success',
    error: '',
    reportUrl: '',
    runUrl: '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--report') options.report = argv[++i] ?? '';
    else if (arg === '--status') options.status = argv[++i] ?? 'success';
    else if (arg === '--error') options.error = argv[++i] ?? '';
    else if (arg === '--report-url') options.reportUrl = argv[++i] ?? '';
    else if (arg === '--run-url') options.runUrl = argv[++i] ?? '';
  }

  return options;
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function buildPostBody({ title, lines }) {
  const content = lines.map((line) => [{ tag: 'text', text: line }]);
  if (lines.length === 0) {
    content.push([{ tag: 'text', text: '(empty)' }]);
  }

  return {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title,
          content,
        },
      },
    },
  };
}

async function main() {
  const webhook = process.env.FEISHU_WEBHOOK_URL?.trim();
  if (!webhook) {
    throw new Error('Missing FEISHU_WEBHOOK_URL');
  }

  const args = parseArgs(process.argv.slice(2));
  const reportDate = args.report
    ? args.report.split('/').pop()?.replace(/\.md$/, '') ?? 'unknown'
    : new Date().toISOString().slice(0, 10);

  let lines = [];

  if (args.status === 'failure') {
    lines = [
      '❌ Daily content workflow failed',
      args.error || 'Unknown error',
      args.runUrl ? `Workflow: ${args.runUrl}` : '',
    ].filter(Boolean);
  } else {
    const preview = args.report
      ? truncate(readFileSync(args.report, 'utf8'), MAX_PREVIEW_CHARS)
      : '';
    lines = [
      '✅ Raven daily content plan generated',
      `Date: ${reportDate}`,
      '',
      preview,
      '',
      args.reportUrl ? `Full report: ${args.reportUrl}` : '',
      args.runUrl ? `Workflow: ${args.runUrl}` : '',
    ].filter((line, index, arr) => line !== '' || (index > 0 && arr[index - 1] !== ''));
  }

  const title =
    args.status === 'failure'
      ? `Raven Daily · ${reportDate} · FAILED`
      : `Raven Daily Content Plan · ${reportDate}`;

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(buildPostBody({ title, lines })),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`Feishu webhook HTTP ${response.status}: ${raw}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { raw };
  }

  if (parsed.StatusCode !== undefined && parsed.StatusCode !== 0) {
    throw new Error(`Feishu webhook error: ${parsed.StatusMessage ?? raw}`);
  }

  console.log('Feishu notification sent');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

import { Agent, type Dispatcher } from 'undici';

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;
const DEFAULT_HEADERS_TIMEOUT_MS = 120_000;
const LONG_RUNNING_HEADERS_TIMEOUT_MS = 15 * 60 * 1000;

const defaultDispatcher = new Agent({
  connectTimeout: DEFAULT_CONNECT_TIMEOUT_MS,
  headersTimeout: DEFAULT_HEADERS_TIMEOUT_MS,
  bodyTimeout: DEFAULT_HEADERS_TIMEOUT_MS,
});

const longRunningDispatcher = new Agent({
  connectTimeout: DEFAULT_CONNECT_TIMEOUT_MS,
  headersTimeout: LONG_RUNNING_HEADERS_TIMEOUT_MS,
  bodyTimeout: LONG_RUNNING_HEADERS_TIMEOUT_MS,
});

type BackendFetchOptions = {
  longRunning?: boolean;
};

function pickDispatcher(options?: BackendFetchOptions): Dispatcher {
  return options?.longRunning ? longRunningDispatcher : defaultDispatcher;
}

export async function fetchBackend(
  url: string,
  init?: RequestInit,
  options?: BackendFetchOptions,
): Promise<Response> {
  return fetch(url, {
    ...init,
    dispatcher: pickDispatcher(options),
  } as unknown as RequestInit & { dispatcher: Dispatcher });
}

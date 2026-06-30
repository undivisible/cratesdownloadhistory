import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import type { LoadOptions } from './history';

export function historyLoadOptions(locals: APIContext['locals']): LoadOptions {
  return {
    kv: env.CACHE,
    waitUntil: locals.cfContext
      ? (promise) => locals.cfContext!.waitUntil(promise)
      : undefined,
  };
}
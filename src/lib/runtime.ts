import { env } from 'cloudflare:workers';
import type { LoadOptions } from './history';

export function loadOptions(cfContext?: ExecutionContext): LoadOptions {
  return {
    kv: env.CACHE,
    waitUntil: cfContext ? (promise) => cfContext.waitUntil(promise) : undefined,
  };
}
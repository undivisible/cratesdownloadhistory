import {
  fetchDownloadsForCrates,
  fetchUser,
  fetchUserCrates,
  fetchUserStats,
} from './crates';
import { aggregateDownloads } from './chart';
import { getCachedHistory, setCachedHistory, slimHistory } from './cache';
import type { UserDownloadHistory } from './types';

export interface LoadOptions {
  kv?: KVNamespace;
  waitUntil?: (promise: Promise<unknown>) => void;
}

const inflight = new Map<string, Promise<UserDownloadHistory>>();

async function buildHistory(login: string): Promise<UserDownloadHistory> {
  const user = await fetchUser(login);
  const [totalDownloads, crates] = await Promise.all([
    fetchUserStats(user.id),
    fetchUserCrates(user.id),
  ]);

  const active = crates.filter((c) => c.downloads > 0);
  const histories = active.length > 0 ? await fetchDownloadsForCrates(active) : [];
  const points = aggregateDownloads(histories, totalDownloads);

  return {
    user,
    totalDownloads,
    crateCount: crates.length,
    crates: [],
    points,
  };
}

export async function loadUserHistory(
  login: string,
  options: LoadOptions = {},
): Promise<UserDownloadHistory> {
  const key = login.toLowerCase();
  const cached = await getCachedHistory(key, options.kv);
  if (cached && !cached.stale) return cached.history;

  if (cached?.stale && options.waitUntil) {
    options.waitUntil(refreshHistory(key, options.kv));
    return cached.history;
  }

  if (cached) return cached.history;

  let pending = inflight.get(key);
  if (!pending) {
    pending = buildHistory(login).finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }

  const history = await pending;
  await setCachedHistory(key, slimHistory(history), options.kv);
  return history;
}

async function refreshHistory(login: string, kv?: KVNamespace): Promise<void> {
  try {
    const history = slimHistory(await buildHistory(login));
    await setCachedHistory(login, history, kv);
  } catch {
    // keep serving stale cache on refresh failure
  }
}
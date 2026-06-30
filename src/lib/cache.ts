import type { CachedUserHistory } from './types';

const TTL_SECONDS = 3600;
const STALE_SECONDS = 300;

interface CacheEntry {
  history: CachedUserHistory;
  fetchedAt: number;
}

function cacheKey(login: string): string {
  return `history:${login.toLowerCase()}`;
}

type CacheBinding = KVNamespace | undefined;

export async function getCachedHistory(
  login: string,
  kv: CacheBinding,
): Promise<{ history: CachedUserHistory; stale: boolean } | null> {
  if (!kv) return null;

  const raw = await kv.get(cacheKey(login), 'text');
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry;
    const age = (Date.now() - entry.fetchedAt) / 1000;
    if (age > TTL_SECONDS + STALE_SECONDS) return null;
    return { history: entry.history, stale: age > TTL_SECONDS };
  } catch {
    return null;
  }
}

export async function setCachedHistory(
  login: string,
  history: CachedUserHistory,
  kv: CacheBinding,
): Promise<void> {
  if (!kv) return;

  const entry: CacheEntry = { history, fetchedAt: Date.now() };
  await kv.put(cacheKey(login), JSON.stringify(entry), {
    expirationTtl: TTL_SECONDS + STALE_SECONDS,
  });
}

export function slimHistory(history: {
  user: CachedUserHistory['user'];
  totalDownloads: number;
  crateCount: number;
  points: CachedUserHistory['points'];
}): CachedUserHistory {
  return {
    user: history.user,
    totalDownloads: history.totalDownloads,
    crateCount: history.crateCount,
    points: history.points,
  };
}
import type { CrateSummary, CratesUser, VersionDownload } from './types';

const API = 'https://crates.io/api/v1';
const UA = 'crates-download-history/1.0';

interface PaginatedCrates {
  crates: Array<{
    name: string;
    downloads: number;
    created_at: string;
  }>;
  meta: {
    total: number;
    next_page: string | null;
  };
}

async function cratesFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'User-Agent': UA },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`crates.io ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchUser(login: string): Promise<CratesUser> {
  const data = await cratesFetch<{ user: CratesUser }>(`/users/${encodeURIComponent(login)}`);
  return data.user;
}

export async function fetchUserStats(userId: number): Promise<number> {
  const data = await cratesFetch<{ total_downloads: number }>(`/users/${userId}/stats`);
  return data.total_downloads;
}

export async function fetchUserCrates(userId: number): Promise<CrateSummary[]> {
  const crates: CrateSummary[] = [];
  let next: string | null = `/crates?user_id=${userId}`;

  while (next) {
    const page = await cratesFetch<PaginatedCrates>(next);
    for (const crate of page.crates) {
      crates.push({
        name: crate.name,
        downloads: crate.downloads,
        created_at: crate.created_at,
      });
    }
    const cursor = page.meta.next_page;
    next = cursor ? (cursor.startsWith('/') ? cursor : `/crates${cursor}`) : null;
  }

  return crates;
}

export async function fetchCrateDownloads(crate: string): Promise<VersionDownload[]> {
  const data = await cratesFetch<{ version_downloads: VersionDownload[] }>(
    `/crates/${encodeURIComponent(crate)}/downloads`,
  );
  return data.version_downloads;
}

export async function fetchDownloadsForCrates(
  crates: CrateSummary[],
  concurrency = 20,
): Promise<VersionDownload[][]> {
  const results: VersionDownload[][] = new Array(crates.length);
  let index = 0;

  async function worker() {
    while (index < crates.length) {
      const i = index++;
      results[i] = await fetchCrateDownloads(crates[i].name);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, crates.length) }, worker));
  return results;
}
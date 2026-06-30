export interface CratesUser {
  id: number;
  login: string;
  name: string | null;
  avatar: string | null;
  url: string | null;
  created_at: string;
}

export interface CrateSummary {
  name: string;
  downloads: number;
  created_at: string;
}

export interface VersionDownload {
  version: number;
  downloads: number;
  date: string;
}

export interface DownloadPoint {
  date: string;
  daily: number;
  cumulative: number;
}

export interface UserDownloadHistory {
  user: CratesUser;
  totalDownloads: number;
  crateCount: number;
  crates: CrateSummary[];
  points: DownloadPoint[];
}
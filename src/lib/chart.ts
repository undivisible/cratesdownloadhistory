import { CHART_THEMES } from './themes';
import { FONT_STACKS, type DateFormat, type FontFamily, type Theme, type WidgetOptions } from './widget';
import type { DownloadPoint, UserDownloadHistory, VersionDownload } from './types';

export function aggregateDownloads(
  histories: VersionDownload[][],
  totalDownloads: number,
): DownloadPoint[] {
  const daily = new Map<string, number>();

  for (const history of histories) {
    const perDate = new Map<string, number>();
    for (const row of history) {
      perDate.set(row.date, (perDate.get(row.date) ?? 0) + row.downloads);
    }
    for (const [date, count] of perDate) {
      daily.set(date, (daily.get(date) ?? 0) + count);
    }
  }

  const dates = [...daily.keys()].sort();
  if (dates.length === 0) {
    return [{ date: new Date().toISOString().slice(0, 10), daily: 0, cumulative: totalDownloads }];
  }

  const points: DownloadPoint[] = [];
  let cumulative = totalDownloads;

  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const dayCount = daily.get(date) ?? 0;
    points.unshift({ date, daily: dayCount, cumulative });
    cumulative -= dayCount;
  }

  return points;
}

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatChartDate(iso: string, dateFormat: DateFormat): string {
  const [y, m, d] = iso.split('-');
  switch (dateFormat) {
    case 'dmy':
      return `${d}/${m}/${y.slice(2)}`;
    case 'dmy-long':
      return `${d}/${m}/${y}`;
    case 'ymd':
      return iso;
    case 'mdy-long':
      return `${m}/${d}/${y}`;
    case 'mdy':
    default:
      return `${m}/${d}/${y.slice(2)}`;
  }
}

export interface SvgOptions {
  width?: number;
  height?: number;
  title?: string;
  mode?: 'cumulative' | 'daily';
  theme?: Theme;
  dateFormat?: DateFormat;
  font?: FontFamily;
  crateCount?: number;
  showCrates?: boolean;
}

export function svgOptionsFromHistory(
  history: UserDownloadHistory,
  widget: WidgetOptions,
  width?: number,
  height?: number,
): SvgOptions {
  return {
    width,
    height,
    title: `${history.user.login} — ${history.totalDownloads.toLocaleString()} downloads`,
    theme: widget.theme,
    dateFormat: widget.dateFormat,
    font: widget.font,
    crateCount: history.crateCount,
    showCrates: widget.showCrates,
  };
}

export function renderSvg(points: DownloadPoint[], options: SvgOptions = {}): string {
  const width = options.width ?? 800;
  const height = options.height ?? 320;
  const pad = { top: 36, right: 20, bottom: 40, left: 64 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const mode = options.mode ?? 'cumulative';
  const theme = CHART_THEMES[options.theme ?? 'light'] ?? CHART_THEMES.light;
  const dateFormat = options.dateFormat ?? 'mdy';
  const font = FONT_STACKS[options.font ?? 'mono'];

  const values = points.map((p) => (mode === 'cumulative' ? p.cumulative : p.daily));
  const min = mode === 'cumulative' ? Math.min(...values) : 0;
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const x = (i: number) => pad.left + (i / Math.max(points.length - 1, 1)) * plotW;
  const y = (v: number) => pad.top + plotH - ((v - min) / range) * plotH;

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(mode === 'cumulative' ? p.cumulative : p.daily).toFixed(1)}`)
    .join(' ');

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const value = min + (range * i) / yTicks;
    const yy = y(value);
    return `
      <line x1="${pad.left}" y1="${yy.toFixed(1)}" x2="${width - pad.right}" y2="${yy.toFixed(1)}" stroke="${theme.grid}" stroke-width="1"/>
      <text x="${pad.left - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end" fill="${theme.fg}" font-family="${font}" font-size="11">${formatCount(Math.round(value))}</text>
    `;
  }).join('');

  const first = points[0]?.date ?? '';
  const last = points.at(-1)?.date ?? '';
  const title = options.title ?? 'downloads';
  const crateLabel =
    options.showCrates && options.crateCount !== undefined
      ? `${options.crateCount.toLocaleString()} crates`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(crateLabel ? `${title} — ${crateLabel}` : title)}">
  <rect width="100%" height="100%" fill="${theme.bg}"/>
  <text x="${pad.left}" y="22" fill="${theme.fg}" font-family="${font}" font-size="13" font-weight="600">${escapeXml(title)}</text>
  ${crateLabel ? `<text x="${width - pad.right}" y="22" text-anchor="end" fill="${theme.fg}" font-family="${font}" font-size="13" font-weight="600">${escapeXml(crateLabel)}</text>` : ''}
  ${yLabels}
  <path d="${line}" fill="none" stroke="${theme.fg}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  <line x1="${pad.left}" y1="${pad.top + plotH}" x2="${width - pad.right}" y2="${pad.top + plotH}" stroke="${theme.fg}" stroke-width="1"/>
  <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}" stroke="${theme.fg}" stroke-width="1"/>
  <text x="${pad.left}" y="${height - 14}" fill="${theme.fg}" font-family="${font}" font-size="11">${formatChartDate(first, dateFormat)}</text>
  <text x="${width - pad.right}" y="${height - 14}" text-anchor="end" fill="${theme.fg}" font-family="${font}" font-size="11">${formatChartDate(last, dateFormat)}</text>
</svg>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
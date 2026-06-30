import { THEME_DEFINITIONS } from './themes';

export type DateFormat = 'mdy' | 'dmy' | 'ymd' | 'mdy-long' | 'dmy-long';
export type Theme = (typeof THEME_DEFINITIONS)[number]['id'];
export type FontFamily = 'mono' | 'sans' | 'serif';

export interface WidgetOptions {
  theme: Theme;
  dateFormat: DateFormat;
  showCrates: boolean;
  font: FontFamily;
}

const THEME_IDS = new Set(THEME_DEFINITIONS.map((t) => t.id));

function parseBool(value: string | null): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

const DATE_ALIASES: Record<string, DateFormat> = {
  mdy: 'mdy',
  'mm/dd/yy': 'mdy',
  'mm/dd/yyyy': 'mdy-long',
  dmy: 'dmy',
  'dd/mm/yy': 'dmy',
  'dd/mm/yyyy': 'dmy-long',
  ymd: 'ymd',
  iso: 'ymd',
  'yyyy-mm-dd': 'ymd',
  'mdy-long': 'mdy-long',
  'dmy-long': 'dmy-long',
};

const FONT_ALIASES: Record<string, FontFamily> = {
  mono: 'mono',
  monospace: 'mono',
  sans: 'sans',
  'sans-serif': 'sans',
  serif: 'serif',
};

export function parseWidgetOptions(searchParams: URLSearchParams): WidgetOptions {
  const rawTheme = (searchParams.get('theme') ?? 'light').toLowerCase().trim();
  const theme = THEME_IDS.has(rawTheme) ? (rawTheme as Theme) : 'light';

  const rawDate = (searchParams.get('date') ?? searchParams.get('dateFormat') ?? 'mdy')
    .toLowerCase()
    .trim();
  const dateFormat = DATE_ALIASES[rawDate] ?? 'mdy';

  const rawFont = (searchParams.get('font') ?? 'mono').toLowerCase().trim();
  const font = FONT_ALIASES[rawFont] ?? 'mono';

  const showCrates = parseBool(searchParams.get('crates') ?? searchParams.get('showCrates'));

  return { theme, dateFormat, showCrates, font };
}

export function buildWidgetQuery(options: WidgetOptions, cacheBust = false): string {
  const params = new URLSearchParams();
  if (options.theme !== 'light') params.set('theme', options.theme);
  if (options.dateFormat !== 'mdy') params.set('date', options.dateFormat);
  if (options.font !== 'mono') params.set('font', options.font);
  if (options.showCrates) params.set('crates', '1');
  if (cacheBust) params.set('t', String(Date.now()));
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function applyWidgetOptionsToUrl(url: URL, options: WidgetOptions): void {
  if (options.theme === 'light') url.searchParams.delete('theme');
  else url.searchParams.set('theme', options.theme);
  if (options.dateFormat === 'mdy') url.searchParams.delete('date');
  else url.searchParams.set('date', options.dateFormat);
  if (options.font === 'mono') url.searchParams.delete('font');
  else url.searchParams.set('font', options.font);
  if (options.showCrates) url.searchParams.set('crates', '1');
  else url.searchParams.delete('crates');
}

export const DATE_FORMATS: Array<{ id: DateFormat; label: string }> = [
  { id: 'mdy', label: 'MM/DD/YY' },
  { id: 'mdy-long', label: 'MM/DD/YYYY' },
  { id: 'dmy', label: 'DD/MM/YY' },
  { id: 'dmy-long', label: 'DD/MM/YYYY' },
  { id: 'ymd', label: 'YYYY-MM-DD' },
];

export const THEMES = THEME_DEFINITIONS.map((t) => ({ id: t.id, label: t.label }));

export const FONTS: Array<{ id: FontFamily; label: string }> = [
  { id: 'mono', label: 'mono' },
  { id: 'sans', label: 'sans' },
  { id: 'serif', label: 'serif' },
];

export const FONT_STACKS: Record<FontFamily, string> = {
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  sans: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif',
};
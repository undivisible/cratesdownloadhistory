export type DateFormat = 'mdy' | 'dmy' | 'ymd' | 'mdy-long' | 'dmy-long';
export type Theme = 'light' | 'dark';

export interface WidgetOptions {
  theme: Theme;
  dateFormat: DateFormat;
  showCrates: boolean;
}

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

export function parseWidgetOptions(searchParams: URLSearchParams): WidgetOptions {
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light';

  const raw = (searchParams.get('date') ?? searchParams.get('dateFormat') ?? 'mdy')
    .toLowerCase()
    .trim();
  const dateFormat = DATE_ALIASES[raw] ?? 'mdy';

  const showCrates = parseBool(searchParams.get('crates') ?? searchParams.get('showCrates'));

  return { theme, dateFormat, showCrates };
}

export function widgetQuery(options: WidgetOptions): string {
  const params = new URLSearchParams();
  if (options.theme !== 'light') params.set('theme', options.theme);
  if (options.dateFormat !== 'mdy') params.set('date', options.dateFormat);
  if (options.showCrates) params.set('crates', '1');
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const DATE_FORMATS: Array<{ id: DateFormat; label: string }> = [
  { id: 'mdy', label: 'MM/DD/YY' },
  { id: 'mdy-long', label: 'MM/DD/YYYY' },
  { id: 'dmy', label: 'DD/MM/YY' },
  { id: 'dmy-long', label: 'DD/MM/YYYY' },
  { id: 'ymd', label: 'YYYY-MM-DD' },
];

export const THEMES: Array<{ id: Theme; label: string }> = [
  { id: 'light', label: 'light' },
  { id: 'dark', label: 'dark' },
];
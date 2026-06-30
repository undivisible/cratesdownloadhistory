export interface ChartPalette {
  bg: string;
  fg: string;
  grid: string;
}

export interface SitePalette {
  bg: string;
  fg: string;
  muted: string;
  border: string;
  hoverBg: string;
  hoverFg: string;
}

export interface ThemeDefinition {
  id: string;
  label: string;
  chart: ChartPalette;
  site: SitePalette;
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'light',
    label: 'light',
    chart: { bg: '#ffffff', fg: '#000000', grid: '#e5e5e5' },
    site: { bg: '#ffffff', fg: '#000000', muted: '#666666', border: '#000000', hoverBg: '#000000', hoverFg: '#ffffff' },
  },
  {
    id: 'dark',
    label: 'dark',
    chart: { bg: '#000000', fg: '#ffffff', grid: '#333333' },
    site: { bg: '#000000', fg: '#ffffff', muted: '#aaaaaa', border: '#ffffff', hoverBg: '#ffffff', hoverFg: '#000000' },
  },
  {
    id: 'nord',
    label: 'nord',
    chart: { bg: '#2e3440', fg: '#eceff4', grid: '#4c566a' },
    site: { bg: '#2e3440', fg: '#eceff4', muted: '#d8dee9', border: '#88c0d0', hoverBg: '#88c0d0', hoverFg: '#2e3440' },
  },
  {
    id: 'taiga',
    label: 'taiga',
    chart: { bg: '#1a2b33', fg: '#98a12a', grid: '#2f454e' },
    site: { bg: '#1a2b33', fg: '#98a12a', muted: '#6d7f5a', border: '#98a12a', hoverBg: '#98a12a', hoverFg: '#1a2b33' },
  },
  {
    id: 'sepia',
    label: 'sepia',
    chart: { bg: '#f4ecd8', fg: '#5c4b37', grid: '#d9cbb3' },
    site: { bg: '#f4ecd8', fg: '#5c4b37', muted: '#8a7760', border: '#5c4b37', hoverBg: '#5c4b37', hoverFg: '#f4ecd8' },
  },
  {
    id: 'tokyo-night',
    label: 'tokyo night',
    chart: { bg: '#1a1b26', fg: '#c0caf5', grid: '#3b4261' },
    site: { bg: '#1a1b26', fg: '#c0caf5', muted: '#9aa5ce', border: '#7aa2f7', hoverBg: '#7aa2f7', hoverFg: '#1a1b26' },
  },
  {
    id: 'dracula',
    label: 'dracula',
    chart: { bg: '#282a36', fg: '#f8f8f2', grid: '#44475a' },
    site: { bg: '#282a36', fg: '#f8f8f2', muted: '#bd93f9', border: '#ff79c6', hoverBg: '#ff79c6', hoverFg: '#282a36' },
  },
  {
    id: 'catppuccin',
    label: 'catppuccin',
    chart: { bg: '#1e1e2e', fg: '#cdd6f4', grid: '#45475a' },
    site: { bg: '#1e1e2e', fg: '#cdd6f4', muted: '#a6adc8', border: '#cba6f7', hoverBg: '#cba6f7', hoverFg: '#1e1e2e' },
  },
  {
    id: 'one-dark',
    label: 'one dark',
    chart: { bg: '#282c34', fg: '#abb2bf', grid: '#3b4048' },
    site: { bg: '#282c34', fg: '#abb2bf', muted: '#828997', border: '#61afef', hoverBg: '#61afef', hoverFg: '#282c34' },
  },
  {
    id: 'octocat',
    label: 'octocat',
    chart: { bg: '#0d1117', fg: '#e6edf3', grid: '#30363d' },
    site: { bg: '#0d1117', fg: '#e6edf3', muted: '#8b949e', border: '#58a6ff', hoverBg: '#58a6ff', hoverFg: '#0d1117' },
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEME_DEFINITIONS.find((t) => t.id === id) ?? THEME_DEFINITIONS[0];
}

export function siteThemeCss(): string {
  return THEME_DEFINITIONS.map((theme) => `
[data-theme="${theme.id}"] {
  --bg: ${theme.site.bg};
  --fg: ${theme.site.fg};
  --muted: ${theme.site.muted};
  --border: ${theme.site.border};
  --hover-bg: ${theme.site.hoverBg};
  --hover-fg: ${theme.site.hoverFg};
  color-scheme: ${theme.id === 'light' || theme.id === 'sepia' ? 'light' : 'dark'};
}`).join('\n');
}
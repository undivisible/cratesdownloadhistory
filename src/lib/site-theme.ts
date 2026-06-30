import { THEME_DEFINITIONS } from './themes';

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
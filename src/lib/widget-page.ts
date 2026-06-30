import type { WidgetOptions } from './widget';
import { applyWidgetOptionsToUrl, buildWidgetQuery } from './widget';
import { embedUrls } from './embed';

export function readWidgetOptionsFromForm(
  theme: HTMLElement | null,
  date: HTMLElement | null,
  font: HTMLElement | null,
  crates: HTMLElement | null,
  initial: WidgetOptions,
): WidgetOptions {
  return {
    theme:
      theme instanceof HTMLSelectElement ? (theme.value as WidgetOptions['theme']) : initial.theme,
    dateFormat:
      date instanceof HTMLSelectElement
        ? (date.value as WidgetOptions['dateFormat'])
        : initial.dateFormat,
    font: font instanceof HTMLSelectElement ? (font.value as WidgetOptions['font']) : initial.font,
    showCrates: crates instanceof HTMLInputElement ? crates.checked : initial.showCrates,
  };
}

export function updateWidgetPreview(
  origin: string,
  login: string,
  options: WidgetOptions,
  els: {
    preview: HTMLElement | null;
    md: HTMLElement | null;
    html: HTMLElement | null;
    iframe: HTMLElement | null;
    svg: HTMLElement | null;
  },
): void {
  document.documentElement.dataset.theme = options.theme;
  const embeds = embedUrls(origin, login, options);
  const bustQ = buildWidgetQuery(options, true);

  if (els.preview instanceof HTMLImageElement) {
    els.preview.src = `${origin}/api/svg/${encodeURIComponent(login)}${bustQ}`;
  }
  if (els.md) els.md.textContent = embeds.markdown;
  if (els.html) els.html.textContent = embeds.html;
  if (els.iframe) els.iframe.textContent = embeds.iframe;
  if (els.svg) els.svg.textContent = embeds.svgUrl;

  const url = new URL(window.location.href);
  applyWidgetOptionsToUrl(url, options);
  history.replaceState(null, '', url);
}
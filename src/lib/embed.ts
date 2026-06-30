import type { WidgetOptions } from './widget';
import { widgetQuery } from './widget';

export function embedUrls(origin: string, login: string, options: WidgetOptions) {
  const q = widgetQuery(options);
  const user = encodeURIComponent(login);
  const pageUrl = `${origin}/${user}`;
  const svgUrl = `${origin}/api/svg/${user}${q}`;
  const embedUrl = `${origin}/embed/${user}${q}`;

  return {
    pageUrl,
    svgUrl,
    embedUrl,
    markdown: `[![crates.io download history](${svgUrl})](${pageUrl})`,
    html: `<a href="${pageUrl}"><img src="${svgUrl}" alt="crates.io download history for ${login}" /></a>`,
    iframe: `<iframe src="${embedUrl}" width="820" height="360" frameborder="0"></iframe>`,
  };
}
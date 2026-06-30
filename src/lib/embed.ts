import { escapeHtmlAttr } from './escape';
import type { WidgetOptions } from './widget';
import { buildWidgetQuery } from './widget';

export function embedUrls(origin: string, login: string, options: WidgetOptions) {
  const q = buildWidgetQuery(options, false);
  const user = encodeURIComponent(login);
  const pageUrl = `${origin}/${user}`;
  const cratesUrl = `https://crates.io/users/${user}`;
  const svgUrl = `${origin}/api/svg/${user}${q}`;
  const embedUrl = `${origin}/embed/${user}${q}`;

  return {
    pageUrl,
    cratesUrl,
    svgUrl,
    embedUrl,
    markdown: `[![crates.io download history](${svgUrl})](${cratesUrl})`,
    html: `<a href="${cratesUrl}"><img src="${svgUrl}" alt="crates.io download history for ${escapeHtmlAttr(login)}" /></a>`,
    iframe: `<iframe src="${embedUrl}" width="820" height="360" frameborder="0"></iframe>`,
  };
}
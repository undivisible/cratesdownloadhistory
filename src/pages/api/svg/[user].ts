import type { APIRoute } from 'astro';
import { loadUserHistory } from '../../../lib/history';
import { historyLoadOptions } from '../../../lib/request';
import { renderSvg, svgOptionsFromHistory } from '../../../lib/chart';
import { parseWidgetOptions } from '../../../lib/widget';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const login = params.user;
  if (!login) {
    return new Response('missing user', { status: 400 });
  }

  const widget = parseWidgetOptions(new URL(request.url).searchParams);

  try {
    const history = await loadUserHistory(login, historyLoadOptions(locals));
    const svg = renderSvg(history.points, svgOptionsFromHistory(history, widget));

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'CDN-Cache-Control': 'max-age=3600',
      },
    });
  } catch {
    return new Response('not found', { status: 404 });
  }
};
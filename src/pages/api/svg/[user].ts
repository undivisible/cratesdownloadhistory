import type { APIRoute } from 'astro';
import { loadUserHistory } from '../../../lib/history';
import { renderSvg, svgOptionsFromHistory } from '../../../lib/chart';
import { loadOptions } from '../../../lib/runtime';
import { parseWidgetOptions } from '../../../lib/widget';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const login = params.user;
  if (!login) {
    return new Response('missing user', { status: 400 });
  }

  const widget = parseWidgetOptions(new URL(request.url).searchParams);

  try {
    const history = await loadUserHistory(login, loadOptions(locals.cfContext));
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
import type { APIRoute } from 'astro';
import { loadUserHistory } from '../../../lib/history';
import { renderSvg } from '../../../lib/chart';
import { loadOptions } from '../../../lib/runtime';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const login = params.user;
  if (!login) {
    return new Response('missing user', { status: 400 });
  }

  try {
    const history = await loadUserHistory(login, loadOptions(locals.cfContext));
    const mode = 'cumulative';
    const svg = renderSvg(history.points, {
      title: `${history.user.login} — ${history.totalDownloads.toLocaleString()} downloads`,
      mode,
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('not found', { status: 404 });
  }
};
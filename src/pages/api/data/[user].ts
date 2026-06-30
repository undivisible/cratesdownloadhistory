import type { APIRoute } from 'astro';
import { loadUserHistory } from '../../../lib/history';
import { loadOptions } from '../../../lib/runtime';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const login = params.user;
  if (!login) {
    return new Response(JSON.stringify({ error: 'missing user' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const history = await loadUserHistory(login, loadOptions(locals.cfContext));
    return new Response(JSON.stringify(history), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'not found';
    return new Response(JSON.stringify({ error: message }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
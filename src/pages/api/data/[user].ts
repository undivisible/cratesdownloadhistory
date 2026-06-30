import type { APIRoute } from 'astro';
import { loadUserHistory } from '../../../lib/history';
import { historyLoadOptions } from '../../../lib/request';

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
    const history = await loadUserHistory(login, historyLoadOptions(locals));
    return new Response(JSON.stringify(history), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
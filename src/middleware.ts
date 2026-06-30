import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';

const RATE_LIMIT_PER_MINUTE = 60;
const RATE_PREFIX = 'rl:';

function shouldRateLimit(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('/_astro') || pathname === '/favicon.png') {
    return false;
  }
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/embed/') ||
    /^\/[^/]+\/?$/.test(pathname)
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = new URL(context.request.url).pathname;

  if (shouldRateLimit(pathname)) {
    const ip = context.request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const bucket = Math.floor(Date.now() / 60_000);
    const key = `${RATE_PREFIX}${ip}:${bucket}`;
    try {
      const kv = env.CACHE;
      const raw = await kv.get(key);
      const count = raw ? Number(raw) : 0;
      if (count >= RATE_LIMIT_PER_MINUTE) {
        return new Response('rate limited', {
          status: 429,
          headers: { 'Retry-After': '60', 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      await kv.put(key, String(count + 1), { expirationTtl: 120 });
    } catch {
      // dev / missing binding: serve without rate limit
    }
  }

  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (response.headers.get('Content-Type')?.includes('text/html')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src 'self'",
    );
  }
  return response;
});
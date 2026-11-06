import { proxyAnswer } from '@/lib/markdown-copy';
import { isIndexableHost } from '@/lib/site';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * The noindex header, the sitemap's host guard, and the docs' Markdown copies.
 *
 * - Every response from a non-production host is marked noindex. A header
 *   rather than a <meta> tag so it also covers non-HTML responses - the
 *   sitemap, JSON, the generated registry files and the Markdown corpus - and
 *   so it is on this file's own 404s and rewrites as well.
 * - No sitemap off the production host, and `/md/...`, where `next.config.ts`
 *   sends a `.md` address, is refused when it is asked for by name.
 * - A docs page asked for with an `Accept` that prefers `text/markdown` is its
 *   Markdown copy (TI-97).
 *
 * The last two are `proxyAnswer()` in `lib/markdown-copy`, where a test can
 * hold them; this only turns the answer into a response.
 */
export function proxy(request: NextRequest) {
  const answer = proxyAnswer({
    pathname: request.nextUrl.pathname,
    host: request.headers.get('host'),
    accept: request.headers.get('accept'),
  });

  const response =
    'notFound' in answer
      ? new NextResponse(answer.notFound, {
          status: 404,
          headers: { 'content-type': 'text/plain; charset=utf-8' },
        })
      : 'rewrite' in answer
        ? NextResponse.rewrite(new URL(answer.rewrite, request.url))
        : NextResponse.next();

  if (!isIndexableHost(request.headers.get('host'))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  // Everything except build output and the favicon, because the noindex header
  // has to reach every response. robots.txt and sitemap.xml stay in scope
  // deliberately - the header is harmless there, and excluding them is one more
  // thing to keep in sync. Negotiation only looks at docs paths, inside
  // `proxyAnswer()`.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { markdownFor } from '@/lib/docs/llms';
import { CORPUS_CACHE_CONTROL } from '@/lib/markdown-copy';

/**
 * Every documentation page as markdown, at its own address plus `.md` (TI-57).
 *
 *   /docs/setup/macos.md            the guide
 *   /docs/sdk.md                    the API index at the latest release
 *   /docs/sdk/Titanium.UI.Window.md one type
 *   /docs/sdk/13.4.1/Titanium.UI.Window.md  the same type, pinned
 *   /modules/ti.map.md              one module
 *
 * The page's own address reaches it too, from `proxy.ts`, when the request's
 * `Accept` header prefers `text/markdown` (TI-97).
 *
 * ## Why the addresses are not the directory names here
 *
 * A `route.ts` cannot sit at the same segment as a `page.tsx`, and `/docs` is
 * an optional catch-all page. There is no arrangement of files that puts
 * `/docs/setup/macos.md` beside `/docs/setup/macos`, so `next.config.ts`
 * rewrites the `.md` suffix onto this handler. `beforeFiles`, because the docs
 * page route declares `dynamicParams = false` and would otherwise answer 404
 * before a later rewrite was consulted.
 *
 * ## Why `/md/...` itself is a 404
 *
 * A rewrite destination is a real URL, so `/md/docs/setup/macos` would answer
 * as well and the same file would have two addresses. `proxy.ts` refuses it:
 * the proxy runs before any rewrite, so what it sees is what was asked for.
 * TI-57 did this here by reading `request.url`, which cannot tell a direct
 * request from the proxy's negotiated rewrite. One address per document, which
 * is what the reference pages went to some trouble for and what the sitemap and
 * canonical work in TI-48 assumes.
 *
 * ## Served on every host
 *
 * A copy is the same document as the page beside it, which every host serves,
 * so there is no host guard. A preview is closed to crawlers by `robots.txt`
 * and the `X-Robots-Tag` header like every other address on it.
 *
 * ## Rendered per request
 *
 * Not because of anything about the request: nothing here reads it. The pinned
 * type pages are the reason. 284 types is 2.7MB of markdown per SDK version and
 * there are 58 compiled versions, which is more than the deployment's whole
 * 100MB static budget. Rendering is cheap - every read is a JSON file in
 * `registry/`, already on disk - and the response is cached at the edge.
 */

const notFound = () =>
  new Response('Not found.\n', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });

export async function GET(_request: Request, ctx: RouteContext<'/md/[...path]'>) {
  const { path } = await ctx.params;

  // A page that does not parse is a 404 here rather than a 500. `check-docs`
  // fails the build on one, so this cannot fire for a committed guide; what it
  // covers is an arbitrary path arriving from the URL and landing on something
  // that is not a page. `writtenPaths` swallows the same throw for the same
  // reason.
  let body: string | undefined;
  try {
    body = markdownFor(`/${path.join('/')}`);
  } catch {
    return notFound();
  }
  if (!body) return notFound();

  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': CORPUS_CACHE_CONTROL,
      // The page's own address answers with this or with HTML, by `Accept`.
      // The HTML cannot say so (see `proxyAnswer`), so this side does, and no
      // cache hands Markdown to a browser.
      vary: 'Accept',
    },
  });
}

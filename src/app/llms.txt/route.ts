import { llmsTxt } from '@/lib/docs/llms';
import { CORPUS_CACHE_CONTROL } from '@/lib/markdown-copy';

/**
 * The curated index, to the llmstxt.org convention (TI-57).
 *
 * ## Served on every host, and prerendered
 *
 * TI-57 served this on titaniumsdk.com only, reasoning that a preview must not
 * publish a corpus. It hid nothing: every entry is a page that every host
 * already serves as HTML, and the guard made the file untestable on
 * `localhost` and on `preview.titaniumsdk.com` (TI-97). A preview is still
 * closed to crawlers by `robots.txt` and the `X-Robots-Tag` header.
 *
 * With no host to read, nothing makes this request-time, so it is written once
 * at build: about 9KB, from files already on disk. Every link in it is to the
 * production origin, which is the address a reader should keep.
 */

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': CORPUS_CACHE_CONTROL,
    },
  });
}

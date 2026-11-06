import { llmsFullTxt } from '@/lib/docs/llms';
import { CORPUS_CACHE_CONTROL } from '@/lib/markdown-copy';

/**
 * The whole guide corpus in one file (TI-57).
 *
 * Guides only, and capped. `llms.ts` holds both decisions and the reasoning:
 * briefly, the reference is 284 types that a reader can fetch one at a time,
 * and a file nobody can hold in context is not a corpus.
 *
 * Served on every host and prerendered, for the reasons `llms.txt` gives. About
 * 260KB, under the 1MB cap `llms.ts` enforces.
 */

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsFullTxt().text, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': CORPUS_CACHE_CONTROL,
    },
  });
}

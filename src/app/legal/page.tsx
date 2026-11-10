import { Prose } from '@/components/docs/prose';
import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * TiDev's legal page: the corporation, the licences, the CLA, attributions.
 *
 * Moved from the foundation's old site when that domain was lost. Kept as
 * markdown, the same arrangement as `/code-of-conduct`: it is the board's
 * document rather than this site's copy, so a change to it should read as a
 * diff against the words and not as a re-reading of JSX.
 *
 * `content/legal.md` is the old page's MDX body verbatim, less its `# ` title,
 * which belongs to the page frame here. One link changed: the CLA PDF, which
 * the old page named by its tidev.io address and which now ships from this
 * site's `public/`.
 */

export const metadata: Metadata = {
  title: 'Legal - Titanium SDK',
  description:
    'TiDev, Inc. corporation information, software licenses, how contributions are handled, and open source attributions for Titanium SDK.',
  alternates: { canonical: `${SITE_URL}/legal` },
};

const body = readFileSync(join(process.cwd(), 'content/legal.md'), 'utf8');

export default function LegalPage() {
  return (
    // Gutters, matching /code-of-conduct. This route has no layout of its own.
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">Legal</h1>

        <Prose markdown={body} className="mt-8" />
      </div>
    </div>
  );
}

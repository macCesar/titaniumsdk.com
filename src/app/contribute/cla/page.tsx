import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

/**
 * The Contributor License Agreement, and a placeholder for signing it.
 *
 * Signing used to happen on tidev.io, which `/contribute` linked out to. That
 * domain was lost, so the CLA moved here. The status check moved first,
 * because every pull request across the org waits on it (`./check`); the
 * signing flow is still to be ported, and until it is this page says so.
 *
 * Existing signatures are unaffected, and the page says that before anything
 * else. Most people arriving here were sent by a failed or pending check on a
 * pull request, and the first thing they need to know is whether they have to
 * do anything.
 *
 * Kept out of the sitemap while it is a placeholder.
 */

export const metadata: Metadata = {
  title: 'Contributor License Agreement - Titanium SDK',
  description:
    'The TiDev Contributor License Agreement, which every code contributor signs before a pull request can be merged.',
  alternates: { canonical: `${SITE_URL}/contribute/cla` },
};

/** Served from `public/`, the same file tidev.io offered. */
const CLA_PDF = '/contribute/cla/CONTRIBUTOR_CLA_1.2.pdf';

/** The site's Slack page, which offers both signing up and logging in. */
const SLACK = '/slack';

export default function ContributorLicenseAgreementPage() {
  return (
    // Gutters, matching /contribute. This route has no layout of its own.
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl py-10">
        <p className="text-sm">
          <a href="/contribute" className="text-link hover:underline">
            Contribute
          </a>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
          Contributor License Agreement
        </h1>

        <div
          role="status"
          className="mt-8 rounded-lg border border-border bg-surface/40 p-5 text-text-muted"
        >
          <h2 className="text-base font-semibold tracking-tight text-text">
            Signing is under construction
          </h2>
          <p className="mt-2">
            The page for signing the CLA is moving to this site and is not ready yet. If you have
            already signed, there is nothing to do: your agreement is still on file, and the CLA
            check on your pull requests still recognises it.
          </p>
          <p className="mt-3">
            If you need to sign before the page is back, ask in the{' '}
            <a href={SLACK} className="text-link hover:underline">
              community Slack
            </a>
            .
          </p>
        </div>

        <section aria-labelledby="about" className="mt-12">
          <h2 id="about" className="text-xl font-semibold tracking-tight">
            About the agreement
          </h2>
          <p className="mt-2 text-text-muted">
            Before we can accept a pull request, its author must have a signed Contributor License
            Agreement on file with TiDev, Inc. It is an agreement between an individual and TiDev,
            and it assigns ownership of the code, documentation and other contributions you make to
            TiDev. That keeps the ownership of the project clear, and avoids disputes later.
          </p>
          <p className="mt-3 text-text-muted">
            Check that your employer allows you to sign it before contributing.
          </p>
          <p className="mt-5">
            <a
              href={CLA_PDF}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-border-strong"
            >
              Read the CLA (PDF, version 1.2)
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

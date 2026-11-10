import { supportNav } from '@/lib/nav';
import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

/**
 * How to fund the project.
 *
 * Moved from the foundation's old site when that domain was lost, and the
 * address the 38 imported blog posts end on ("think about a donation"). The
 * copy is that page's; the layout is this site's, the same cards `/contribute`
 * draws its donation section with.
 *
 * The routes come from `supportNav`, like the footer's Support column and
 * `/contribute`, so the three cannot list different places to give. The lines
 * describing them are this page's copy and live here, keyed by URL; a route
 * added there without a line here still renders, just undescribed.
 */

export const metadata: Metadata = {
  title: 'Donate - Titanium SDK',
  description:
    'Support Titanium with a donation to TiDev, Inc. through GitHub Sponsors or Liberapay. Donations pay the engineers who maintain it.',
  alternates: { canonical: `${SITE_URL}/donate` },
};

const BLURB: Record<string, string> = {
  'https://github.com/sponsors/tidev/': 'Choose between different tiers or a custom payment.',
  'https://en.liberapay.com/tidev': 'Pay what you think it’s worth.',
};

export default function DonatePage() {
  return (
    // Gutters, matching /contribute. This route has no layout of its own.
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl py-10">
        <p className="text-sm text-text-muted">Want to support us?</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Donations</h1>
        <p className="mt-3 max-w-3xl text-text-muted">
          Please consider supporting this project by making a charitable donation. The money you
          donate goes to compensate the skilled engineers and maintainers that keep this project
          going.
        </p>
        <p className="mt-3 max-w-3xl text-text-muted">
          TiDev, Inc. is a registered 501(c)(3) non-profit. See{' '}
          <a href="/legal" className="text-link hover:underline">
            Legal
          </a>{' '}
          for the corporation’s details.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {supportNav.map((item) => (
            <li
              key={item.href}
              className="relative flex flex-col rounded-lg border border-border p-5 transition-colors hover:border-border-strong"
            >
              <h2 className="text-base font-semibold tracking-tight">{item.label}</h2>
              {BLURB[item.href] && (
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{BLURB[item.href]}</p>
              )}
              {/* The whole card is the target: `after:inset-0` stretches this
                  link over it, the same way /contribute's cards work. */}
              <a
                href={item.href}
                className="mt-auto pt-4 text-sm text-link after:absolute after:inset-0 hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Donate with {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

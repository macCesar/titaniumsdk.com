import { ExternalLink } from '@/components/ui/external-link';
import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';

/**
 * The way into the community Slack.
 *
 * Every Slack link on the site lands here rather than on Slack itself, because
 * no single Slack address serves everyone. The workspace root answers 403 to
 * anybody not already a member, and the shared invite link is useless to
 * somebody who is. This page offers both and lets the reader pick.
 *
 * It is also the one place to change when the invite link does. Shared invites
 * can expire, and before this page existed the join address lived on a domain
 * the project has since lost.
 */

export const metadata: Metadata = {
  title: 'Slack - Titanium SDK',
  description:
    'Join the Titanium community Slack to get help, share what you are working on, or just hang out.',
  alternates: { canonical: `${SITE_URL}/slack` },
};

const SIGN_UP = 'https://join.slack.com/t/tidev/shared_invite/zt-14qoze45t-Xx1NCSQ~akAEl70MVqjO_g';
const LOG_IN = 'https://tidev.slack.com';

/** Outline icons, drawn the way the rest of the site's are: 24 grid, 2 stroke. */
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {children}
    </svg>
  );
}

/** A person with a plus: a new account. */
const UserPlusIcon = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6" />
    <path d="M22 11h-6" />
  </Icon>
);

/** An arrow going through a door: signing in to something you already have. */
const LogInIcon = () => (
  <Icon>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5" />
    <path d="M15 12H3" />
  </Icon>
);

/**
 * Slack's mark, in one colour.
 *
 * `currentColor` rather than the four brand colours, the same treatment the
 * header gives GitHub's mark: a multicoloured logo is the loudest thing on any
 * page it sits on, and this page is about the community, not the vendor.
 */
function SlackMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

/**
 * The two ways in, new members first.
 *
 * Sign-up leads because a reader who is already a member mostly has Slack open
 * and did not need this page; the one who arrives here from a "join our Slack"
 * link in a release note or a guide is usually new.
 */
const DOORS = [
  {
    href: SIGN_UP,
    icon: <UserPlusIcon />,
    title: 'New to the community?',
    body: 'Join the TiDev workspace with our invite link.',
    cta: 'Sign up',
    primary: true,
  },
  {
    href: LOG_IN,
    icon: <LogInIcon />,
    title: 'Already a member?',
    body: 'Go straight to the workspace at tidev.slack.com.',
    cta: 'Log in',
    primary: false,
  },
];

export default function SlackPage() {
  return (
    // Gutters, matching /contribute. This route has no layout of its own.
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl py-10">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">
            <SlackMark />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Slack</h1>
        </div>
        <p className="mt-5 text-lg leading-relaxed text-text-muted">
          Need help? Want to share what you&apos;re working on? Just want to hang out? Feel free to
          join the chat!
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {DOORS.map((door) => (
            <li
              key={door.href}
              className={`relative flex flex-col rounded-lg border p-5 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${
                door.primary
                  ? 'border-link/40 bg-surface/40 hover:border-link'
                  : 'border-border hover:border-border-strong'
              }`}
            >
              <span
                className={`flex size-10 items-center justify-center rounded-lg ${
                  door.primary ? 'bg-link text-bg' : 'border border-border text-text-muted'
                }`}
              >
                {door.icon}
              </span>
              <h2 className="mt-4 text-base font-semibold tracking-tight">{door.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{door.body}</p>
              {/* The whole card is the target: `after:inset-0` stretches this
                  link over it, the same way /contribute's cards work. The ring
                  is drawn on the card, by `has-focus-visible`, so a keyboard
                  user sees the same box a mouse user clicks.

                  A new tab, so the reader keeps this page while Slack's
                  sign-up or login runs. `ExternalLink` adds the screen-reader
                  warning that goes with taking over the back button. */}
              <ExternalLink
                href={door.href}
                className="mt-auto inline-flex items-center pt-4 text-sm font-medium text-link outline-none after:absolute after:inset-0 hover:text-link-hover"
              >
                {door.cta}
              </ExternalLink>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-text-muted">
          Everyone in the chat agrees to the{' '}
          <a href="/code-of-conduct" className="text-link hover:underline">
            Code of Conduct
          </a>
          .
        </p>
      </div>
    </div>
  );
}

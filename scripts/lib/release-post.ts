import { PLACEHOLDER } from '../../src/lib/blog/placeholder.ts';

/**
 * The draft announcement a GA release starts with.
 *
 * The release note is generated - titanium-sdk's release workflow runs its
 * changelog and opens a pull request here with `registry/sdk/<v>/release-notes.md`.
 * The announcement cannot be: what is worth announcing is a judgement, and the
 * posts that exist are short, hand-written summaries of a long changelog. So the
 * same pull request carries a draft with everything mechanical already filled in
 * and the judgement left as marked gaps, and a person turns it into the post.
 *
 * The shape is the one every release post since 11.0.0 has used. Filled in
 * here: the title, date, version strings, release type, the install steps, the
 * release-note link and the thanks line, whose names come from the note's
 * Community Credits. Left as `PLACEHOLDER`: the summary, the highlights, the
 * breaking changes when the note has any, and the author.
 *
 * Node built-ins only, and nothing from this repository's dependencies: the
 * release workflow runs this in a bare checkout without installing anything.
 */

/**
 * Every gap a person has to fill is marked with this, as visible text rather
 * than an HTML comment, so a reviewer looking at the draft's preview sees each
 * one where it sits. The check that enforces it lives with the blog.
 */
export { PLACEHOLDER };

/** `14.0.0` -> `sdk-14-0-0-ga`, the slug every release post uses. */
export function releasePostSlug(version: string): string {
  return `sdk-${version.replace(/\./g, '-')}-ga`;
}

/** Major, minor or patch, read off the version the way the changelog does. */
export function releaseKind(version: string): 'major' | 'minor' | 'patch' {
  const [, minor, patch] = version.split('.').map(Number);
  return patch ? 'patch' : minor ? 'minor' : 'major';
}

/**
 * The section of a release note that begins with `## <heading>`, or ''.
 *
 * Up to the next `## `, so a `###` platform subheading stays inside it.
 */
function section(note: string, heading: string): string {
  const start = note.search(new RegExp(`^## ${heading}\\s*$`, 'm'));
  if (start === -1) return '';
  const rest = note.slice(start).replace(/^.*\n/, '');
  const end = rest.search(/^## /m);
  return end === -1 ? rest : rest.slice(0, end);
}

/**
 * The people a release note credits, in its order, without bots.
 *
 * Community Credits lists each contributor as a top-level `* Name` bullet, with
 * their commits nested under it. The same person can appear twice, under their
 * name and their login, when commits were made both ways; both are kept, because
 * telling a login from a different person's name is not something to guess at
 * in a generator. The author trims the list.
 */
export function creditsFromNote(note: string): string[] {
  const names = [...section(note, 'Community Credits').matchAll(/^\* (.+?)\s*$/gm)]
    .map((m) => m[1])
    .filter((name) => !/\[bot\]$|^dependabot|^github-actions/i.test(name));
  return [...new Set(names)];
}

/** Whether the note has a BREAKING CHANGES section with anything in it. */
export function hasBreakingChanges(note: string): boolean {
  return /^\s*\* /m.test(section(note, 'BREAKING CHANGES'));
}

/** `a`, `a and b`, `a, b and c`. */
function list(names: string[]): string {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}

export type ReleasePostInput = {
  /** `14.0.0`, without the channel. */
  version: string;
  /** `YYYY-MM-DD`, the release date. */
  date: string;
  /** The generated release note, if it is there to read. */
  note?: string;
};

/** The draft post, as the file's full text. */
export function renderReleasePost({ version, date, note = '' }: ReleasePostInput): string {
  const ga = `${version}.GA`;
  const kind = releaseKind(version);
  const credits = creditsFromNote(note);

  const thanks = credits.length
    ? `Thanks to everyone in the community who contributed fixes and improvements to this release, especially ${list(credits)}! ${PLACEHOLDER}: drop your own name, and any login that repeats a name already listed.`
    : `Thanks to everyone in the community who contributed fixes and improvements to this release! ${PLACEHOLDER}: name the people the release note credits.`;

  const breaking = hasBreakingChanges(note)
    ? [
        '**Breaking changes:**',
        '',
        `- ${PLACEHOLDER}: the breaking changes from the release note, in a line each`,
        '',
      ]
    : [];

  return [
    '---',
    `title: 'Titanium SDK ${ga} released'`,
    `description: '${PLACEHOLDER}: one line on what this release is about'`,
    `date: '${date}'`,
    `author: '${PLACEHOLDER}: your name'`,
    "category: 'Releases'",
    "cover: '/blog/titanium-general.png'",
    'draft: true',
    '---',
    '',
    `![Titanium SDK ${ga}](/blog/titanium-general.png)`,
    '',
    `Titanium SDK ${version} is a ${kind} release of the SDK. ${PLACEHOLDER}: what it adds or fixes, in a sentence or two.`,
    '',
    'Here are the highlights of the release:',
    '',
    `- ${PLACEHOLDER}: the changes worth announcing, one per line, each starting with its platform (iOS:, Android:, CLI:)`,
    '',
    ...breaking,
    thanks,
    '',
    `For a more detailed overview and all changes, see the release notes: [Titanium SDK ${ga} Release Note](/docs/sdk/${version}/release-notes).`,
    '',
    '## Install',
    '',
    `**Follow these steps to get SDK ${ga}:**`,
    '',
    '1. Install the CLI with `npm i -g titanium alloy`',
    `2. Run \`titanium sdk install ${ga}\``,
    `3. Set \`<sdk-version>${ga}</sdk-version>\` in your \`tiapp.xml\``,
    '',
    '## Report Bugs',
    '',
    'If you run into any issues that seem related to the update, please report them on [GitHub](https://github.com/tidev/titanium-sdk/issues).',
    '',
    '## How can I support?',
    '',
    'If you like our work and want to support, think about a [donation](/contribute#donate) or to [contribute](/contribute) with your time and code.',
    'A donation helps us to cover the monthly maintenance costs of the projects, so we can continue to release feature- and compatibility updates in the future. Your help is appreciated!',
    '',
  ].join('\n');
}

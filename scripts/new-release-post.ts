import { PLACEHOLDER, releasePostSlug, renderReleasePost } from './lib/release-post.ts';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Writes the draft announcement for a GA release.
 *
 *   node scripts/new-release-post.ts --version 14.0.0 [--date 2026-11-10]
 *
 * Run by titanium-sdk's release workflow, in the same checkout where it has just
 * written `registry/sdk/<version>/release-notes.md`, so both land in one pull
 * request. Also fine to run by hand. The date defaults to today in UTC, which is
 * the release date when the workflow runs it.
 *
 * Never overwrites. A post for the version that already exists - written by hand
 * ahead of the release, or by an earlier run - is left alone, and that is a
 * success rather than an error: the release workflow must not fail over it.
 *
 * Node built-ins only; see `lib/release-post.ts`.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const version = arg('version');
const date = arg('date') ?? new Date().toISOString().slice(0, 10);

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('usage: node scripts/new-release-post.ts --version <x.y.z> [--date YYYY-MM-DD]');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`--date must be YYYY-MM-DD, not ${date}`);
  process.exit(1);
}

const out = join(root, 'content/blog', `${releasePostSlug(version)}.md`);
if (existsSync(out)) {
  console.log(`${out} already exists; leaving it alone.`);
  process.exit(0);
}

const notePath = join(root, 'registry/sdk', version, 'release-notes.md');
const note = existsSync(notePath) ? readFileSync(notePath, 'utf8') : undefined;
if (!note) {
  console.warn(`No release note at ${notePath}; the thanks line will be a placeholder too.`);
}

writeFileSync(out, renderReleasePost({ version, date, note }));
console.log(`Wrote ${out} as a draft. Fill in every ${PLACEHOLDER}, then set draft: false.`);

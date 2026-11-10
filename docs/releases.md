# What a Titanium SDK release does to this site

A GA release reaches this site in one pull request, opened by titanium-sdk's
release workflow (`.github/workflows/release.yml`, the `release-notes` job). It
holds two files:

| File                                      | Written by                                    | Before merging                                                            |
| ----------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `registry/sdk/<version>/release-notes.md` | titanium-sdk's `changelog/release-notes.js`   | Edit **About this release**; the generator can only say "a major release" |
| `content/blog/sdk-<x-y-z>-ga.md`          | `scripts/new-release-post.ts`, from this repo | Nothing; it is a draft                                                    |

Merging the pull request publishes the release note straight away. The
announcement stays a draft: reachable by URL with a banner, but not in the blog
index, the feed or the sitemap.

## Writing the announcement

Edit the draft, on the release pull request or in a later one:

1. Fill in every `TODO(release-post)`: the description, the author, the
   summary, the highlights, and the breaking changes when there are any.
2. Trim the thanks line. It lists everyone the release note credits, which
   includes the author, and sometimes the same person under a name and a login.
3. Run `node scripts/generate-social-posts.ts` to write the share text.
4. Set `draft: false`.

`pnpm check:docs` refuses a post with `draft: false` that still contains a
`TODO(release-post)`, so step 4 cannot run ahead of step 1.

A post that already exists for the version is never overwritten, so one
written by hand ahead of the release is left as it is.

## By hand

The same two steps, when the workflow did not run:

```sh
# in a titanium-sdk checkout, on the release tag
node changelog/release-notes.js --channel GA --out ../titaniumsdk.com/registry/sdk/<version>/release-notes.md

# here
pnpm blog:release --version <version> --date <YYYY-MM-DD>
```

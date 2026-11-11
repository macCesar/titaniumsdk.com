# What a Titanium SDK release does to this site

Everything here is automated. A person writes two things - the release note's
**About this release** paragraph and the announcement - and approves the
release. Nothing else is a step to remember.

## The order of events

titanium-sdk's release workflow (`.github/workflows/release.yml`) drives it:

| When                                  | What happens on this site                                                                                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The release run starts                | A **draft** pull request opens with the release note and a draft announcement (the `release-notes` job). It cannot be merged while it is a draft.                                      |
| The `Release` environment is approved | The release is published. Regen Builds adds it to the release lists.                                                                                                                   |
| The release job succeeds              | Regen API Docs compiles the version's reference, captures its toolchain, regenerates the compatibility page, and cuts the guides snapshot if it is a new major (one commit to `main`). |
| The release job succeeds              | The pull request's dates are set to the release day and it is marked ready to merge.                                                                                                   |

A cancelled or rejected release leaves the pull request a draft, and a re-run of
the release workflow leaves an existing pull request alone, so edits made on it
are never overwritten.

## The pull request

It holds two files:

| File                                      | Written by                                    | Before merging                                                            |
| ----------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `registry/sdk/<version>/release-notes.md` | titanium-sdk's `changelog/release-notes.js`   | Edit **About this release**; the generator can only say "a major release" |
| `content/blog/sdk-<x-y-z>-ga.md`          | `scripts/new-release-post.ts`, from this repo | Nothing; it is a draft                                                    |

Merging the pull request publishes the release note straight away, which is why
it stays a GitHub draft until the release is approved. The announcement stays a
draft post after merging: reachable by URL with a banner, but not in the blog
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

Only for recovering from a run that failed. The release note and the draft:

```sh
# in a titanium-sdk checkout, on the release branch or tag
node changelog/release-notes.js --channel GA --out ../titaniumsdk.com/registry/sdk/<version>/release-notes.md

# here
pnpm blog:release --version <version> --date <YYYY-MM-DD>
```

The reference, toolchain, compatibility page and snapshot: run the **Regen API
Docs** workflow from the Actions tab with repo `tidev/titanium-sdk`, ref the
release tag (`14_0_0_GA`) and version `14.0.0`. It does all four.

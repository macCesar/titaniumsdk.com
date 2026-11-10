# The blog split, and the foundation's pages

Settled in [TI-68](https://linear.app/titanium-sdk/issue/TI-68). Read this before
writing a post, or before touching `content/blog`, `/donate`, `/legal` or
`/contribute/cla`.

## What changed

TI-68 split the blog between this site and the foundation's own site: posts
about the software here, posts about TiDev the organisation there. In November
2026 the foundation lost its domain - it was registered to a former board member
and never transferred to the organisation - and everything this site used to
link out to for the foundation moved here:

| Page                               | What it is                                          |
| ---------------------------------- | --------------------------------------------------- |
| `/donate`                          | The two donation routes, from `supportNav`.         |
| `/legal`                           | The corporation, licences, CLA and attributions.    |
| `/contribute/cla`                  | The CLA, and a placeholder until signing is ported. |
| `/contribute/cla/check/<username>` | The status check `tidev-cla-action` calls.          |

The old domain is not linked from anywhere on this site, and should not be
again.

## The rule for posts

**titaniumsdk.com/blog is the blog for the software.** Releases, tutorials,
platform news, community calls - anything a developer using Titanium would want
to read.

Foundation posts - governance, funding, trademark, board news - went to the
foundation's site, which no longer exists. Where they go now is undecided.

Cross-posting was rejected. TI-53 named the failure mode - two half-maintained
blogs - and a `rel=canonical` between them buys the appearance of a decision
without making one.

## The 50 imported posts

All of them are ours. The import categorised them 48 `Releases` and 2
`Community`; none is a foundation post, so the split moved the whole archive
rather than dividing it. They are live at `titaniumsdk.com/blog/<slug>`, and
each page emits `alternates.canonical` pointing at this site.

The slugs are the `tidev-www` filenames with underscores replaced by hyphens,
and nothing else. `scripts/import-tidev-blog.ts` reads a `tidev-www` checkout,
not the lost domain, so it can still be re-run. The redirects from the old blog
addresses were never deployed, and now cannot be.

## The CLA

The signed records are not in this repository: they carry names, titles and
email addresses, and this repository is public. `src/lib/cla/signers.json`
holds the GitHub usernames and nothing else, which is all the status check
needs and which `tidev/organization-docs` already publishes. Adding a signer is
a line in that file and a deploy.

## What was removed

Imported posts carried a `source:` frontmatter field recording their old URL.
It drove nothing - canonical is unconditional and points here - and TI-68
required it either drive the canonical tag or go. It went. Provenance is not
lost: `scripts/import-tidev-blog.ts` computes the same URL from the filename,
and git records the import.

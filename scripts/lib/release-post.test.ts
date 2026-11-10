import {
  creditsFromNote,
  hasBreakingChanges,
  PLACEHOLDER,
  releaseKind,
  releasePostSlug,
  renderReleasePost,
} from './release-post.ts';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

/** The shape `changelog/release-notes.js` in titanium-sdk writes. */
const NOTE = `---
title: Titanium SDK 14.0.0.GA
date: 2026-11-10
version: 14.0.0
channel: GA
---

## About this release

Titanium SDK 14.0.0 is a major release of the SDK.

## Community Credits

* Michael Gangolf
  * parity for Matrix2D.rotate ([54848a1](https://github.com/tidev/titanium-sdk/commit/54848a1))
* Hans Knöchel
  * Xcode 27.2 fixes ([3e7f644](https://github.com/tidev/titanium-sdk/commit/3e7f644))
* dependabot[bot]
  * bump something ([1111111](https://github.com/tidev/titanium-sdk/commit/1111111))
* Sergey Volkov
  * a fix ([2222222](https://github.com/tidev/titanium-sdk/commit/2222222))

## Bug Fixes

### iOS platform

* a fix

## BREAKING CHANGES

### Multiple platforms

* Android: Ti.UI.Color parity
`;

describe('release post helpers', () => {
  test('names the post the way every release post is named', () => {
    assert.equal(releasePostSlug('14.0.0'), 'sdk-14-0-0-ga');
    assert.equal(releasePostSlug('13.4.1'), 'sdk-13-4-1-ga');
  });

  test('reads the release type off the version', () => {
    assert.equal(releaseKind('14.0.0'), 'major');
    assert.equal(releaseKind('13.4.0'), 'minor');
    assert.equal(releaseKind('13.4.1'), 'patch');
  });

  test('takes the credited people from Community Credits, without bots', () => {
    assert.deepEqual(creditsFromNote(NOTE), ['Michael Gangolf', 'Hans Knöchel', 'Sergey Volkov']);
    // Nested commit bullets are not people.
    assert.ok(!creditsFromNote(NOTE).some((n) => n.includes('Matrix2D')));
  });

  test('notices breaking changes only when there are some', () => {
    assert.equal(hasBreakingChanges(NOTE), true);
    assert.equal(hasBreakingChanges(NOTE.replace(/## BREAKING CHANGES[\s\S]*/, '')), false);
    assert.equal(hasBreakingChanges('## BREAKING CHANGES\n\n### iOS platform\n'), false);
  });
});

describe('renderReleasePost', () => {
  const post = renderReleasePost({ version: '14.0.0', date: '2026-11-10', note: NOTE });

  test('is a draft', () => {
    assert.match(post, /^draft: true$/m);
  });

  test('fills in everything mechanical', () => {
    assert.match(post, /^title: 'Titanium SDK 14\.0\.0\.GA released'$/m);
    assert.match(post, /^date: '2026-11-10'$/m);
    assert.match(post, /is a major release of the SDK/);
    assert.match(post, /\(\/docs\/sdk\/14\.0\.0\/release-notes\)/);
    assert.match(post, /titanium sdk install 14\.0\.0\.GA/);
    assert.match(post, /<sdk-version>14\.0\.0\.GA<\/sdk-version>/);
    assert.match(post, /especially Michael Gangolf, Hans Knöchel and Sergey Volkov!/);
  });

  test('leaves the judgement to a person, and marks where', () => {
    for (const field of ['description', 'author']) {
      assert.match(post, new RegExp(`^${field}: '${PLACEHOLDER.replace(/[()]/g, '\\$&')}`, 'm'));
    }
    assert.match(post, /\*\*Breaking changes:\*\*/);
  });

  test('omits breaking changes when the note has none, and copes without a note', () => {
    const patch = renderReleasePost({ version: '13.4.2', date: '2026-12-01' });
    assert.doesNotMatch(patch, /Breaking changes/);
    assert.match(patch, /is a patch release/);
    assert.match(patch, /release!.*name the people the release note credits/);
  });

  test('links donations to where they live now', () => {
    assert.match(post, /\[donation\]\(\/contribute#donate\)/);
  });
});

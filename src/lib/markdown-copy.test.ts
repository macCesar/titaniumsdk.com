import { markdownFor } from './docs/llms.ts';
import { listedModuleIds } from './docs/modules.ts';
import { latestSdkVersion, sdkIndex } from './docs/registry.ts';
import {
  hasMarkdownCopy,
  markdownAlternate,
  markdownHref,
  prefersMarkdown,
  proxyAnswer,
} from './markdown-copy.ts';
import { SITE_URL } from './site.ts';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

/**
 * Where a page's Markdown copy is, and what the proxy does with a request for
 * it (TI-97). Ported from sigil's `test/markdown-copy.test.ts` (SIG-267), with
 * this site's addresses.
 */

const PRODUCTION = new URL(SITE_URL).host;
const PREVIEW = 'preview.titaniumsdk.com';
const HOSTS = [PRODUCTION, PREVIEW, 'localhost:3000', null];

describe('prefersMarkdown', () => {
  test('answers Markdown to a client that names it over HTML', () => {
    for (const accept of [
      'text/markdown',
      'text/markdown, text/html;q=0.9',
      'text/markdown, */*',
      'text/markdown;q=0.9, text/*;q=0.5',
      'text/html;q=0.5, text/markdown',
      'TEXT/MARKDOWN',
      'text/markdown; charset=utf-8',
    ]) {
      assert.equal(prefersMarkdown(accept), true, accept);
    }
  });

  test('answers HTML to a browser, to nothing, and to a client that would rather', () => {
    for (const accept of [
      null,
      '',
      '*/*',
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'text/html, text/markdown',
      'text/html, text/markdown;q=0.1',
      'text/markdown;q=0.5, */*',
      'text/markdown;q=0',
      'application/json',
      // What Next's own client navigation sends for an RSC payload.
      'text/x-component',
    ]) {
      assert.equal(prefersMarkdown(accept), false, String(accept));
    }
  });
});

describe('the Markdown address', () => {
  test("is the page's own, plus .md", () => {
    assert.equal(markdownHref('/docs/setup/macos'), '/docs/setup/macos.md');
    assert.equal(markdownHref('/docs/setup/'), '/docs/setup.md');
    assert.equal(markdownHref('/docs'), '/docs.md');
  });

  test('is named absolutely in the head, as the canonical is', () => {
    assert.deepEqual(markdownAlternate('/docs/sdk/Titanium.UI.Window'), {
      'text/markdown': 'https://titaniumsdk.com/docs/sdk/Titanium.UI.Window.md',
    });
  });

  test('is offered for the shapes that have a copy', () => {
    for (const path of [
      '/docs',
      '/docs/setup/macos',
      '/docs/sdk',
      '/docs/sdk/13.4.1',
      '/docs/sdk/Titanium.UI.Window',
      '/docs/sdk/13.4.1/Titanium.UI.Window',
      '/modules',
      '/modules/ti.map',
    ]) {
      assert.equal(hasMarkdownCopy(path), true, path);
    }
  });

  test('is not offered for a page with no copy, or for anything else', () => {
    // A page with no copy should answer its HTML to a client that prefers
    // Markdown, not a 404 from the `.md` route.
    for (const path of [
      '/',
      '/blog',
      '/docs-archive',
      '/modulesx',
      '/docs/v13/setup/macos',
      '/docs/sdk/13.4.1/compatibility',
      '/docs/sdk/13.4.1/release-notes',
      '/docs/sdk/a/b/c',
      '/modules/ti.map/api',
      '/modules/ti.map/v/5.0.0',
      // The `.md` address itself, which the config rewrite handles.
      '/docs/setup/macos.md',
    ]) {
      assert.equal(hasMarkdownCopy(path), false, path);
    }
  });

  test('agrees with the route on every shape it offers', () => {
    // The shape test runs in the proxy and cannot read disk, so this is what
    // holds it to what `markdownFor` actually serves.
    const version = latestSdkVersion()!;
    const [type] = sdkIndex(version)!.types;
    const [moduleId] = listedModuleIds();
    for (const path of [
      '/docs',
      '/docs/setup/macos',
      '/docs/sdk',
      `/docs/sdk/${version}`,
      `/docs/sdk/${type.name}`,
      `/docs/sdk/${version}/${type.name}`,
      '/modules',
      `/modules/${moduleId}`,
    ]) {
      assert.equal(hasMarkdownCopy(path), true, path);
      assert.ok(markdownFor(path), `${path} is offered and has no copy`);
    }
  });
});

describe('proxyAnswer', () => {
  const ask = (pathname: string, host: string | null, accept: string | null = null) =>
    proxyAnswer({ pathname, host, accept });

  test("refuses the rewrite's destination when it is asked for by name", () => {
    for (const host of HOSTS) {
      assert.ok('notFound' in ask('/md/docs/setup/macos', host));
      assert.ok('notFound' in ask('/md', host));
      // Not even by a client that prefers Markdown.
      assert.ok('notFound' in ask('/md/docs/setup/macos', host, 'text/markdown'));
    }
  });

  test('serves the sitemap on the production host only', () => {
    assert.deepEqual(ask('/sitemap.xml', PRODUCTION), { pass: true });
    assert.deepEqual(ask('/sitemap.xml', 'www.titaniumsdk.com'), { pass: true });
    assert.ok('notFound' in ask('/sitemap.xml', PREVIEW));
    assert.ok('notFound' in ask('/sitemap.xml', null));
    assert.ok('notFound' in ask('/sitemap.xml', 'localhost:3000'));
  });

  test('leaves robots.txt to its route, which closes a preview itself', () => {
    for (const host of HOSTS) assert.deepEqual(ask('/robots.txt', host), { pass: true });
  });

  // The corpus is the same documents every host already serves as HTML, so
  // hiding it off production hid nothing and only made it untestable.
  test('serves the corpus on every host', () => {
    for (const path of [
      '/llms.txt',
      '/llms-full.txt',
      '/docs.md',
      '/docs/setup/macos.md',
      '/docs/sdk/Titanium.UI.Window.md',
      '/modules/ti.map.md',
    ]) {
      for (const host of HOSTS) {
        assert.deepEqual(ask(path, host), { pass: true }, `${path} on ${host}`);
        // A `.md` asked for with a Markdown `Accept` is still the `.md`, not
        // a rewrite to `/md/....md`.
        assert.deepEqual(ask(path, host, 'text/markdown'), { pass: true }, `${path} on ${host}`);
      }
    }
  });

  test('answers a page with its copy for a client that prefers Markdown, on any host', () => {
    for (const host of HOSTS) {
      assert.deepEqual(ask('/docs/setup/macos', host, 'text/markdown'), {
        rewrite: '/md/docs/setup/macos',
      });
      assert.deepEqual(ask('/docs', host, 'text/markdown'), { rewrite: '/md/docs' });
      assert.deepEqual(ask('/docs/sdk/13.4.1/Titanium.UI.Window', host, 'text/markdown'), {
        rewrite: '/md/docs/sdk/13.4.1/Titanium.UI.Window',
      });
      assert.deepEqual(ask('/modules/ti.map', host, 'text/markdown'), {
        rewrite: '/md/modules/ti.map',
      });
    }
  });

  test('answers HTML to a browser', () => {
    const browser = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    assert.deepEqual(ask('/docs/setup/macos', PRODUCTION, browser), { pass: true });
    assert.deepEqual(ask('/docs/setup/macos', PREVIEW, '*/*'), { pass: true });
  });

  test('leaves a page with no copy alone', () => {
    assert.deepEqual(ask('/blog', PRODUCTION, 'text/markdown'), { pass: true });
    assert.deepEqual(ask('/docs/sdk/13.4.1/release-notes', PRODUCTION, 'text/markdown'), {
      pass: true,
    });
  });
});

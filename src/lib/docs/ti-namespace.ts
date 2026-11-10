/**
 * The tiapp.xml namespace, which moved with the foundation's domain.
 *
 * `xmlns:ti` was `http://ti.tidev.io` from the move off Appcelerator until the
 * foundation lost that domain, and the SDK's apidoc still prints it in its
 * tiapp.xml examples. It is a namespace name rather than an address - nothing
 * fetches it - but it is copied into apps from these pages, so it should name a
 * domain the project still holds. The guides write the new one directly; this
 * covers the registry, which mirrors upstream verbatim.
 *
 * Text, not a link, and almost always inside a code fence, so it is rewritten
 * in the source - by `renderMarkdown` before rendering, and by `markdownFor`
 * for the `.md` copies, which print registry text raw - rather than in the
 * sanitizer's link pass.
 */
const OLD_TI_NAMESPACE = /http:\/\/ti\.tidev\.io(?![\w-]|\.\w)/g;
const TI_NAMESPACE = 'http://ti.titaniumsdk.com';

export function currentTiNamespace(text: string): string {
  return text.replace(OLD_TI_NAMESPACE, TI_NAMESPACE);
}

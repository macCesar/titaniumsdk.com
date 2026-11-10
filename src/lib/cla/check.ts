import signers from './signers.json' with { type: 'json' };

/**
 * Who has signed the TiDev Contributor License Agreement.
 *
 * `tidev/tidev-cla-action` asks this on every pull request across the org, by
 * way of `/contribute/cla/check/<username>`. It used to ask tidev.io, which
 * answered from a directory of signed records on that server's disk; the
 * domain was lost, and the check moved here.
 *
 * Only the GitHub usernames are in this repository, lowercased, one per signer.
 * That is everything the check needs, and it discloses nothing new: the
 * endpoint already answers for any name you give it, and
 * `tidev/organization-docs` publishes the original signers by name. The signed
 * PDFs and the records behind them carry names, titles and email addresses,
 * and they stay out of this public repository.
 *
 * A new signer is a line in `signers.json` and a deploy, until the signing
 * page is ported and needs somewhere to write.
 */
const SIGNED = new Set<string>(signers);

/**
 * Whether `username` has a CLA on file.
 *
 * GitHub logins are case-insensitive, and the action lowercases before asking,
 * but a caller that does not should get the same answer.
 */
export function hasSignedCLA(username: string): boolean {
  return SIGNED.has(username.trim().toLowerCase());
}

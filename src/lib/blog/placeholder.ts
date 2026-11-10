/**
 * Marks a gap in a generated draft post that a person has to fill.
 *
 * `scripts/new-release-post.ts` writes it into each release announcement's
 * draft. `validatePosts` refuses a post that is not a draft and still contains
 * it anywhere a reader would see: the title, the description, the author, the
 * body or the share text. Flipping `draft` alone cannot publish a half-written
 * announcement.
 */
export const PLACEHOLDER = 'TODO(release-post)';

import { hasSignedCLA } from '@/lib/cla/check';

/**
 * `GET /contribute/cla/check/<username>`: `{ "signed": true | false }`.
 *
 * The CLA status check every TiDev repository runs on its pull requests
 * (`tidev/tidev-cla-action`). The contract is the one tidev.io served at
 * `/api/cla/check/<username>`: always a 200, with the answer in the body. The
 * action treats any other status as an outage, not as "not signed", so an
 * unknown name is a 200 with `false` rather than a 404.
 *
 * Not under `/api`, which is where tidev.io had it: `next.config.ts` explains
 * why no route handler may live there in this repo. The action has to change
 * hosts anyway, so it changes path in the same edit.
 *
 * Rendered per request. The list only changes with a deploy, so there is
 * nothing to cache that a deploy would not invalidate, and an answer cached
 * from before somebody signed would fail their pull request for no reason.
 */
export async function GET(_req: Request, ctx: RouteContext<'/contribute/cla/check/[username]'>) {
  const { username } = await ctx.params;
  return Response.json(
    { signed: hasSignedCLA(username) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

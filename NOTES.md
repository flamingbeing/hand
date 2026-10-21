# Notes

Lasting rules, owner preferences and lessons (never task chatter), and how to test.

## Hosting
- Worker `hand` (Workers Builds: build command `node tools/stamp-versions.mjs`, deploy command `npx wrangler deploy`;
  runs on every merge to `main`). Routes in `wrangler.jsonc` (custom domain hand.anawj.com), paths in `worker/routes.js`.
- Check without a preview link: `npx wrangler@4 dev --local`, then curl `/babies/`, `/handlog/`, `/cmcj/` (it treats
  requests as the first `routes` host).
- Design kit: `https://design.anawj.com/v1/` (tokens.css, app.css, app.js), CORS-enabled by the kit's host; browser
  tests load it from the live address.

## Testing
- `node tools/check.mjs`, then the two e2e files (README). The editor test of the babies page moved to owner-tools.

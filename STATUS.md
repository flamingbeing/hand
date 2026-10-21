# Status

## Now
- Moved from anawj-site (21 Oct 2026). Waiting for hand.anawj.com to be pointed at this repo's Worker.

## Waiting on the owner
- Connect this repo to the Worker `hand` in Workers Builds (build command `node tools/stamp-versions.mjs`, deploy `npx wrangler deploy`) and move the hand.anawj.com custom domain to it.

## Next (in order)
1. After the cut-over: remove the hand host from anawj-site's routes (done in the same repo-split step).
2. Owner-tools step: bring back the page-editor test and the "Suggest an edit" link.

## Recently done
- Apps copied, design kit linked from design.anawj.com/v1/, Worker routes and tests, checks workflow.

## Decisions (dated, one line each)
- 2026-10-21: folder names unchanged (service-worker VERSION prefix); addresses unchanged.

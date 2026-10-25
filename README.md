# hand

Hand-surgery teaching apps for clinicians, served at hand.anawj.com by one Cloudflare Worker.

| Address | Folder | What |
|---|---|---|
| hand.anawj.com/babies/ | `hand-babies/` | Hand assessment page (3D figures, scenarios) |
| hand.anawj.com/handlog/ | `hand-log/` | Hand log (entries saved on the device) |
| hand.anawj.com/cmcj/ | `cmcj/` | CMC joint page |

Checks: `node .devkit/tools/check.mjs` (repo checks and Worker tests). Browser tests: `node hand-log/test/e2e.mjs` and
`node hand-babies/test/e2e.mjs` (the second needs `python3 -m http.server 8080` running). Local Worker check:
`npx wrangler@4 dev --local`, then `curl localhost:8787/babies/`.

Moved here from the anawj-site repo on 21 Oct 2026 (files only, no history; the old repo keeps it).

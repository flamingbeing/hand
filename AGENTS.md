# hand

Instructions for every AI assistant working here (Claude Code reads this through `CLAUDE.md`).
The hand-surgery teaching apps, served at hand.anawj.com: the hand assessment page (`hand-babies/`, at `/babies/`), the hand log (`hand-log/`, at `/handlog/`) and the CMC joint page (`cmcj/`, at `/cmcj/`). Static pages for clinicians; no sign-in, no database.

## Public here, private elsewhere

Anything merged here is public. Keep only code, docs, general rules and **made-up** sample data. Never commit
secrets, tokens, personal data, real names or patient details. Private notes belong in the owner's private notes
repo; never copy anything from there into this repo, a PR or an issue (neutral pointers like "ask the owner" are fine).

## Rules that bite

- One Worker (`worker/`) serves hand.anawj.com; `worker/routes.js` `SITES` maps each path to a folder, and the folder
  names stay as they are because each `sw.js` VERSION must start with its folder name.
- The NUHS design kit is not in this repo: pages load it from `https://design.anawj.com/v1/` (also listed in each
  `sw.js` SHELL). A kit change that breaks pages goes out as `/v2/`; pages move to it one at a time.
- The app kit theme (look, light/dark, accent) loads from `https://core.anawj.com/ui/1.0.0-rc.42/`; the version is
  pinned in each folder's `kit.js`, `index.html` and `sw.js` (`KIT_SHELL`), so change all three together.
- No hand bump of `sw.js` VERSION: the deploy build runs `node tools/stamp-versions.mjs`.
- The old `anawj.com/hand-*` addresses belong to the landing repo; Ask Claude (page edits) to owner-tools.

## Checks before merging

```
node .devkit/tools/check.mjs        # repo checks + Worker tests
node .devkit/tools/proofread.mjs    # page and doc mistakes
```

`.devkit/` (git-ignored) holds the kit's tools; CI copies it with `app-devkit/setup-tools@v1.6.0`. Locally:
`git clone --depth 1 --branch v1.6.0 https://github.com/flamingbeing/app-devkit /tmp/devkit && mkdir -p .devkit && cp -R /tmp/devkit/{tools,playwright,rules,worker} .devkit/`.

## Working with the owner

- Instructions mostly come from a phone. Work through a request to the end; ask only when a decision is genuinely
  the owner's. When asked to plan, plan and wait.
- Keep each PR small and finished on its own. Start PR titles with the app: "<App>: …".
- Merge your own PRs once the checks pass, then report with the PR link (merge by the number the PR creation
  returned). After opening a PR, call `unsubscribe_pr_activity` at once: each PR event re-sends the whole context.
- Push once per finished step, not after every small commit (limited build minutes).
- Each app keeps `NOTES.md` (lasting decisions, how to test) and `STATUS.md` (now, waiting on the owner, next,
  dated decisions). Read them before starting; update them when a task finishes. Cheap end of session: `quick-save`.
- Plain words, short; explain technical terms briefly the first time.

## Token savers

- One repo per session: `.claude/settings.json` is only read when a session has exactly one repo attached.
- `.claude/settings.json` denies reading `__/` and `vendor/` folders. Add generated files and very large files to its
  `deny` list (edit their build scripts instead), and say so here. Ask the owner if one is really needed.
- Run only the touched app's tests while iterating and the full run once before merge. Screenshots only for visual
  changes (one, viewport-sized); debug logic with text.

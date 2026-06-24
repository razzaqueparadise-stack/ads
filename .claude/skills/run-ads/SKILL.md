---
name: run-ads
description: "Run, validate, and drive the ads skill pack in this repo. Use when asked to run / start / launch / smoke-test / screenshot the ads project, validate the skills, check the skill pack builds, or exercise the competitor ad-spy (Ads Library / Meta Ad Library) data path. Covers /ads, /spy, /bulk-creative, /ads-score and the 23 other skills in .agents/skills/."
license: MIT
---

# Run the ads skill pack

This repo is **not a server or GUI app** — there is nothing to `npm start`. It
is a pack of **27 Claude Code skills** in `.agents/skills/` (the `/ads` audit
suite plus standalone `/spy`, `/bulk-creative`, `/competitive-ads-extractor`,
`/ads-score`) and the research output those skills produce in
`competitor-research/`. A skill is "run" when Claude Code loads its `SKILL.md`
and follows it; its data engine is the **Ads Library / Meta Ad Library MCP
tools**.

So "running" this project means two things, and this skill covers both:
1. **Validate the pack** — prove every skill is well-formed and its
   cross-references resolve. Reproducible on a clean machine, no credentials.
2. **Drive the live data path** — pull real competitor ads via the Ads Library
   MCP, the thing `/spy` and `/ads competitor` actually do.

All paths below are relative to the repo root (`<repo>/` = the directory holding
`.agents/` and `competitor-research/`). The driver lives at
`.claude/skills/run-ads/driver.mjs`.

## Prerequisites

- **Node.js ≥ 18** (tested on v22.22.2). No npm install — the driver is
  zero-dependency, pure ESM.
  ```bash
  node --version
  ```
- For the **live data path only**: the `mcp__Ads_Library__*` MCP server must be
  connected in the session (it is, in this environment). Optional
  `META_ACCESS_TOKEN` env var improves Meta Ad Library coverage; without it the
  MCP tools still work.

## Run (agent path) — validate the pack

This is the primary, always-safe entry point. It scans all 27 skills, checks
each has valid YAML frontmatter, that `name:` matches its directory, and that
standalone chained skills (`/spy`, `/bulk-creative`, …) resolve.

```bash
node .claude/skills/run-ads/driver.mjs
```

Expected tail on success (exit code 0):

```
PASS — all 27 skills have valid frontmatter and resolve.
```

If any skill is malformed it prints `FAIL — N structural problem(s):` with one
line per problem and exits **1**. Other modes:

```bash
node .claude/skills/run-ads/driver.mjs --list   # one line per slash command + argument-hint
node .claude/skills/run-ads/driver.mjs --json    # machine-readable {skills, problems, danglers}
```

`--json` exits 1 if there are any problems or dangling chain references, so it
doubles as a CI gate.

## Run (live data path) — drive the Ads Library MCP

The skills that do real work (`/spy`, `/ads competitor`,
`/competitive-ads-extractor`) are thin orchestration over the
`mcp__Ads_Library__search_meta_ads` tool. To exercise that path, call the tool
directly with a documented competitor from `competitor-research/` (Nour Estates
is the one flagged as actively spending):

```text
mcp__Ads_Library__search_meta_ads(
  brand_name="Nour Estates",
  active_status="active",
  max_ads=5,            # keep this small — see cost note
)
```

It returns an array of ads (copy, CTA, media URLs, start_date, platforms). To
then reproduce the `/spy` workflow by hand: compute `days_running = today −
start_date`, flag any ad ≥30 days as a WINNER, and diff `ad_id`s against the
cache at `competitor-research/.spy-cache/<page-slug>.json` (NEW / STILL RUNNING
/ DROPPED), then overwrite the cache. See `.agents/skills/spy/SKILL.md` for the
exact output format.

> **Cost note:** this tool charges credits (≈1 for the brand lookup + 1 per 10
> ads). Always pass a small `max_ads` when smoke-testing; omit it only when you
> genuinely want the full library. In a no-credentials / cost-sensitive run,
> skip this step — the validator above already proves the pack is intact.

## Gotchas

- **Skills live in `.agents/skills/`, not `.claude/skills/`.** This repo's
  content pack uses the `.agents/` convention (it's installed/locked via
  `skills-lock.json`). This `run-ads` skill itself lives in `.claude/skills/` so
  Claude Code auto-discovers it. The driver scans `.agents/skills/` on purpose.
- **`/ads google`, `/ads audit`, etc. are NOT separate skills** — they are
  sub-commands of the single `ads` skill. The driver only flags dangling
  references to the *standalone* skills (`spy`, `bulk-creative`,
  `competitive-ads-extractor`, `ads-score`); it deliberately does not treat
  `ads` sub-commands as missing skills.
- **Referenced helper scripts are not vendored here.** `/ads report`,
  `/ads dna`, and `/ads generate` reference `scripts/generate_report.py`,
  `scripts/capture_screenshot.py`, and `scripts/generate_image.py` at
  `~/.claude/skills/ads/scripts/`. Those ship with the upstream install, not
  this repo (`find . -name '*.py'` returns nothing). Don't expect to run them
  from a fresh clone.
- **No `META_ACCESS_TOKEN` is set in this environment.** The Ads Library MCP
  tools still return data without it, just potentially fewer fields.

## Troubleshooting

- `Error: ENOENT ... .agents/skills` → you're not at the repo root. `cd` to the
  directory that contains `.agents/` and re-run with the full driver path.
- Driver prints `FAIL` after editing a skill → it caught a real regression:
  most often `name:` no longer matches the directory, or the `---` frontmatter
  fence was removed. The failing line names the skill and the problem.
- `search_meta_ads` returns `Denied by user` / empty → the call was declined
  (cost) or the brand has no detectable active ads. Both are expected; the
  `competitor-research/` docs note that "no ads found" ≠ "not advertising."

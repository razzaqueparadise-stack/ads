---
name: spy
description: "Competitor ad spy. Pulls every active ad from any Facebook/Instagram page via the Meta Ad Library, diffs against the previous pull to surface only NEW creative, and returns a structured intelligence report — hooks, CTAs, offer types, creative angles, and how many days each ad has been running. Use when the user says spy, /spy, what ads is X running, competitor new creative, ad library pull, or wants a weekly competitor creative diff."
argument-hint: "<facebook page name or URL> [country code]"
license: MIT
---

# /spy — Competitor Ad Spy + Weekly Creative Diff

Pull every active ad a competitor is running, surface what's NEW since last time,
and explain what's working and why.

## Prerequisite

A Meta Ad Library API access token improves coverage. Set it once:

```
export META_ACCESS_TOKEN=your_token_here
```

If no token is set, fall back to the available Ad Library MCP tools
(`search_meta_ads`) — they work without user credentials but may return fewer fields.

## Inputs

- **Target**: a Facebook page name (e.g. `Nour Estates`) or page URL
  (`https://www.facebook.com/nour.estates/`). Accept 1 or more.
- **Country** (optional): 2-letter ISO code, default `ALL`.

If the user gives no target, ask for the competitor's page name/URL before running.

## Procedure

1. **Pull active ads.** Use the `search_meta_ads` tool (or the Meta Ad Library API
   with `$META_ACCESS_TOKEN`) with `active_status="active"`. Capture for each ad:
   ad_id, ad_text, type (image/video/carousel), CTA, link/offer, start_date,
   platforms, and is_active.
2. **Compute "days running"** = today − start_date for each ad. Flag any ad
   running **30+ days as a WINNER** (proven creative the competitor keeps paying for).
3. **Diff against last pull.** Read the cache file
   `competitor-research/.spy-cache/<page-slug>.json` if it exists. Mark each ad as:
   - 🆕 **NEW** — ad_id not present in the cached pull
   - ♻️ **STILL RUNNING** — present in both
   - ⏹️ **DROPPED** — in cache but no longer active
   Then overwrite the cache with the current pull (and a timestamp passed in by the
   caller, since the runtime has no clock).
4. **Classify each ad** by:
   - **Hook** — the opening line / the pattern interrupt (e.g. loss-aversion,
     curiosity, data/authority, debate, social proof)
   - **CTA** — comment-to-DM, WhatsApp, "Contact Us", "Learn More", lead form, etc.
   - **Offer type** — lead magnet, listing/product, discount, webinar, content/info
   - **Creative angle** — investment/ROI, lifestyle, fear/safety, scarcity, education

## Output format

```
# /spy — <Competitor> (<date>)

## What's new this week
- 🆕 <hook> — "<ad_text excerpt>" · CTA: <cta> · running <N>d

## Proven winners (30+ days)
- ♻️ <hook> — "<excerpt>" · <N> days · offer: <type>

## Still running / dropped
...

## Intelligence summary
- Hooks they're testing right now: ...
- Offer types in market: ...
- CTA patterns: ...
- What changed vs last pull: ...

## Recommended counter-moves
- ...
```

## Chaining

Run `/spy` first (Monday), then feed the winners into `/competitive-ads-extractor`
for a multi-competitor gap analysis, then `/bulk-creative` to attack the gaps, then
`/ads-score` before launch. `/spy` shares the competitor knowledge in the
`ads-competitor` sub-skill of the `ads` pack — load `ads-competitor/SKILL.md`
references for deeper platform-specific detail.

> Note: this wraps the same competitor-intelligence workflow as `/ads competitor`,
> packaged as a standalone `/spy` command with week-over-week diffing.

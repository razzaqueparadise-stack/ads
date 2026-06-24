---
name: bulk-creative
description: "Bulk ad-copy generator. From a product description + the project's CLAUDE.md brand context, generates 20 distinct ad copy variations in short / medium / long format across copy frameworks. Use when the user says bulk creative, /bulk-creative, generate ad variations, write me 20 ads, ad copy at scale, or needs many creative angles fast."
argument-hint: "<product/offer description> [platform: meta|google|tiktok]"
license: MIT
---

# /bulk-creative — 20 Ad Variations Fast

Turn a product/offer + brand context into 20 distinct, ready-to-test ad copy
variations. What a copywriter bills 4–8 hours for, in ~10 minutes.

## Get the most out of it (read first)

Output quality scales with context. Before generating, make sure the project
**CLAUDE.md** (or `~/.claude/CLAUDE.md`) contains:
- **Brand voice / tone** (e.g. trustworthy, premium, direct)
- **Target audience** (who's buying, their fears & desires)
- **Core offer & differentiators**
- **Proof points** (numbers, guarantees, testimonials)

If CLAUDE.md is missing these, ask the user for them OR offer to scaffold a
CLAUDE.md first. Do not generate generic copy from thin context — flag the gap.

## Inputs

- **Product/offer description** (required) — what's being advertised.
- **Platform** (optional) — `meta` (default), `google`, or `tiktok`; controls
  character limits and format.
- **Brand context** — pulled from CLAUDE.md automatically.

## Procedure

1. Load brand voice, audience, and offer from CLAUDE.md. Summarize them back in
   one line so the user can confirm before generation.
2. Generate **20 variations** distributed across copy frameworks (load
   `ads/references/copy-frameworks.md` if present): **AIDA, PAS, BAB, 4P, FAB,
   Star-Story-Solution**. Vary emotional intensity, specificity, awareness level,
   and point of view across them.
3. For each variation produce **three lengths**:
   - **Short** — hook only (Meta primary text ≤125 chars; headline ≤40)
   - **Medium** — hook + benefit + CTA
   - **Long** — full story/PAS body
4. Respect platform specs (load `ads/references/meta-creative-specs.md` etc.).
5. Tag each variation: `framework · emotional register · awareness match ·
   recommended placement (FEED/STORY/REEL/SEARCH)`.

## Output format

```
# /bulk-creative — <product> (20 variations)

Brand voice: <one-line confirm>  |  Audience: <one-line>

## 01 · PAS · fear → relief · FEED
**Short:** ...
**Medium:** ...
**Long:** ...

## 02 · AIDA · curiosity · REEL
...
(through 20)

## Suggested test plan
- Start with #s X, Y, Z (strongest hooks). A/B in pairs.
```

## Chaining

Feed gap angles from `/competitive-ads-extractor` into this skill, then run every
variation through `/ads-score` and keep only those scoring ≥7 on hook strength.
Mirrors the `ads-create` / `ads-generate` sub-skills of the `ads` pack; for AI
*image* generation use `/ads generate` (needs `GOOGLE_API_KEY`).

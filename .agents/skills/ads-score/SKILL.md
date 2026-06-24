---
name: ads-score
description: "Pre-launch ad scorer. Paste any ad (yours or a competitor's) and it scores across 6 dimensions on a 1–10 scale — hook strength, copy effectiveness, CTA clarity, emotional resonance, offer structure, visual-copy alignment — with a weighted total, the single weakest point, and a concrete rewrite. Use when the user says score this ad, /ads-score, rate my ad, is this ad good, grade this creative before launch."
argument-hint: "<paste ad copy, and optionally describe/attach the visual>"
license: MIT
---

# /ads-score — Score Any Ad Before You Spend

Diagnostic score for a single ad across 6 dimensions, so weak creative gets fixed
before money goes behind it.

## Inputs

- **Ad copy** (required) — paste the primary text / headline / CTA.
- **Visual** (optional) — an image/screenshot or a description of it. Without a
  visual, score dimension 6 (visual-copy alignment) as "N/A — copy only" and note it.
- **Context** (optional) — platform, audience, offer. Ask only if a score is
  genuinely ambiguous without it.

## The 6 dimensions (score each 1–10)

1. **Hook strength** — does the first line stop the scroll? Pattern interrupt,
   specificity, curiosity, or pain. *(Most important — weight 25%.)*
2. **Copy effectiveness** — clarity, flow, benefit-led, no jargon, right length. *(20%)*
3. **CTA clarity** — one obvious next action, low friction, action verb. *(15%)*
4. **Emotional resonance** — taps a real desire/fear; feels human not corporate. *(20%)*
5. **Offer structure** — is the value/offer clear and compelling? Risk reversal? *(15%)*
6. **Visual-copy alignment** — does the creative reinforce the message & hook? *(5%)*

**Weighted total** = Σ(score × weight) × 10 → a 0–100 score.

## Scoring discipline

- Be a tough critic, not a cheerleader. Default to 5–6 for "fine but generic."
- 9–10 is reserved for genuinely excellent, proven-pattern work.
- Always name the **single weakest dimension** and WHY it loses points.
- Give a **concrete rewrite** of the weakest element (usually the hook).

## Output format

```
# /ads-score — <ad name/excerpt>

| # | Dimension | Score | Note |
|---|-----------|-------|------|
| 1 | Hook strength        | x/10 | ... |
| 2 | Copy effectiveness   | x/10 | ... |
| 3 | CTA clarity          | x/10 | ... |
| 4 | Emotional resonance  | x/10 | ... |
| 5 | Offer structure      | x/10 | ... |
| 6 | Visual-copy align    | x/10 | ... |

**Weighted total: NN/100** — <one-line verdict>

## Weakest link: <dimension>
Why: ...
Rewrite: "<improved version>"

## Verdict
✅ Launch / ⚠️ Fix first / ❌ Rework
```

> Gate rule: if **hook strength < 7**, do not launch — rewrite the hook first.

## Chaining

Run on the top 5 outputs of `/bulk-creative` before launch, and on competitor
winners surfaced by `/spy` to reverse-engineer why they work.

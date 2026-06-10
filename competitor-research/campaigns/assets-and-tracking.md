# Assets, Landing Pages & Tracking — Draft

These are the supporting pieces the Google + Meta campaigns depend on. Build the lead magnets first — they're both conversion tools *and* ad hooks.

## 1. Lead magnets to build (priority order)

| Asset | Used by | Why |
|---|---|---|
| **Lombok Buyer's Checklist (PDF)** | Meta Campaign 1, Google lead form | The comment-"GUIDE" / DM mechanic; copies Nour's year-long winner with a sharper title-safety angle |
| **ROI / Rental-Yield Calculator** | Both, as a hook | Nour's proven lead tool ("Stop guessing. Start calculating."). Inputs: price, occupancy, nightly rate → monthly income, yearly ROI, payback period |
| **Interactive Listings Map** | Google Ad Group 3, site | Reclaims SeaScape's abandoned USP; filter villas/land by area & price |
| **Leasehold vs Freehold explainer** | Meta 2b, landing page | Owns the trust gap no competitor fills |

## 2. Landing pages (match the ad to the page)

- `/land-kuta-lombok` — Ad Group 1. Above-fold: live land listings, "verified titles" badge, WhatsApp button, price-from.
- `/villas-south-lombok` — Ad Group 2. Yield data, off-plan vs turnkey, tour booking.
- `/map` — Ad Group 3 + Meta. The interactive map.
- `/buyers-checklist` — lead-magnet delivery + email/WhatsApp capture.
- `/roi-calculator` — the calculator tool.

**Each LP needs:** a sticky WhatsApp/call button, one clear form, social proof (testimonials), and a "how the buying process works (legal/title)" section.

## 3. Tracking & measurement

**Conversions to define (Google Ads + GA4 + Meta Pixel/CAPI):**
- WhatsApp click · Phone call · Form submit · Checklist download · Calculator completion · Tour booking

**Setup checklist**
- [ ] GA4 on site + key events marked as conversions
- [ ] Google Ads conversion tracking (import GA4 events or gtag)
- [ ] Meta Pixel **+ Conversions API** (server-side — iOS/cookie loss makes CAPI essential; the installed `ads-server-side-tracking` skill covers this)
- [ ] WhatsApp click tracked as an event (wrap the link / use click trigger)
- [ ] Offline conversion import for deals that close via WhatsApp/phone (ties ad spend to real sales)

**UTM convention**
```
?utm_source={google|meta}&utm_medium={cpc|paid_social}
&utm_campaign={land_kuta|villas_invest|leadmagnet|retargeting}
&utm_content={adgroup_or_creative}&utm_term={keyword}
```

## 4. Measurement cadence
- **Daily (first 2 weeks):** spend pacing, obvious losers (0 conv / high cost).
- **Weekly:** cost per WhatsApp conversation, cost per lead-magnet, CTR by ad, search-term report (mine for new keywords + negatives).
- **Monthly:** cost per booked tour, tour→deal rate, and re-run the [competitor scan](../04-inactive-competitors.md) to catch Nour scaling or Discover/Maju entering paid.

## 5. What I can do next (with the ads skills, once the session restarts to load them)
- `ads-google` → expand this into a full keyword/bid plan with match types & negative lists
- `ads-meta` → build the full ad-set structure + audience definitions
- `ads-create` / `ads-generate` → produce the actual creative copy variants and visuals
- `ads-server-side-tracking` → stand up Pixel + Conversions API
- `ads-math` / `ads-budget` → model budget allocation against target CPA and expected deal value

# QA round 7 — F28 reporting caveat

This change adds transparent reporting; it changes no agent policy or engine balance. The business simulator already selects a legacy pledge after reaching Godfather when its existing eligibility check passes. Earlier reports that omitted paid pledges do not show that the bots ignored them, and cash accumulation alone does not establish that conclusion.

Both simulator reports now separate `legacyGiven` (`legacyFund.paid`, irrevocably given to the chosen recipients) from `productiveReinvestment` (`scale.invested`, the engine's recorded infrastructure, territory, route-capacity and factory investment). Neither is added to the other. The original `reinvestmentShare` remains unchanged and is not a combined score for all uses of cash.

Each row records `cashNetWorthRatio = cash / cashNetWorthDenominator`, with the denominator equal to reported `netWorth` in kroner. A nonpositive denominator produces `null`. Summary ratios are medians of defined per-run ratios, accompanied by the number of defined runs; they are not ratios of median balances. Values above one remain visible when liabilities reduce net worth.

A second, distinct measure is `cashImperialValueRatio = cash / cashImperialValueDenominator`. Its denominator is exactly `G.empireScore(s).value`, also reported as `imperialValue`: the engine's productive imperial valuation, rather than net worth or cash balance. Both simulators retain the net-worth ratio and separately report the imperial-value ratio, denominator, corresponding medians and defined-run counts. A nonpositive imperial value produces `null`, not zero or infinity. This matters when net worth is dominated by cash: a cash/net-worth ratio near one does not describe cash relative to productive imperial value.

The corresponding separate medians make these omissions inspectable. They do not retroactively repair old results or prove that any current policy gives enough, invests well, or is enjoyable. The parent reran the 30-seed-per-profile business and experience campaigns after the final reporting change. Their final summaries and source hashes are retained in the baselines below; a reporting repair is not a balance approval.

## Final observed checks

The parent reported 212 automated tests passing, with zero failures (`qa/reports/alpha09-tests.txt`). The completed reports contain 90 standalone balance campaigns (30 per profile), 90 meta campaigns (ten seeds across three profiles and three start conditions), 90 integrated story campaigns (30 per profile), nine coast campaigns (three per profile), and 100 exchange stress runs (25 per policy). The economic, meta and integrated campaigns all completed and reached Godfather without technical failures or stalls. All nine coast campaigns completed both optional coast stories; this is a small technical sample, not a broad balance estimate. The exchange run reported zero failures across its four policies.

The parent observed the interface at 390px and 1366px, including geography/story access and the nonblocking money/calendar feedback. This agent did not independently rerun those browser checks. The interface observations, automated state tests and heuristic campaigns cover different things; none measures whether real players find the game enjoyable.

## Final financial summaries

The profile order in each list is careful, expansion, aggressive. Amounts are median kroner, rounded here to one decimal million for readability; exact values remain in JSON. Ratios are medians of per-run ratios, not divisions of the displayed median amounts.

- Standalone balance: final cash 294.3m / 306.3m / 405.4m; productive investment 350.5m / 438.2m / 468.0m; legacy gifts 585.8m / 729.3m / 635.0m. Cash/imperial-value ratios are 63.1% / 51.5% / 74.8%. Cash/net-worth ratios are 100% for these final standalone states. Median Godfather arrival is day 1239 / 1190 / 1365.
- Integrated story: final cash 102.0m / 80.3m / 127.2m; productive investment 265.5m / 167.0m / 382.0m; legacy gifts 214.3m / 317.8m / 233.2m. Cash/imperial-value ratios are 27.3% / 28.4% / 25.7%; cash/net-worth ratios are 11.5% / 6.8% / 11.1%. All 90 states resolved three endgame acts and completed four contact stories. Median Godfather arrival is day 1309 / 1225 / 1386.
- Coast sample: nine of nine completed both coast arcs and reached Godfather, with no invalid states, errors, rejected injections or stalls. The three profile cash/imperial-value medians are 26.5% / 30.0% / 26.0%. Its full financial definitions and exact results are retained separately rather than pooled with the 90-run story report.

## Baseline provenance and open F28

`qa/baseline.json` retains its listed-order raw-byte concatenation hash and the SHA-256 of the current business simulation agent. Its engine list now includes `content/coast.js`, `coast.js` and `content/places.js`. `qa/experience-baseline.json` is the exact final 90-run experience report with `runs` omitted; `qa/coast-baseline.json` is the exact nine-run coast report with `runs` omitted. Both retain before/after source manifests, financial definitions, limitations and summaries. Their source manifests were checked against the current engine files before copying.

F28 remains open as an economic/design question. The standalone agents already give substantial legacy contributions, so their large remaining cash cannot be explained as “bots ignore pledges.” Their post-Godfather productive reinvestment shares remain about 19.2% / 17.8% / 14.7%, and standalone cash accumulation remains large even after gifts. The integrated policies hold assets through stock mandates and therefore have different net-worth composition and lower cash/imperial-value ratios. These are distinct policies and denominators, not interchangeable evidence. More meaningful human decisions and spending opportunities may still be needed; these technical passes do not establish a 5/5 experience, a balanced economy or a fun approval.

## F29–F32 and alpha 0.9 interface evidence

F29's recorded parent comparison used the same 30-seed jobs-only exercise: the reported median ending cash changed from 124,610 kr to 25,476 kr, while the trade control remained 220,439 kr. Risky jobs now carry a 28-day pressure mechanism. This is a focused regression comparison, not a population balance estimate or a claim that trade and risk-taking have equal value.

F30 adds four distinct dark-path items with different lasting effects, rather than one repeated reward. The two-screen onboarding introduces the player's name/ambition and Raggen's first concrete move. An existing raw save bypasses first-start onboarding; corrupt storage is preserved for recovery rather than silently replaced. The parent exercised onboarding and existing-save behavior in the browser at 390px and 1366px.

F31 removes remaining fiction disclaimers from the immersive action labels and keeps the explanatory notice in About. Place and story copy treats actual employers and industrial heritage respectfully; the new geography has 32 places in four regions, two optional eight-scene coast stories, and four original regional illustrations. The parent observed the regional filters, location choices and story access at both browser widths. This confirms the tested flows and layouts, not every possible branch or device.

F32 replaces the automatic calendar dialog with nonmodal feedback. The single money card shows actual cash change and elapsed dates, supplies incoming/outgoing totals only when the new ledger rows reconcile, excludes historical asset basis from new cash charges, and labels otherwise unexplained adjustments. Pause, hide, skip movement, reduced motion and the saved movement preference leave game time, RNG and balances unchanged. The parent observed the nonblocking money/calendar flow at 390px and 1366px; focused accounting tests cover stock proceeds, historical basis, missing ledger heads and reconciliation failures. These are implementation and technical checks, not a 5/5 experience claim.

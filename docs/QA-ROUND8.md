# QA round 8 — productive ownership, cash still open

Alpha 0.10 adds five city-specific companies, two lasting ownership paths and three expansion stages. Capital is paid and booked once; eight actual delivery weeks are required before income starts. Partnerships share authority, while whole-company ownership strengthens rival reactions. Counteroffers affect actual income, pressure and loyalty. Their payments are operating expenses, not productive assets. Existing income items now apply once to company income.

Ownership automation requires its own explicit mandate. Fresh and migrated saves default to manual ownership even when an old capacity plan was enabled. Mandates use the existing four-week capital-plan slot and protect operating reserves and debt. F34's missing PNG URL is fixed; nine character portraits and trade-oriented early hints are included.

## Verification

The parent confirmed **238 tests**, including **17 ownership tests**, plus completed runs: **90 standalone economic**, **90 integrated story**, **90 start/inheritance-mode**, **nine coastal** and **nine manual-ownership controls**. These campaign sets had no reported technical failures or stalls; all coastal runs finished both coast stories. The comparison helper's five self-checks passed.

At **390 and 1366 px**, the parent observed no JavaScript errors, failed requests or overflow on the exercised paths. Signing debited exactly **13.5M kr**; construction completed after nine elapsed weeks containing eight actual deliveries. A **472,500 kr** counteroffer payment left the productive asset book unchanged. Explicit mandates, migration opt-out, initial capacity activation and save reopening were exercised. This is bounded technical evidence, not a 5/5 or human-fun approval.

## F28/F35: real investment, partial economic improvement

Profile order is **careful / expansion / aggressive**; amounts below are median millions of kroner. Ratios are medians of per-run ratios, not ratios of median balances.

- **Standalone 30 seeds/profile:** ownership funding **403.4 / 374.6 / 523.4M**; completed stages **11 / 9 / 11**; productive investment after Godfather **769.4 / 750.5 / 980.4M**. Final cash is **307.2 / 339.4 / 458.9M**, with cash/imperial-value ratios **25.8 / 30.1 / 32.7%**. Only **2 / 12 / 4** runs per profile meet the suggested 20% ratio target.
- **Integrated 30 seeds/profile:** ownership funding **189.0 / 374.6 / 374.6M**; productive post-Godfather investment **287.4 / 441.8 / 538.2M**; final cash **125.2 / 130.5 / 172.0M**. Ratio medians are **19.5 / 14.2 / 17.3%**, with **25 / 30 / 23** runs at or below 20%.

F35's expansion result is now **441.8M**, versus the previously reported approximately 4.5M. Ownership funding is already included in productive investment; never add it twice. Raw standalone cash rose compared with round 7: the new assets also earn income. Larger valuations and lower ratios therefore do **not** prove cash accumulation solved. F28 and the retained economic warnings remain open.

## Exact paired comparison

The comparison uses **nine exact profile+seed pairs**, three per profile; the other 81 enabled runs are explicitly unmatched. All matching failures would remain included; these nine pairs passed consistency checks. Enabled agents publicly adopt ownership mandates after earned Godfather rank: partners for careful, control for expansion/aggressive. Controls leave ownership manual. This is a **declared policy-extension comparison**, not an engine-only ablation against historical alpha 0.9.

Median pairwise cash deltas are **+4.7 / −67.6 / +91.8M**. Paired ratio medians change from **64.8 / 51.4 / 72.9%** to **26.2 / 19.5 / 34.4%**. Cash can rise while productive assets rise faster. Control manual-trade calls after Godfather are zero; that counter means `tripBuy`/`streetSell`, not every strategy choice or browser click.

## F36 and S30

All **180** real-8,000-kr early measurements reached first rank within 60 public action calls. Unchanged pre-Godfather business policy medians are **15 / 13 / 13** actions; integrated medians **21 / 22 / 13**, maximum **45**. All 62 customs losses and 53 recovery-shift calls remain reported; a rare trajectory took 188 game days. The separately labelled jobs-only control reached first rank in **0/30** runs by day 90, median cash **27,743 kr**. No rank/payout buff was used. UI clicks remain unmeasured (`null`); discoverability still needs human testing.

Integrated owned-item medians are **4 / 4 / 4**. Recorded path medians are careful: two literal help rewards and two other-choice rewards; expansion: three dark/exploit and one other; aggressive: four dark/exploit. Unknown/ambiguous medians are zero here. Imported ownership without matching history stays unknown rather than receiving invented attribution.

## Provenance and reproduction

Baseline text is LF. `qa/baseline.json` identifies the 23 listed engine files by raw-byte concatenation SHA-256 and separately hashes the simulation agent. This is a frozen-source capture after parent-confirmed run completion. Standalone reports lack automatic before/after execution snapshots; the comparison correctly keeps `sameRecordedEngine: null`. Report-file digests identify inputs, not engine execution.

Experience/coast baselines are exact final reports minus `runs`, with matching before/after manifests verified against current bytes. The early baseline omits only `rows`/`jobs`; the comparison baseline replaces heavy `pairs` with a compact `matchedPairKeys` list. Methods, limitations, policy metadata, provenance and summaries remain. Full reports are generated under ignored `qa/reports/`.

```sh
npm test
node qa/simulate.cjs --seeds 30
node qa/simulate.cjs --seeds 3 --no-ownership --output balance-manual-ownership.json
node qa/experience-sim.cjs --seeds 30
node qa/early-progress.cjs --seeds 30
node qa/ownership-compare.cjs --self-test
node qa/ownership-compare.cjs
```

Next QA should assess whether ownership dilemmas stay consequential over several years and whether new players discover trade before repeating jobs. Technical passes alone do not establish fun.

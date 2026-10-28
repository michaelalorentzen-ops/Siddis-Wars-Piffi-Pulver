# QA round 1 â€” triage

Review of initial commit a783e28; calendar changes came afterward.

- F01/F02: Confirmed design gaps. Godfather in roughly 1.5 years and long periods without meaningful decisions do not meet the intended 2026â€“2036 campaign. Still open. Raising a cash threshold alone is not a fix. Next design work must add competing expansion goals, recurring strategic conflicts and a measurable late-game decision cadence without restoring manual selling.
- F03: Open. Risk profiles need different rewards and consequences; current similar outcomes are insufficient evidence of balanced play styles.
- F04: Hypothesis, not confirmed cause. Quarterly timing alone does not establish which income stream drives promotion. Needs an income-source breakdown or controlled simulation before tuning rewards.
- F05: Fixed zero-cost signs and added an always-visible forecast of fixed obligations for the selected advance period. This is deliberately not advertised as guaranteed net profit: trade, incidents and one-off costs are additional.
- F06: Added 44px minimum targets for navigation, action buttons, dialog close buttons and form controls. Browser measurements at 390×844 confirm 44px navigation/action/icon heights, no horizontal page overflow and a working period selector. Full visual regression remains separate.
- F07: Legacy saves without a seed derive a stable seed from saved gameplay fields. New games retain their fresh seed and saved explicit seeds are preserved. Regression tested with different wall-clock times.

The automated checks do not certify balance or a finished game. The original review also left browser trade flows, export/import and comparison with Lopegutten untested.

Validation: 22 engine tests pass; strategy checks pass; 90 campaign simulations complete with no technical failures or stalls. Balance results remain unchanged, including the early Godfather warning.

# Siddis Wars — Piffi & Pulver

Arbeidsnavn i spillet: **Vestkyst**. En Stavanger-basert, nettleserlokal strategispill-alfa fra 2026 til 2036.

**Status: alfa 0.3. Dette er et review-grunnlag, ikke et ferdig eller balansert spill.**

## Kjør lokalt

Node.js 20 eller nyere. Ingen installasjon eller tredjepartsavhengigheter er nødvendig.

```sh
npm start
```

Åpne `http://127.0.0.1:4177/`. Spillet ligger i `dist/`; det kan også åpnes som statiske filer. Lagring skjer i nettleseren. Bruk eksport/import for å flytte en runde.

## Kjør QA

```sh
npm test
npm run qa:strategy
npm run qa:balance
npm run qa:fixtures
```

`qa/reports/balance.json` inneholder alle seedede spillforløp, profiler, progresjonsdager, økonomi, tap og varsler. Rapporten er generert lokalt og er ignorert i Git; CI laster den opp som et artifact. Kjør `node qa/simulate.cjs --seeds 5` for en rask prøve eller `--seeds 100` for bredere dekning.

**Grønne tekniske tester betyr ikke at spillet er morsomt eller godt balansert.** Simuleringen bruker tre enkle heuristiske agenter, ikke mennesker eller en fullverdig optimal spiller. Les [QA-oppdraget](docs/QA.md) og [mekanikkgjennomgangen](docs/MECHANICS.md).

## Grunnloopen

- Start med 8 000 kr og ingen ansatte. Velg en utenlandsk tur/retur med faktisk tid og reisekostnad.
- Kjøp et parti fra landets vareutvalg. Tollrisiko følger lastverdi, søkelys og gjentatt eksponering. Ingen garantert gratislast hver måned.
- Varene må hjem før de kan selges. Salg i Stavanger er en egen handling, med synlig pris, etterspørsel, metning og kalenderbruk.
- Rang følger netto kontantformue, med gjeld trukket fra. Ved Pusher-rang og en driftsleder kan vareflyten delegeres.
- Salgsapparatet selger hele beholdningen ved ukesoppgjøret. Ingen fast månedlig kronegrense; provisjon og prispress er synlige. Produksjon fyller lageret med varer, ikke kontanter.
- Senere spiller du på byer, allianser, innflytelse, folk og simulerte rivaler. Det finnes ingen ekte PvP-server.

## Viktige begrensninger

Første simulering viste at spilleragentene kunne bli Gudfar etter omtrent halvannet år. Økonomisk vekst og sen progresjon er derfor kjente QA-temaer. Det er heller ikke bevist at de sene valgene fyller hele perioden på en god måte.

Koden har foreløpig flere påbygg rundt en eldre motor. Det gjør den lett å kjøre uten verktøykjede, men en ryddigere domenemodell bør vurderes før mer innhold legges til. Tilfeldighetsgenerator, innholdsdata og motor bør etter hvert skilles tydeligere.

## Filer

- `dist/engine.js`: eldre grunnmotor.
- `dist/strategy.js`: byer, lag, simulerte rivaler, avtaler og ukedrift.
- `dist/commerce.js`: innkjøp, dagkalender, lager, salg, rang, lån og delegering.
- `dist/game.js`, `dist/market-ui.js`, `dist/game.css`: spillflate og dialoger.
- `qa/`: tekniske tester, simuleringsagenter, statisk server og syntetiske visuelle fixtures.

Ingen Sites-identitet, publiseringstilgang, hemmeligheter eller personlig spillagring skal inn i dette repoet. Havneillustrasjonen er laget for prosjektet; originalspillets kode og bilder er ikke distribuert her. Inspirasjonskilden er [Løpegutten](https://lopegutten.com/).

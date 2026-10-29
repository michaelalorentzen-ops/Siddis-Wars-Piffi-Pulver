# Siddis Wars — Piffi & Pulver

Arbeidsnavn i spillet: **Vestkyst**. En Stavanger-basert, nettleserlokal strategispill-alfa fra 2026 til 2036.

**Status: alfa 0.10. Dette er et review-grunnlag, ikke et ferdig eller balansert spill.**

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
npm run qa:early
npm run qa:balance
npm run qa:experience
npm run qa:coast
npm run qa:fixtures
```

`npm run qa:early` måler handlinger og dager til første rang fra vanlig startkapital i både forretnings- og historiepolicy, med tap og mislykkede forsøk beholdt. Det måler ikke menneskelige nettleserklikk. `qa:meta` og `qa:exchange` dekker henholdsvis arvemoduser og separat markedsstress.

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

Tidligere alfaer nådde Gudfar etter halvannet–to år og bygget store ubrukte formuer. I alfa 0.5 når de tre agentprofilene Gudfar rundt dag 1 239–1 323 i median, og reinvesterer 71–90 % av positivt driftsoverskudd etterpå. Dette er utforskende resultater fra endrede agentpolicyer, ikke godkjent balanse. Se docs/ENDGAME.md og docs/SCALING.md for modell, arvemodus, kalenderoverganger og begrensninger.

Nye systemer registrerer handlinger, migrering, validering og hendelser gjennom `bus.js`; fortellingsdata ligger separat i `content/`. Eldre handel og imperiedrift bruker fortsatt kompatibilitetslag. Dette er en gradvis opprydding, ikke en påstand om at hele motoren er skrevet om.

## Filer

- `dist/engine.js`: eldre grunnmotor.
- `dist/strategy.js`: byer, lag, simulerte rivaler, avtaler og ukedrift.
- `dist/commerce.js`: innkjøp, dagkalender, lager, salg, rang, lån og delegering.
- `dist/exchange.js` og `dist/exchange-ui.js`: Siddisbørsen med portefølje, utbytte, kursrisiko og regnskap.
- `dist/scaling.js`: reinvestering, kapasitet, regionale ringer, rivalvekst og separat arvemodus.
- `dist/scaling-ui.js` og `dist/time-ui.js`: Imperiet og kalenderoverganger.
- `dist/endgame.js`: maktråd, byprosjekter, styringsformer, institusjoner og nye rangkrav.
- `dist/endgame-ui.js`: Maktrådet og synlig prosjektfremdrift.
- `dist/calendar.js`: lokale høytidsperioder, markedseffekter og reisevarsler.
- `dist/game.js`, `dist/market-ui.js`, `dist/game.css`: spillflate og dialoger.
- `dist/content/ownership.js`, `dist/ownership.js`, `dist/ownership-ui.js` og `dist/ownership.css`: Eierbordet, oppkjøp, fullmakter og rivalenes mottilbud.
- `dist/portraits.js`: egne vektorportretter av kontaktene.
- `qa/`: tekniske tester, simuleringsagenter, statisk server og syntetiske visuelle fixtures.

Ingen Sites-identitet, publiseringstilgang, hemmeligheter eller personlig spillagring skal inn i dette repoet. Havneillustrasjonen er laget for prosjektet; originalspillets kode og bilder er ikke distribuert her. Inspirasjonskilden er [Løpegutten](https://lopegutten.com/).


Alfa 0.6 legger til en valgfri fiktiv Oslo-børs. Se docs/EXCHANGE.md. `npm run qa:exchange` er isolert, syntetisk markedsstress; de vanlige kampanjeagentene bruker ikke børsen.


Alfa 0.7 prioriterer spillopplevelsen: fire oppdragslinjer, ni kontakter, opptjente gjenstander med faktiske effekter, ni risikojobber, 14 steder og en rival-/etterforskningshistorie i tre akter. Se [EXPERIENCE.md](docs/EXPERIENCE.md). Kjør `npm run qa:experience` for ni ordinære kampanjer som også bruker disse handlingene.


Alfa 0.8 knytter flere valg sammen: Nora leder Siddisbørsen, fem byhendelser påvirker både historie og marked, og langsiktig eierskap kan gi forhandlingsrom i sluttakten. Fire historier har nå elleve steg og alternative avslutningsbelønninger, med bevarte gamle lagringer. Se [COHESION.md](docs/COHESION.md) for omfang, QA og åpne spørsmål.

Regional ekspansjon kan organiseres med lokale medeiere, ansatt regionledelse eller tett personlig kontroll. Regionene gir ulike praktiske fordeler. Som Gudfar kan du frivillig gi et stående løfte til laget, byen eller uavhengige avtaler; innbetalinger og virkninger er synlige. Ingen av disse løftene aktiveres automatisk for en menneskelig spiller.


Alfa 0.9 utvider byen til 32 steder i fire regioner, med to sammenhengende kyst- og byhistorier, fire nye illustrasjoner og kildebelagt lokalhistorie. Valgene påvirker tid, penger, tillit og laget. Kysthistoriene kan delegeres etter at vanlig delegering er opptjent, med siste avgjørelse beholdt hos spilleren. Nye spillere får en kort oppstart med navn, ambisjon og et første møte med Raggen. Eksisterende lagringer går rett til spillet. Oppgjør vises med faktisk kontantendring og forløpt tid uten å stanse handlingen.

Alfa 0.10 legger til **Eierbordet**: fem selskaper med tre utbyggingstrinn hver, lokale medeiere eller heleid kontroll, og rivaler som svarer på veksten. Kapitalen bindes ved signering; nye inntekter krever åtte vellykkede driftsuker med leveranser og et lojalt lag. Eierfullmakt er et eget, uttrykkelig valg og starter manuelt også i eldre lagringer med automatisk kapitalplan. Kontaktportretter og tydelige bymapper gir menneskene og avtalene mer plass. Se [OWNERSHIP.md](docs/OWNERSHIP.md) for faktiske vilkår, reserve, tilbakebetaling, mottilbud, migrering og åpne balansefunn. Tidlig progresjon og item-veier måles bedre; nye rapporter er ikke i seg selv en godkjenning av tempo eller spillglede.

## Publisering

Vercel-prosjektet `siddiswars` bruker dette repoets `main`. `vercel.json` publiserer kun `dist/` som statiske filer uten installasjon eller bygg. Lagringer er fortsatt lokale og følger nettleserens domene: eksporter på den gamle adressen og importer på den nye for å fortsette en eksisterende runde.

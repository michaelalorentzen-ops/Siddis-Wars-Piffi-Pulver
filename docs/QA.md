# Uavhengig QA-oppdrag

Målet er å finne feil og dårlige valg i spillet, ikke å produsere en grønn rapport. Ikke endre spillkode, balansetall eller tester for å få dem til å bestå uten et separat, begrunnet endringsforslag.

## 1. Teknisk kontroll

Kjør `npm test`, `npm run qa:strategy` og `npm run qa:balance`. Rapportér nøyaktig commit, kommando, seed, profil, dag, forventet og faktisk resultat. Lagre minimal reproduksjon når det er mulig.

Kontroller særlig:

- Bevaring av penger, gjeld, lager, kostgrunnlag og kalender.
- Kjøp og salg kan ikke skje fra ingenting, og samme dagens tilbud kan ikke rerolles.
- Kjøp gir varer; produksjon gir varer; penger kommer først ved salg eller eksplisitte avtaler.
- Toll, tap, provisjon, reise, lager og gjentatte sendinger er bokført og synlige.
- Automatisering er låst til riktig milepæl, og selger hele den tilførte beholdningen uten et fast månedlig kontanttak.
- Import av ugyldig lagring må avvises, og gamle gyldige lagringer må ikke miste eiendeler.
- Kamper koster reelle medlemmer og trente folk, påvirker lojalitet/slitasje og håndhever pauser og allianser.
- Hendelser midt i reiser og ukeskifter kan ikke gjøre at varer leveres tidlig eller at tiden går to ganger.

## 2. Balanse og progresjon

Simuleringen starter hver runde med normal startkapital og bruker offentlige motorhandlinger. Den injiserer ikke penger, rang, mannskap eller lager. `qa/fixtures.cjs` gjør derimot nettopp det for isolert UI-kontroll; **fixtures er ikke bevis på balanse**.

Mål tid til første salg, Pusher/delegering, Gudfar, byer og siste meningsfulle kapittel. Vurder spredningen mellom seeds, ikke bare medianen. Se etter dominerende handler, gratis risiko, kunstige tak, ubrukelige alternativer, gjeldsspiraler og lange perioder uten nye beslutninger.

Terskelen som varsler Gudfar før to år er et foreløpig varselsignal, ikke en vedtatt spillregel. Ikke løs problemet automatisk ved bare å heve et pengebeløp. Undersøk hvilke oppgaver som fortsatt finnes etter rangen, og om innholdet faktisk varer mot 2036.

Menneskelig spilling trengs for humor, forståelighet, vanskelighetsgrad og om valgene oppleves viktige. Tre heuristiske profiler er ikke full strategidekning.

## 3. Visuell og funksjonell nettlesertest

Kjør `npm start`, og test den lokale utgaven. Kjør `npm run qa:fixtures` og importer de navngitte JSON-filene gjennom **Lagring og innstillinger → Importer lagring**. Bruk en egen testprofil i nettleseren; ikke overskriv en ekte lagring.

Test desktop 1366×900 og mobil 390×844, tastaturfokus og tekstlesbarhet. Ta bilder av hjemskjerm, utenlandsk innkjøp, hjemmemarked, ruteplanlegger, salgsapparat med stor beholdning, byvalg og kampresultat. Se etter horisontal sideflyt, avkuttede dialoger, overlapp, feil låsetekst, foreldede tall og ulik kostnad mellom forhåndsvisning og faktisk oppgjør.

Fullfør uten fixtures: ny runde → utenlandsk varekjøp → hjemkomst → eget salg → eksport → omlasting/import. Kontroller også at tidlig spiller ikke får gratis automatisering.

## 4. Sammenligning med Løpegutten

Bruk https://lopegutten.com/ som referanse og `docs/MECHANICS.md` som foreløpig kart. Skill mellom observert oppførsel, lest offentlig klientkode og egne hypoteser. Ikke kopier originalens kildekode eller eiendeler inn i repoet.

Bevar kjernen i tidlig varehandel, kapitalbinding, kalender, risiko og gradvise opplåsinger. Forbedringene skal særlig ligge i forståelig regnskap, skalering, delegering og endgame. «Lik originalen» betyr ikke at kjente svakheter skal beholdes.

## Format på PR-funn

`[P0/P1/P2/P3] Kort tittel` etterfulgt av trigger, reproduksjon, forventet oppførsel, faktisk oppførsel og bevis. P0: ødelagt spill/lagring; P1: alvorlig økonomi-/progresjonsfeil; P2: tydelig funksjons-/UX-feil; P3: mindre avvik.

Oppgi eksplisitt hva som ikke ble testet. Ikke beskriv en utestet antakelse som en feil eller en grønn sjekk som en komplett kvalitetsgodkjenning.

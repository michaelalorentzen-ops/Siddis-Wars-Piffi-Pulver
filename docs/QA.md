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


## Ny runde: alfa 0.4 / Maktrådet

Les ENDGAME.md og QA-REVIEW-1.md før vurdering. Etterprøv forskjellen mellom pengemengde og meningsfulle avgjørelser. Rapporter gjentakelse i de fire maktrådsscenarioene; 50+ valg betyr ikke automatisk at alle er gode.

- Prøv begge lokale veier i hver by, også uten forutsetninger, og bekreft faktisk fremdrift eller feil ved fristen.
- Kontroller at egen kontroll har en fordel som forsvarer tap av folk, søkelys og dårligere samarbeidsvilkår.
- Prøv å overse/utsette råd, bytte styringsform, avbryte prosjekt, importere gammel Gudfar-lagring og spille videre til 2036.
- Sammenlign full produksjon med markedstilpasset drift. Alt skal selges automatisk, men overskudd kan selges med tap; ingen skjult pengegrense.
- Kontroller om beredskap faktisk fjerner unødvendige ukeklikk og om prisen er rimelig. Den er variabel og inngår ikke i prognosen for faste utgifter.
- QA-agentene er endret til å bruke de nye handlingene og omfordele ruter; gamle og nye simuleringer er derfor ikke en kontrollert årsakstest.
- `medianAdvanceShareAfterGodfather` teller også rest/week/waitDay/shift som tidshandlinger. Nye gameplayhandlinger rapporteres separat. Godfather-grupper og hele kampanjer må ikke blandes.
- Inntektsfordelingen i rapporten er BRUTTO, ikke overskudd etter varekjøp og produksjon. Bruk regnskapet til nettoanalyse.

Sju syntetiske lagringer inkluderer nå et maktråd og et pågående prosjekt. De er UI-fixtures, ikke dokumentasjon på opptjent progresjon.


## Ny runde: alfa 0.5 / reinvestering

Kjør også `npm run qa:meta`. Les SCALING.md. Ti syntetiske UI-lagringer inkluderer et regionalt nettverk, en sterkere rival-koalisjon og en separat arverunde.

- Mål produktiv reinvestering / positivt driftsoverskudd etter Gudfar. Kontantreserver fra før Gudfar kan gjøre enkelte andeler større enn 100 %; ikke skjul dette med klamping.
- Kontroller 18 avgrensede aktive områdemål. Ikke rapporter en prosent av uendelige nivåer. At ingen av våre seeds tar alt er ikke et bevis om en optimal spiller.
- Test dyrere nivåer, marginalt avtagende kapasitet og økende grunnleggende tilbakebetalingstid. Egen handel kan gi annen tilbakebetaling enn rammeavtalen alene.
- Test fullt lager, underleverandører, ruteoppgradering, kontrollspenn, avvikling, ny ring og delegerte kapitalreserver. Ingen varer skal forsvinne og alt skal fortsatt kunne selges.
- Test gjentatte maktkamper mot samme rival. Sammenlign styrke, mobiliseringskostnad, nødvendige leveranser, faktiske crew-tap og avtagende fordel. Kampanjeutgifter skal ikke øke bokført eiendelsverdi.
- Standardrunder starter uten arvebonus. Arverunder må være tydelig merket og ikke blandes med en standardrekord. Meta-rapporten er et lite, separat utvalg.
- Kontroller korte kalenderoverganger: avreise, hjemkomst, delvis reise ved et valg, gatesalg, hvile, hopp over, av/på og redusert bevegelse. Animasjonen må vise faktisk dagendring, ikke ønsket periodestørrelse.
- Flere rådsvarianter er fortsatt ikke bevis på bedre beslutningskvalitet. Undersøk om nye kapitalplaner gir reelle alternativer eller bare en dominerende automatikk.


## Ny runde: alfa 0.6 / Oslo Fantasibørs

Les EXCHANGE.md. Kjør `npm run qa:exchange` i tillegg til øvrige sjekker. Elleve syntetiske fixtures inkluderer en portefølje. De ordinære kampanjeagentene handler ikke aksjer og er ikke børsbalansebevis.

- Kontroller ordre, faktisk dagendring, spread, markedspåvirkning, kurtasje og samlet ukeslikviditet. Ugyldige og ufinansierte ordrer må ikke endre beholdning, kontanter eller dager.
- Kontroller vektet kostgrunnlag, delvis salg og skillet mellom salgsproveny og realisert resultat.
- Kontroller registreringsdato, kvartalsutbytte og ex-utbyttekurs. Et raskt kjøp–salg på uendret kurs skal gi tap.
- Kontroller at spareplanen bevarer driftsreserve og gjeldsdekning, ikke tar ut bankmidler og ikke legger til skjulte kalenderdager.
- Kontroller seed-replay, porteføljeimport og avvisning av ugyldige historieserier/handler. Gamle lagringer skal få tom portefølje uten eiendelstap.
- Vurder risiko og avkastning uavhengig. Et syntetisk tap er ikke en teknisk feil, og en lønnsom kurv er ikke garanti om fremtidig gevinst.
- Kontroller store porteføljer i kombinasjon med operative kapitalplaner og Gudfar-progresjon. Kursverdi inngår i netto formue, ikke direkte i produktiv sluttscore.

F11–F13 fra runde 3 står fortsatt til videre vurdering. Denne runden implementerer brukerens børsønske; den hevder ikke å ha løst infrastrukturnivåenes tilbakebetalingstid eller bevist optimal områdefordeling.


## Ny runde: alfa 0.7 / opplevelse

Les EXPERIENCE.md. `npm run qa:experience` kjører 3 seeds × 3 profiler fra ordinære 8 000 kr. For bredere dekning: `node qa/experience-sim.cjs --seeds 30 --output experience-full.json`. Full rapport inkluderer motorhash før/etter, slik at en kjøring under redigering ikke forveksles med en frossen build.

- Følg én historie fra første valg til siste følge. Sjekk at meningsfullt ulike valg er forståelige uten å røpe resultatteksten på forhånd.
- Test dialog, faktisk tid, lager, regnskap, gjenstandseffekt og etterfølgende scene sammen. Sjekk gjentatt klikk, utilgjengelige valg og siste dager av 2036.
- Kontroller at gammel rå lagring valideres før migrering, og at delvis ødelagt ny historietilstand avvises.
- Følg alle tre akter: valgets kostnad, folk som forlater laget, kvartalsforpliktelser, neste akt og epilog. Bekreft at fred har reelle følger og at ikke alt løses med penger.
- Spilltest på 390 og 1366 piksler: tre neste trekk, kontakt, oppdrag, steder, jobb, risiko, scene, avanserte visninger og redusert bevegelse.
- Rapporter om valgene er interessante, dominerende, gjentakende eller uforståelige. Antall oppdrag, meldinger eller klikk er ikke en moromåling.

F11 er avgrenset med ærlig prognose og tryggere automatikk, F12 er fortsatt åpent og nå synlig i rapportene. F13 har bredere parvis dekning. Ikke meld alle tre som fullstendig løst.


## Alfa 0.8 / QA runde 5-oppfølging

Les COHESION.md. Bruk full motorrekkefølge fra qa/load.cjs. Kontroller særlig:

- F21/F22: ett samlet Om-forbehold, replikkene i oppdrag og sluttakt, Nora, faktiske eierfullmakter og sammenheng med byhendelser. Ikke forvent at en modellert festivaluke er en offisiell fremtidig dato.
- F23/F26/F27: avsluttet spill, meldingsarkiv, personlig epilog, ingen nye resultatmodaler, faktiske rangkrav og 44px faner på 390px.
- F24: v1 aktiv/fullført lagring, historikk, allerede eide gjenstander og nye sluttvalg. Fullføring av fire historier er ikke automatisk en feil.
- F25: forsøk å kjøpe ekstrem kommando i sen kampanje, både manuelt og gjennom en feilaktig kapitalplan. Kontroller at en serie nivåer faktisk øker kontrollspennet, og at ingen ukes-hook kan telle prosjektleveranser to ganger.
- Regionvalg: sammenlign faktisk geografi, profit-sharing, lønn, produksjon, frakt og treningskostnad. Et tilbud og et oppgjør skal bruke samme beregning.
- Stående løfte: initialgave, kvartalsandel, pause/gjenopptakelse, to byers leveranser, kontrollplass, gjeld og driftsreserve. Gaver skal ikke bli bokført som private eiendeler.
- Mål private kontanter, produktiv imperieverdi, børsbeholdning og midler gitt videre separat. Vurder om avveiningene er interessante; ikke skjul økonomiske svakheter med en ny sammenblandet score.

De integrerte kampanjene rapporterer Gudfar separat fra at sluttakten åpner ved sen dato. Minst 80 prosent av hver profil må nå Gudfar i denne QA-policyen; en teknisk gyldig runde som bare får datoutløst sluttakt er ikke nok. Dette fanget og stopper regresjon i Noras ekspansjonsreserve.

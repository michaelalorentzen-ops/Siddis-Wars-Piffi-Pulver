# Oslo Fantasibørs — alfa 0.6

Oppdatert i alfa 0.8: se [COHESION.md](COHESION.md) for nye kostnadskurver, regionmodeller, varige løfter, Siddisbørsen og historieprogresjon. Tallene under beskriver den tidligere alfaen der det er angitt.
En valgfri, oppdiktet børs ved siden av den operative virksomheten. Åtte selskaper dekker olje, shipping, sjømat, eiendom, industri, teknologi, hydrogen og finans. Ingen av kursene er markedsdata. Børsen åpner som Bakmann.

## Handel og risiko

Manuell handel bruker én faktisk spilldag. Kurser oppdateres ved ukesoppgjør, med en egen lagret seed som ikke bruker eller flytter den operative spillmotorens tilfeldighetssekvens. En bred markedsfaktor, selskapets volatilitet og fiktive sektorhendelser påvirker prisene. Kurslisten kan ikke rerolles ved å åpnes på nytt.

Kjøp og salg har 0,4 % spread per side, ekstra markedspåvirkning etter ordrestørrelse og 0,15 % kurtasje, minst 250 kr. Pris og hele kontantbeløpet vises før ordren. En rask rundtur ved uendret kurs gir tap. Samlet kjøps- og salgsvolum er begrenset til 250 000 aksjer per selskap og uke. Et selskap har høyst ti millioner aksjer i denne modellen. Det finnes ikke shorting, derivater, ordrebelåning, sanntidskurser eller handel mot andre spillere.

## Beholdning og regnskap

Porteføljen viser antall aksjer, kostpris inklusive kjøpskurtasje, markedsverdi, urealisert resultat og sektorvekt. Ved delvis salg fordeles kostgrunnlaget på aksjene som selges. Kontantinnbetaling og realisert fortjeneste er ulike felt i regnskapet. Både kjøp, salg og utbytte bokføres.

Markedsverdien teller med i netto formue etter gjeld. Den legges ikke direkte til imperiets produktive sluttscore: å gjøre kontanter om til aksjer på siste dag skal ikke skape ekstra imperieverdi. Inntekter fra utbytte kan naturligvis investeres videre i det operative nettverket.

## Utbytte og spareplan

Utbyttesatsene er oppdiktede spillprofiler. Hver 13. uke får kvalifiserte aksjer utbytte; de må ha vært eid ved forrige ukesregistrering. Utbytte trekkes fra aksjekursen ved oppgjøret. Det finnes dermed ingen gratis ex-utbyttegevinst ved å kjøpe like før utbetaling.

En valgfri meglerplan kjøper en utbyttekurv eller alle åtte sektorer hver fjerde uke. Den bruker 10 % av kontanter utover den operative kapitalreserven og setter i tillegg av hele utestående gjeld. Den tar ikke ut bankmidler eller skaffer ny kreditt. Spareplanen har samme spread, kurtasje og likviditetsgrenser, men bruker ingen ekstra kalenderdager. Den er avslått i nye runder.

## UI og lagring

Børsfanen har indeks, kursliste, selskapsvalg, kurshistorikk for 13/26/52 uker, ordreforhåndsvisning, portefølje, børsmeldinger og siste handler. Alle selskaper, satser og meldinger er fiktive. Gamle lagringer får en tom portefølje uten endring i kontanter, eiendeler eller opptjent rang. Standard- og arverunder bruker samme børsregler.

## QA

`npm test` tester kontantbevaring, delvise salg, kostgrunnlag, spread/kurtasje, likviditet, ugyldige ordrer, utbytterett, gjeld, spareplanens reserve, determinisme og import. `npm run qa:exchange` kjører 100 privilegerte, syntetiske porteføljer med direkte ukesoppdateringer. Dette er isolert teknisk stresstest, ikke bevis på normal kampanjeprogresjon eller balansert avkastning. Kursrisiko og tap er forventet; strategiene skal ikke alle tjene penger.

De ordinære 90 kampanjene og de separate arvesammenligningene kjøres fortsatt. Disse agentene velger ikke børsen; de er regresjonskontroll for den eksisterende kampanjen. Langsiktige samspill mellom aksjer, virksomhet og kapitalplaner trenger fortsatt uavhengig spilltesting. F11 om infrastrukturell tilbakebetaling er ikke erklært løst av denne børsutvidelsen.

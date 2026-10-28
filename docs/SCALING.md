# Alfa 0.5: reinvestering, kontrollspenn og rivaler

Denne runden følger diskusjonen under QA-runde 2. Den erstatter ikke manuelt gatesalg med mer manuell logistikk. Lederne kan fortsatt selge hele beholdningen og følge en kapitalplan.

## Kapital skal bygge noe

Fire infrastruktursystemer kan oppgraderes uten fast spillnivåtak: lager, distribusjon, utsalg og regional ledelse. Hvert neste nivå koster 18 % mer. Kapasitetsbidraget vokser logaritmisk; marginalgevinsten avtar. Hvert nivå åpner også netto rammeavtaler eller utleie, med avtagende ukentlig bidrag. UI viser grunnleggende tilbakebetalingstid før driftsstrategi og ekstra gevinst fra egen handel. Disse avtalene er eksplisitte inntekter fra bygget kapasitet, ikke varer som oppstår som kontanter.

Produksjonens utbyggingskostnad øker også med 18 % etter første etablering. Kapasiteten vokser langsommere per nivå. Utvidet produksjon kan stå ubrukt hvis lager, marked eller distribusjon ikke følger med. All beholdning kan fortsatt selges, men underleverandører kan koste opptil 12 % ekstra av brutto når eget distribusjonsapparat ikke strekker til. Fordelingen inkluderer faktiske tilpassede rutemengder og lager; den samme planen brukes før og etter opprettelse av en rute.

Lageret gir en fysisk produksjonsbegrensning. Overskytende gamle lagervarer slettes ikke, men eksternt lager koster 0,05 kr per ekstra kapasitetsenhet og uke. Nye rutenivåer utvider faktisk transportkapasitet; mengden endres i den eksisterende ruteplanleggeren. Regional ledelse gir større rekrutterings- og treningskull.

## Kapitalplan uten nye hverdagsklikk

Spilleren velger egne investeringer, balansert kapasitetsvekst eller ekspansjon. Delegerte planer gjør høyst ett kapitalvalg hver fjerde uke. De bruker høyst 60 % av kontantene utover en reserve for 13 ukers faste utgifter og to rundeinnkjøp og produksjonsoppgjør.

Lederne kan spare til en dyrere ring og avvikle et mindre område for å frigjøre kontrollspenn. Dette er ikke gratis: bare halv etableringskapital tilbakebetales. De kjøper ikke automatisk samme avviklede nærområde igjen. Å følge en plan er valgfritt; UI forklarer reserve og retning.

## Ringer og avgrensede mål

Den opprinnelige fem-by-kampanjen beholdes. Tretten regionale etableringer legges oppå den: Rogaland, Vestlandet, Norge og Norden. De knyttes til eksisterende salgsbyer fremfor å legge tretten nye manuelle handelsvinduer til spillet. Hvert område gir mer marked, eksplisitt rammeinntekt, vedlikehold og rivalpress.

To ulike historiske etableringer i forrige ring åpner neste. Riktig by og infrastruktur kreves i tillegg. Kontrollspennet er `3 + floor(log2(1 + ledelsesnivå))`. Det vokser, men stadig dyrere. Historisk tilgang og aktiv kontroll er ulike ting: et avviklet område teller ikke som aktivt eller som en eid eiendel.

Fullføring måles mot 18 avgrensede aktive by-/områdemål. Uendelige nivåer har ingen fullføringsprosent. At de nåværende botene ender rundt to tredeler er et målt resultat, ikke en matematisk garanti om optimal spillestil. Full ring kan kreve at man gir fra seg et annet område.

## Rivaler husker og mobiliserer

Per-rival kampanjeseire lagres utenfor den begrensede hendelsesloggen. Hver seier øker grunnstyrken med ytterligere 30 %. Nye kampanjer koster mer, trenger flere leverte måloppgjør og gir større tap av medlemmer og trente folk. Markedsfordelen av gjentatte seire avtar. Den eksisterende sperren mot å stable samme byfordel beholdes.

Kampanjemobilisering er en utgift, ikke en bokført produktiv eiendel og heller ikke produktiv reinvestering i QA-telleren. Den strengere kostnaden kan ikke omgås ved å falle tilbake til den gamle handlingen. Rivalene utfordrer ulike økonomiske planer; en aggressiv bot får ikke automatisk høyest imperieverdi.

Rådet utvides fra fire til åtte scenarier, med blant annet kapasitetskrise, regionalt eierskap, rivalenes koalisjon og generasjonsskifte. Dekningen måles. Flere scenarier er ikke i seg selv bevis på gode eller uforutsigbare valg.

## Gudfar og sluttscore

Gudfar måles nå mot 80 millioner i produktiv imperieverdi fremfor ubrukt kontantbeholdning. Tidligere nettverkskrav beholdes; i tillegg kreves fem aktive regionale områder i tre ringer og ledelse på minst nivå 5. Ingen kalenderdato er lagt inn som sperre. Eksisterende Gudfar-rang blir ikke tatt fra gamle lagringer.

Imperieverdien bygger på 80 % av bokført produktiv investeringskapital og tre års normalisert lokal netto driftsinntekt, vektet med lojalitet, søkelys og bystabilitet. Det er en eksplisitt spillverdi, ikke en markedsverdivurdering. Den inkluderer ikke kontantbeholdningen direkte. Det er ikke en offentlig, sikker flerspillerrekordtjeneste.

## Mellom runder

Etter fullført kampanje kan spilleren starte en ny standardrunde eller en separat merket arverunde. Med allianser kan arven vokse til høyst tre nivåer: 1 % lavere innkjøpspris og 0,5 prosentpoeng lavere tollrisiko per nivå. Standardrunder arver ingenting. Dette er lokal kampanjedata, ikke en konto eller en felles rekordliste.

`npm run qa:meta` sammenligner tre parvise seeds med samme agent i standardmodus og arvenivå 1 og 3. Risiko og valg kan endre senere forløp, så en liten bonus garanterer ikke at hver enkelt seed går raskere. Resultatet rapporteres separat fra standardbaseline.

## Kalenderoverganger

Reise, gatesalg, hvile og større tidshopp viser en kort kalender som teller faktiske forløpte dager. En periode som stopper ved et valg viser bare dagene som faktisk gikk. Gjenværende reisedager beholdes av motoren. Overgangen kan hoppes over, slås av i innstillingene og respekterer redusert bevegelse. Animasjonen endrer ingen spilltid eller regnskap.

## Åpent for uavhengig QA

Reproduser reinvesteringsandel, grunnleggende tilbakebetaling og kontrollspenn. Skill produktiv kapital fra løpende utgifter og kampanjemobilisering. Andelen etter Gudfar kan inkludere investerte kontantreserver fra før opprykket og er ikke en hard prosentregel. Vurder også om rammeavtaler, områdenes verdi og kontrollspenn gir interessante valg fremfor et nytt passivt pengespill. De nye agentene bruker nye kapitalplaner; dette er ingen kontrollert ablasjon mot alfa 0.4.

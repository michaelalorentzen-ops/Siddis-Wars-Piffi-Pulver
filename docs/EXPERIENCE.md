# Alfa 0.7: folk, løfter og følger

Målet er et morsomt strategispill om folk og makt. Flere skjermer eller høyere pengekrav er ikke i seg selv fremgang. Denne runden bygger et samlet spillbart grunnlag for å teste den retningen med mennesker.

## Hva spilleren gjør

Kaien viser tre relevante neste trekk. Gata samler oppdrag, byen, risikojobber og siste akt i egne seksjoner. Avanserte driftsbilder er fremdeles tilgjengelige. Vareflyten kan fortsatt delegeres; historiene krever ikke at Gudfar går tilbake til å selge manuelt.

Fire historier har sju steg hver, med forutsetninger i faktisk spillprogresjon. Ni fiktive kontakter husker valg. Du kan hjelpe, utnytte eller finne en annen vei; penger, tid og tillit står ofte mot hverandre. En historie kan ligge uten å utløpe hver uke. Ikke alle profiler fullfører alle sosiale spor.

Åtte gjenstander gir avgrensede effekter på faktiske priser, reiseutgifter, ruter, drift eller søkelys. Kvitteringer og synlige tilbud bruker samme beregning som oppgjøret. Ingen premie deles ut flere ganger ved gjenåpning av dialogen.

Ni oppdiktede risikojobber viser sjanser, tid, innsats og mulige tap før valget. Krefter, nerver, nedkjøling og lagtap begrenser gjentakelse. Stedene er innganger til handlinger; et besøk i en meny bruker ingen tid før du velger en handling.

Bjørnar og den fiktive etterforskeren Haugland åpner ved Gudfar eller i siste del av tiåret. Tre akter kan følge hverandre med ett års avstand etter oppgjør. Tidligere utfall påvirker neste akt. Forhandling, lovlig avgrensning, maktoppgjør og ansvar innebærer ulike kostnader i kontroll, innflytelse, folk, slitasje og avtalte kvartalsutgifter. Spillet har en oppdiktet avslutningsnatt 31. desember 2036; dette er ingen påstand om en virkelig fremtidig festival eller messe.

## Teknisk ramme

`bus.js` registrerer nye systemer gjennom `registerSystem`, med migrering, validator, handlinger og hendelsene week/rank/afterAction/ending. Legacy-handlinger blir foreløpig adaptert i ett felles inngangspunkt. Nytt innhold skal bruke registrering, ikke legge flere G.act-påbygg rundt hverandre.

Lastrekkefølge: engine, strategy, commerce, calendar, endgame, scaling, exchange, bus, characters, quest data, quests, crime data, crime, arc. Deretter eksisterende UI, med experience-ui sist. `qa/load.cjs` bruker samme motorrekkefølge.

Scener er en avgrenset innboks. Ett resultat vises automatisk; å lukke det bekrefter bare lesing og trekker ikke dager, penger eller tilfeldighetstall. Faktiske handlinger viser faktisk dagendring. Redusert bevegelse og valgfri lyd støttes.

## Oppfølging av QA-forslag

- Runde 4 er behandlet som et designinnspill, ikke en bindende sjekkliste. Vi beholder seks ranger, innfører ikke 25 tomme steder, og tvinger ikke inn ukentlige manuelle dialoger for å få en høyere aktivitetsmåling.
- F11: automatisk kapitalplan unngår ordinære infrastrukturkjøp som ikke rekker å tjene seg inn innen 2036 med dagens drift. Tilbud viser både utleie alene og et konkret anslag med dagens vareflyt, samt strategiske åpninger. Selve kurven med stadig dyrere høye nivåer består; prognosen er ingen garanti og ikke en full løsning på hele kapitaløkonomien.
- F12: simuleringen rapporterer nå konkret områdesammensetning og kontrollspenn. De ordinære profilene ender alle med samme sju regionale områder. 67 prosent skyldes dermed kontrollspenn og samme etableringsrekkefølge; dette er en avdekket mangel på strategisk variasjon, ikke bevis på god balanse. Regionale identiteter og alternative ekspansjonsveier trenger videre spilltesting/design.
- F13: arv sammenlignes nå over ti seeds, tre profiler og tre forhold: 90 runder / 60 parvise sammenligninger, med kvartiler, ytterpercentiler og langsommere utfall beholdt. Resultater er utforskende.

## Grenser for denne leveransen

Tekniske tester og heuristiske kampanjer kan vise at valg virker, penger stemmer og spillet når avslutningen. De kan ikke gi spillet 5/5 i moro. Vi må fortsatt teste tempo, karakterenes troverdighet, konsekvensenes lesbarhet og om spillerne faktisk ønsker å ta de vanskelige valgene.

Noen seiersveier og risikojobber er enklere enn andre; sluttkontanter er fortsatt høye i enkelte profiler. Avsluttede lagringer fra før historiesystemet kan vise den eldre generelle avslutningen i stedet for den nye sammensatte epilogen. Normal kampanjeavslutning er dekket av tester. Historiske Stavanger-referanser er kulisser; personer og kriminalhistorier i denne runden er fiktive.

# Eierbordet — alfa 0.10

Eierbordet åpner som Gudfar. Fem selskaper gir kapitalen en produktiv bruk og knytter eierskap til leveranser, folk og rivalenes reaksjoner. Dette er et avgrenset tillegg til eksisterende byutvikling, regionale områder og kapasitetsinvesteringer. Det er ikke en erklæring om ferdig spillbalanse.

## Fem selskaper, tre trinn hver

- **Stavanger: Skarv Drift.** Verksted og utleie ved industrifjorden, med Iman og Gauken på hver sin side av bordet.
- **Bergen: Regnlinjen.** En terminalavtale der Vera vil ha lokal råderett.
- **Kristiansand: Sørlys Hele Året.** Lager og arrangementer med sesongvariasjon: 140 % av grunninntekten mai–august og 80 % resten av året.
- **Trondheim: Nordverk.** En verkstedkjede som krever seks trente folk.
- **Oslo: Hovedbordet.** Næringslokaler og serviceavtaler som krever forhandlingsbord og tre driftsledere.

Alle krever etablert by, et salgsapparat som kan delegeres, en aktiv rute dit og tilstrekkelig kapital etter beskyttet reserve. Hvert selskap har tre utbyggingstrinn. Kostnadsvektene er 1, 1,6 og 2,4 ganger grunnprisen; et partnerskap koster 75 % av prisen for hele selskapet. Valgt eierform følger selskapet gjennom senere trinn.

**Lokale medeiere** gir 60 % eierskap, lavere avkastning og mindre rivalpress. Signering krever minst 60 lojalitet. Hvert fullført trinn gir −6 lokalt rivalpress og +3 lojalitet. Tre selskaper med minst ett fullført partnertrinn gir ett ekstra regionalt kontrollpunkt, høyst ett fra denne ordningen.

**Hele selskapet** gir 100 % eierskap og større avkastning, men krever eget lag. Bemanningskravet er 12 folk pluss to per allerede heleid, fullført selskap. Hvert fullført trinn gir +12 lokalt rivalpress, −2 lojalitet og inntil +2 spenning i selskapet.

Fullførte eieravtaler påvirker faktisk rivalstyrke. Partnerskap favoriserer forhandling og lovlige grenser i Bjørnar-sporet; heleide selskaper gir en liten fordel i konfrontasjon. Fordelene er avgrensede og vises i det aktuelle oppgjørets tilbud. De gir ikke automatisk støtte i Haugland-sporet. Fullføring kan også flytte personlig kontroll med −2 eller +2 når sluttakten er aktiv.

## Kapital først, inntekt etter oppbygging

Hele trinnkostnaden trekkes ved signering. Beløpet føres én gang som utgift i kontantregnskapet og én gang i den eksisterende produktive investeringsmodellen: `scale.invested`, `scale.assetBook` og, for Gudfar, `scale.postInvested`. `ownership.invested` er en separat detaljteller for samme kjøp, ikke en ny sum som legges oppå totalen. Investeringsloggen beholder pris, trinn, tilbakebetalingsanslag og gjenværende horisont.

Det nye trinnet gir først inntekt etter **åtte faktiske driftsuker med en bekreftet levering til riktig by og minst 55 lojalitet**. De ukene trenger ikke være sammenhengende. Tapte leveranser og lav lojalitet stanser fremdriften; de erstattes ikke av gratis fremdrift når kalenderen senere hopper. Eksisterende fullførte trinn fortsetter å drive. Pausegrunn og fremdrift vises i mappen, og rutene kan håndteres av lederne.

Kjøpet skal etterlate 13 ukers driftsreserve, full gjeldsdekning og reserve for det nye trinnets drift. Oppkjøp refunderes ikke ved et nytt klikk eller en endret fullmakt. Betalt våpenhvile er en løpende forhandlingsutgift, ikke en ny produktiv eiendel.

## Anslag og faktisk drift

Tilbudet viser marginal inntekt og drift for **neste** trinn. Oversikten over et fullført selskap viser summen av det som allerede er i drift. Begge deler er før valgt driftsstrategi. Faktiske kontantoppgjør kan derfor avvike fra normaldriftsbeløpet i mappen.

Tilbudene tar hensyn til selskapsavtalens delte bruttoandeler og spenningen som følger fullføringen. Både tilbudets nye selskapsinntekt og faktisk ny selskapsdrift bruker `itemModifiers(s).income` én gang. Eldre inntekter får ikke en ny, ekstra gjenstandsmultiplikator fra eierlaget. Kristiansand-tilbudet bruker helårssnittet av fire sommermåneder og åtte vintermåneder; den faktiske inntekten varierer med måneden. Spenning kan svekke inntekten og styrke rivalen, og senere avtaledeling kan senke bruttoandelen.

Tilbakebetalingsvurderingen bruker et forsiktig nettoanslag og inkluderer åtte oppbyggingsuker. Den må ligge innen både **300 uker og faktisk tid igjen til slutten av 2036**. Dette er en kjøpssperre mot uholdbare sene investeringer, ikke en garanti for tilbakebetaling: tapte leveranser, lav lojalitet, endrede avtaler og senere motstand kan gjøre perioden lengre. Ingen ekstra sluttdato eller gratis oppgjør gis for å redde et uferdig prosjekt.

## Egen fullmakt, uttrykkelig valgt

Standard er **manuelle eierbeslutninger**, også når en eldre lagring allerede har en automatisk kapitalplan. En slik gammel plan får ikke automatisk fullmakt til nye, irreversible selskapskjøp.

Spilleren kan velge en egen fullmakt i Eierbordet:

- **Jeg tar eieravtalene selv:** Oppkjøp og mottilbud velges manuelt. Den øvrige kapitalplanen beholdes.
- **Lokale partnerskap:** Lederne kan finansiere partnerskap og senere trinn. Ved mottilbud deler de neste avtale inntil grensen på tre delinger er brukt; deretter kan de betale for våpenhvile dersom reserven tillater det.
- **Heleide selskaper:** Lederne kan finansiere hele selskaper og senere trinn, og betale for våpenhvile. Denne fullmakten gir ikke automatisk tillatelse til å dele en bruttoandel når betaling ikke er mulig.

Hvis den øvrige kapitalplanen er manuell, vil en ny automatisk eierfullmakt også slå på **Balanser kapasiteten**. Dette står i tilbudet før spilleren bekrefter. Fullmakten kan binde betydelig kapital senere; UI krever derfor uttrykkelig bekreftelse og leser vilkårene på nytt før den registreres. Allerede valgt eierform endres ikke av en ny fullmakt.

Eierbeslutningene bruker samme kapitalrunde som vanlig drift, høyst ett valg hver fjerde uke og høyst 60 % av fri kapital etter reserve. De legger ikke til en ekstra kjøpsrunde. En pauset vanlig kapitalplan stanser også automatisk eieroppfølging, selv om fullmakten fortsatt er lagret. Ved manglende vilkår kan en beslutning bli liggende til spilleren kan håndtere den.

## Rivalen svarer uten en ny daglig rutine

Høyst ett mottilbud kan ligge åpent på tvers av de fem selskapene. Nye mottilbud kommer tidligst etter 26 uker på nettverksnivå, og selskapet må også ha hatt tid siden sitt siste oppgjør. De vises i Eierbordet og som meldinger; ingen automatisk modal stopper spillet.

Et mottilbud gir tre muligheter:

- **Del neste avtale:** −14 rivalpress, −5 spenning og +4 lojalitet. Lokale partnere får ytterligere seks prosentpoeng av selskapets bruttoinntekt. Høyst tre slike delinger, totalt 18 %, kan gis. Den opprinnelige eierformen endres ikke.
- **Kjøp våpenhvile:** Betal 3,5 % av kapitalen som er investert i selskapet. −10 rivalpress og −4 spenning. Beløpet er en utgift og gir ikke eiendelspoeng.
- **La laget holde avtalen:** Ingen ny betaling eller deling, men +12 rivalpress, +5 spenning, −4 lojalitet og +4 søkelys.

Mens tilbudet er ubesvart, øker byens rivalpress med 0,25 og selskapets spenning med 0,15 per faktisk driftsuke. Spenning stopper ved 12; bypress følger sin vanlige grense. Dette har reell virkning på drift og rivalstyrke. Ventekostnaden vises før valget. Den stanser når tilbudet besvares, og et åpent tilbud sperrer neste utbygging i den byen. Det finnes fortsatt svar uten engangsbetaling.

## Lagringer, grensesnitt og rollefordeling

Systemet har eget `ownership`-navnerom, versjon 1. Gamle lagringer uten feltet er gyldige og får en tom, manuell start ved oppgradering. Ingen gamle penger, rang eller gjennomførte prosjekter erstattes. Nivå og revisjon følger handlingsargumentene, slik at gamle kjøpstilbud eller allerede besvarte mottilbud ikke kan utføres på nytt.

UI viser én valgt bymappe og ett sett vilkår om gangen. Tilbud viser kapital, reserve, inntektsanslag, leveringstid og følger. Betalte valg bekreftes og kontrolleres på nytt; selve UI-et flytter verken penger, tid eller RNG. Tid og kontantendring vises gjennom den eksisterende ikke-blokkerende oppgjørsvisningen. Når kampanjen er avsluttet, beholdes mappene som lesbar historikk.

Stavanger, Bergen, Kristiansand, Trondheim og Oslo er virkelige byer. Selskapene, eieravtalene og kriminalkonfliktene i dette systemet er spillfiksjon. Et geografisk eller industrihistorisk bakteppe er ikke en påstand om at en virkelig arbeidsgiver, familie eller institusjon deltar i handlingene. Skarv Drift er sin egen spillvirksomhet.

## QA og åpne spørsmål

`npm test` omfatter målrettede tester for kjøp, bokføring, vilkår, fremdrift, migrering, revisjonssperrer og fullmakter. `npm run qa:balance`, `npm run qa:experience` og `npm run qa:coast` bruker ordinære kampanjer. `npm run qa:early` måler veien til første rang i både vanlig forretningspolicy og integrert historiepolicy, og beholder tap og mislykkede kjøringer. Den rapporterer handlinger og dager, ikke nettleserklikk eller menneskelig forståelse.

F28 vurderes fortsatt med separate mål for produktiv investering, kontanter, imperieverdi, gjeld og midler gitt videre. Nye produktive virksomheter kan først redusere kontantene og senere øke dem gjennom lønnsom drift. Høyere sluttkontanter er derfor verken alene en regresjon eller bevis på forbedring. Eierinvesteringen skal ikke dobbelttelles, gaver skal ikke bli private eiendeler, og en bestemt kontantandel er ikke et markedsføringsmål eller en hard spillregel.

Det må fortsatt vurderes om valg av eierskap, rivalenes svar og tempoet faktisk er interessante for spillere. Automatiske kampanjer og tekniske tester fastslår ikke en 5/5 spillopplevelse. Endelige testtall og resultater må hentes fra den konkrete versjonens QA-rapporter og kildehasher.

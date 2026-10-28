# Mekanikk: bevare kjernen, forbedre det sene spillet

Dette er en gjennomgang av offentlig tilgjengelig klientkode fra https://lopegutten.com/ lest 28. oktober 2026. Den beskriver ikke hele originalen, og originalen kan endres.

## Viktig referanseadferd

Originalens `doBuy` velger et land, betaler én tur/retur, bruker kalenderdager, kjøper et faktisk parti og behandler toll. `doSell` er en separat handling fra hjemmelageret, med egne salgsdager. Landene har ulike vareutvalg og priser.

Pris og etterspørsel avhenger blant annet av ukedag og nylige salg. Dagens salgstilbud beholdes når dialogen åpnes igjen. Formue, gjeld og eierskap bidrar til progresjon og rang. Produksjon og selgere arbeider med beholdning; de er ikke bare generelle kontantgeneratorer.

Originalens kjøpsdialog hadde ikke den lille, faste koffertgrensen man kunne ha antatt fra navnet. Vi har derfor ikke presentert en slik grense som nødvendig for likhet.

## Svakheter brukeren ønsker rettet

- En månedlig gratis tollpassering kan i praksis fjerne tollrisikoen ved få turer.
- Bergen har ukentlige fullprisgrenser, men prisoverslaget kan regne full pris på hele lasten. Overskuddet får bare 60 % pris.
- Egen venting én dag og «ligg lavt en uke» har forskjellig effekt på søkelys uten tydelig nok forklaring.
- Gateselgere og maksimal utbygging kan stagnere tidlig; Gudfar ender med flere år med manuell vareflytting.
- Gjengen kan bli et permanent høyt prosenttall uten relevante kostnader og valg senere.

## Hva alfa 0.3 faktisk har

- Egen utenlandsk innkjøpshandling med tur/retur, dagbruk, billettkostnad, landspesifikke priser og toll.
- Eget hjemmemarked fra faktisk beholdning, låst dagstilbud, synlig etterspørsel, ukedagsutslag og metning.
- Historisk varekostnad følger beholdningen; kontantstrøm og varefortjeneste skilles i oppgjøret.
- Formuesbasert rang, gjeld trukket fra, lån med forfall og separat lager.
- Delegering først etter Pusher-rang og driftsleder. Automatisk salg omsetter hele lageret; etterspørsel påvirker pris, ikke en fast månedlig kontantgrense.
- Faste ruter har en reell utenlandsk leverandør og synlig innkjøp, frakt, risiko, fullprisetterspørsel og rabatt.
- Produksjon fyller lager med varer og kan utvides videre.
- Fiktive rivaler, kamptap, lojalitet, slitasje, allianser, byvalg og kvartalsavtaler.

## Gjenstående vurderinger

Dette er fortsatt ikke et dokumentert «90 % likt» eller komplett spill. Originalens juridiske konsekvenser, beskyttelse, transportører, hendelsesbredde og lengre fortellinger er ikke fullt gjenskapt. Elektronikk og samlerklokker er beholdt fra eldre testversjoner. Kontantgivende virksomheter og ruter må vurderes opp mot lagerbasert omsetning for å unngå to økonomisystemer som trekker i hver sin retning.

Den viktigste åpne designjobben er sen kampanje: målet er store beslutninger fremfor flere rutineklikk. Raske penger og høy rang beviser ikke at dette er løst. QA skal undersøke dette kritisk og foreslå avgrensede forbedringer.

## Reiser og kalenderhendelser

Lokale kalenderperioder for påske, 17. mai og jul/nyttår påvirker markedet. Innkjøpsdialogen oppgir planlagt hjemkomst og om du er bortreist under hele eller deler av perioden. Ankomst på hendelsens første dag regnes ikke som fravær fra den. Ingen reise forkortes for å rekke en kalenderhendelse; strategiske valg kan stoppe fremvisningen, men gjenværende reisedager beholdes. Et aktivt salgsapparat og faste driftsavtaler fortsetter under fraværet.


## Alfa 0.4

Se [ENDGAME.md](ENDGAME.md) for maktråd, byspesifikke prosjektmål, styringsformer, institusjoner, produksjonsøkonomi og vedvarende arv. Den tidligere faste 65 %-prisen på overskudd erstattes med fallende marginalpris; hele beholdningen kan fortsatt selges.


## Alfa 0.4

Se [ENDGAME.md](ENDGAME.md) for maktråd, byspesifikke prosjektmål, styringsformer, institusjoner, produksjonsøkonomi og vedvarende arv. Den tidligere faste 65 %-prisen på overskudd erstattes med fallende marginalpris; hele beholdningen kan fortsatt selges.

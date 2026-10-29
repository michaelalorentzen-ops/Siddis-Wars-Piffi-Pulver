(function(root){
'use strict';
const G=root.Game;
// These firms and people belong to the game. Real employers are never antagonists.
G.OWNERSHIP_PATHS=[
 {id:'partners',name:'Lokale medeiere',text:'Du eier 60 %. Lokale ledere beholder resten og får siste ord om bemanningen. Tre ferdige partnerskap gir plass til én ekstra region. Lavere avkastning, mindre rivalpress og et sterkere lag.'},
 {id:'control',name:'Hele selskapet',text:'Du eier 100 % og beholder en større del av resultatet. Eget lag må bære ansvaret. Rivalen mobiliserer når du tar plassen deres, og bemanningskravet vokser med hvert oppkjøp.'}
];
G.OWNERSHIP_PROJECTS=[
 {city:0,id:'skarv',title:'Skarv Drift',contact:'Iman',setting:'Et verksted- og utleieselskap ved industrifjorden. Bestillinger finnes; spørsmålet er hvem som skal få eie arbeidsplassen.',rival:'Gauken',base:18000000,need:'Verkstedets leveranser',counter:'Gauken vil ha en plass i innkjøpsavtalen. Iman spør om du kjøper ro, deler kontrakten eller lar laget stå imot.'},
 {city:1,id:'regnlinjen',title:'Regnlinjen',contact:'Vera «Vinden»',setting:'En terminalavtale i Bergen. Lokale eiere vil ha reell myndighet, ikke et skilt med Stavanger på.',rival:'Vera «Vinden»',base:30000000,need:'Terminalens faste avganger',counter:'Vera krever lokal råderett over neste terminalavtale. «Bergen e fremdeles ikkje en filial.»'},
 {city:2,id:'sorlys',title:'Sørlys Hele Året',contact:'Nora «Sør»',setting:'Et lager- og arrangementsnettverk som skal ha arbeid også når sommergjestene reiser hjem. Sommertoppen gir mer, vinteren mindre.',rival:'Nora «Sør»',base:36000000,need:'Et helårsnettverk',counter:'Nora vil bruke neste sesong til å gi lokale arrangører plass. Du kan dele sesongen, betale for enerett eller satse på eget apparat.'},
 {city:3,id:'nordverk',title:'Nordverk',contact:'Iver «Natt»',setting:'En verkstedkjede i Trondheim. Det er instruktørene og folkene på gulvet som gjør selskapet verdifullt. Seks trente folk må være på laget.',rival:'Iver «Natt»',base:48000000,need:'Folk som kan faget',counter:'Iver vil binde instruktørene til en felles avtale. Et kjøp uten folk blir bare tomme bygg.'},
 {city:4,id:'hovedbordet',title:'Hovedbordet',contact:'Liv «Sentrum»',setting:'Et oppkjøp av næringslokaler og serviceavtaler i Oslo. Rådgivning og tre driftsledere må være på plass før du får sette deg.',rival:'Liv «Sentrum»',base:65000000,need:'Et apparat som tåler hovedstaden',counter:'Liv tilbyr en plass ved neste forhandlingsbord. Prisen kan betales i penger, eierskap til avtalene eller en åpen maktkamp.'}
];
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

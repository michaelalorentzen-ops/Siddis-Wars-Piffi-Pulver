(function(root){
'use strict';
root.Game.CRIMES=[
 {id:'favor',name:'En tjeneste i Pedersgata',text:'Hjelp en oppdiktet nabo ut av en vanskelig avtale. Raggen introduserer deg.',level:0,days:2,cost:0,reward:3600,stamina:14,nerve:8,chance:.82,rep:3,heat:2,cooldown:7,crewRisk:0},
 {id:'contact',name:'Stå ved kontakten din',text:'En kontakt trenger at noen står på deres side i en fiktiv maktkamp.',level:0,days:2,cost:500,reward:5400,stamina:18,nerve:12,chance:.76,rep:4,heat:4,cooldown:10,crewRisk:0},
 {id:'rumor',name:'Ryktene rundt Vågen',text:'Finn ut hvem som setter venner opp mot hverandre. Historien avgjøres abstrakt.',level:0,days:1,cost:800,reward:3200,stamina:10,nerve:10,chance:.80,rep:3,heat:0,cooldown:7,crewRisk:0,pressure:-3},
 {id:'peace',name:'Fred i Østre bydel',text:'Megle mellom to fiktive grupper før feiden sprer seg til laget.',level:1,days:3,cost:1600,reward:11000,stamina:20,nerve:16,chance:.73,rep:6,heat:-3,cooldown:14,crewRisk:0,loyalty:5,pressure:-6},
 {id:'rival',name:'Les rivalens neste trekk',text:'Bruk nettverket i en abstrakt konkurranse om innflytelse. Ingen praktiske fremgangsmåter.',level:1,days:2,cost:2400,reward:14500,stamina:22,nerve:18,chance:.69,rep:7,heat:5,cooldown:14,crewRisk:1,pressure:-10},
 {id:'night',name:'Nattens store spill',text:'Sett navnet ditt bak et risikabelt, oppdiktet havneoppdrag. Utfallet simuleres.',level:2,days:4,cost:6500,reward:38000,stamina:28,nerve:24,chance:.64,rep:9,heat:10,cooldown:21,crewRisk:1},
 {id:'rescue',name:'Hent vennskapet hjem',text:'En gammel venn vil ut av rivalens krets. Betal for en ny start og bær risikoen.',level:2,days:3,cost:5000,reward:24000,stamina:24,nerve:18,chance:.72,rep:8,heat:3,cooldown:21,crewRisk:1,loyalty:9,defense:4},
 {id:'summit',name:'Vestkystens lukkede bord',text:'Samle de oppdiktede bakmennene til et oppgjør om hvem som får bestemme.',level:3,days:4,cost:18000,reward:82000,stamina:30,nerve:27,chance:.62,rep:11,heat:9,cooldown:28,crewRisk:2,pressure:-12},
 {id:'reckoning',name:'Spillet om siste sete',text:'Et stort, fiktivt maktspill der penger, omdømme og laget ditt står på spill.',level:4,days:5,cost:45000,reward:190000,stamina:36,nerve:32,chance:.58,rep:14,heat:14,cooldown:35,crewRisk:2,pressure:-16,defense:6}
];
if(typeof module!=='undefined')module.exports=root.Game.CRIMES;
})(typeof window!=='undefined'?window:globalThis);

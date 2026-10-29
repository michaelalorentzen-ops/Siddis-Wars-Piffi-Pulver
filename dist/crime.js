(function(root){
'use strict';
const G=root.Game,clamp=n=>Math.max(0,Math.min(100,n)),finite=n=>typeof n==='number'&&Number.isFinite(n),int=n=>Number.isInteger(n)&&n>=0;
function heat(s,n){if(G.addHeat)G.addHeat(s,n);else s.heat=clamp(s.heat+n);}
function state(s){return s.crime??={version:1,stamina:100,nerve:100,attempts:0,last:{},outcomes:[],lastRecovery:s.week};}
function bounds(s){const c=state(s);c.stamina=clamp(c.stamina);c.nerve=clamp(c.nerve);if(s.crew){s.crew.loyalty=clamp(s.crew.loyalty);s.crew.fatigue=clamp(s.crew.fatigue);s.crew.trained=Math.min(s.crew.trained,s.crew.members);}}
function ledger(s,title,cost,gross,status){s.ledger.unshift({week:s.week,day:s.day,title,cost,gross,net:gross-cost,status});s.ledger=s.ledger.slice(0,120);}
G.crimeQuote=function(s,id){const o=G.CRIMES.find(o=>o.id===id);if(!o)return null;const c=state(s),crew=s.crew||{},loyalty=crew.loyalty??70;
 const success=Math.max(.30,Math.min(.94,o.chance+(loyalty-70)*.0015+Math.min(.05,(crew.trained||0)*.003)+(c.nerve-65)*.001-(s.heat||0)*.0015-(crew.fatigue||0)*.001));
 const critical=Math.min(1-success,Math.max(.025,(1-success)*.34)),complication=1-success-critical,cooldown=Math.max(0,(c.last[id]??-1000)+o.cooldown-s.day);
 const reason=s.ended?'Historien er avsluttet.':s.event?'Ta avgjørelsen først.':s.trip?'Fullfør reisen først.':G.END_DAY-s.day<o.days?'For få dager igjen til oppdraget.':(s.rankLevel||0)<o.level?'Bygg mer rang først.':cooldown?'Kontakten trenger '+cooldown+' dager før neste oppdrag.':s.cash<o.cost?'Du trenger mer kapital.':c.stamina<o.stamina?'Hvil for å hente krefter.':c.nerve<o.nerve?'Hvil for å samle nervene.':null;
 return {...o,success,complication,critical,cooldown,valid:!reason,reason,criticalLoss:o.cost+Math.round(o.reward*.18),complicationReward:Math.round(o.reward*.3)};
};
G.crimeList=s=>G.CRIMES.map(o=>G.crimeQuote(s,o.id));
function attempt(s,id){const q=G.crimeQuote(s,id),c=state(s),start=s.day,before=s.cash;c.last[id]=s.day;c.attempts++;c.stamina-=q.stamina;c.nerve-=q.nerve;s.cash-=q.cost;
 const roll=G.roll(s),outcome=roll<q.success?'success':roll<q.success+q.complication?'complication':'critical';let gross=0,loss=0,lost=0;
 if(outcome==='success'){gross=q.reward;s.rep+=q.rep;s.influence=(s.influence||0)+Math.ceil(q.rep/3);heat(s,q.heat);s.crew.loyalty+=q.loyalty||2;if(s.arc?.active){s.arc.pressure=clamp(s.arc.pressure+(q.pressure||0));s.arc.defense=clamp(s.arc.defense+(q.defense||0));}}
 else if(outcome==='complication'){gross=q.complicationReward;s.rep+=1;heat(s,Math.max(3,q.heat));s.crew.fatigue+=8;c.nerve-=4;}
 else {loss=Math.min(s.cash,Math.round(q.reward*.18));s.cash-=loss;heat(s,Math.max(7,q.heat+4));s.crew.loyalty-=6;s.crew.fatigue+=15;c.nerve-=10;lost=Math.min(q.crewRisk,s.crew.members);s.crew.members-=lost;}
 s.cash+=gross;bounds(s);const label={success:'Rent gjennomført',complication:'Komplikasjon',critical:'Alvorlig tilbakeslag'}[outcome],text=label+': '+q.name+'. '+(gross?'Oppgjør '+gross.toLocaleString('nb-NO')+' kr. ':'')+(loss?'Ekstra tap '+loss.toLocaleString('nb-NO')+' kr. ':'')+(lost?lost+' folk forlater laget. ':'')+'Rangen din beholdes.';
 ledger(s,'Oppdrag / '+q.name,q.cost+loss,gross,label);c.outcomes.unshift({id,day:s.day,outcome,gross,cost:q.cost+loss,lost,success:q.success});c.outcomes=c.outcomes.slice(0,30);
 G.elapse(s,q.days);s.summary={days:s.day-start,weeks:(s.day-start)/7,net:s.cash-before,stop:text};G.notifyScene(s,{id:'crime-'+c.attempts,title:label,speaker:outcome==='success'?'Raggen':'Laget',text,kind:outcome==='critical'?'warning':'crime'});return text;
}
G.registerSystem({id:'crime',migrate:state,validate(s){if(s.crime===undefined)return true;const c=s.crime;return !!c&&c.version===1&&finite(c.stamina)&&c.stamina>=0&&c.stamina<=100&&finite(c.nerve)&&c.nerve>=0&&c.nerve<=100&&int(c.attempts)&&int(c.lastRecovery)&&c.lastRecovery<=s.week&&c.last&&typeof c.last==='object'&&!Array.isArray(c.last)&&Object.entries(c.last).every(([k,v])=>G.CRIMES.some(o=>o.id===k)&&int(v)&&v<=s.day)&&Array.isArray(c.outcomes)&&c.outcomes.length<=30&&c.outcomes.every(o=>o&&G.CRIMES.some(q=>q.id===o.id)&&['success','complication','critical'].includes(o.outcome)&&int(o.day)&&o.day<=s.day&&int(o.gross)&&int(o.cost)&&int(o.lost)&&finite(o.success)&&o.success>=0&&o.success<=1);},hooks:{week(s){const c=state(s);if(c.lastRecovery>=s.week)return;const weeks=s.week-c.lastRecovery;c.lastRecovery=s.week;c.stamina=clamp(c.stamina+24*weeks);c.nerve=clamp(c.nerve+16*weeks);}},actions:{crimeAttempt:{guard(s,id){const q=G.crimeQuote(s,id);return q?q.reason:'Ukjent oppdrag.';},handler:attempt},crimeRest:{guard(s){return s.ended?'Historien er avsluttet.':null;},handler(s){const c=state(s),start=s.day,before=s.cash;G.elapse(s,3);c.stamina=clamp(c.stamina+35);c.nerve=clamp(c.nerve+25);s.heat=clamp(s.heat-6);s.crew.fatigue=clamp(s.crew.fatigue-8);s.summary={days:s.day-start,weeks:(s.day-start)/7,net:s.cash-before,stop:'Pusterom: +35 krefter, +25 nerver, −6 søkelys og −8 slitasje. Ukedrift kommer i tillegg.'};return s.summary.stop;}}}});
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

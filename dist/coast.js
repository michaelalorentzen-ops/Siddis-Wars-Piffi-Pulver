(function(root){
'use strict';
const G=root.Game,stories=G.COAST_STORIES,ids=stories.map(l=>l.id),resolving=new WeakSet();
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o),clamp=(n,lo=0,hi=100)=>Math.max(lo,Math.min(hi,n));
const effectKeys=['crew','trained','rep','influence','loyalty','fatigue','trust'];
const flagIds=new Set(stories.flatMap(l=>l.steps.flatMap(t=>t.choices.map(c=>c.flag).filter(Boolean))));
const policies={personal:{label:'Jeg tar valgene selv',text:'Ingen avgjør disse løftene på dine vegne.'},community:{label:'Gi laget et fellesskapsmandat',text:'Lederne kan velge én tilgjengelig fellesskapsoppgave per faktisk driftsuke, fra tredje kapittel. Arbeidsuka inkluderer oppgavens dager; ingen ekstra kalenderdager legges til. Driftsreserven vernes. Avslutningene velger du selv.'},enterprise:{label:'Gi laget et næringsmandat',text:'Lederne kan velge én tilgjengelig betalt prosjektoppgave per faktisk driftsuke, fra tredje kapittel. Arbeidsuka inkluderer oppgavens dager. Det kan koste fellesskapets tillit. Driftsreserven vernes. Avslutningene velger du selv.'}};
function initial(s){return {version:1,policy:'personal',lastWeek:s.week,cursor:0,lines:Object.fromEntries(ids.map(id=>[id,{step:0,choices:[],announced:-1}])),trust:Object.fromEntries(ids.map(id=>[id,0])),flags:{}};}
const view=s=>s.coast===undefined?initial(s):s.coast;
function migrate(s){if(s.coast===undefined)s.coast=initial(s);}
function validate(s){try{if(s.coast===undefined)return true;const a=s.coast;
 return plain(a)&&a.version===1&&Object.hasOwn(policies,a.policy)&&Number.isInteger(a.lastWeek)&&a.lastWeek>=0&&a.lastWeek<=s.week&&Number.isInteger(a.cursor)&&a.cursor>=0&&a.cursor<stories.length&&plain(a.lines)&&Object.keys(a.lines).length===ids.length&&plain(a.trust)&&Object.keys(a.trust).length===ids.length&&ids.every(id=>Number.isInteger(a.trust[id])&&a.trust[id]>=-5&&a.trust[id]<=5)&&plain(a.flags)&&Object.entries(a.flags).every(([id,v])=>flagIds.has(id)&&typeof v==='boolean')&&stories.every(l=>{
  const p=a.lines[l.id];return plain(p)&&Number.isInteger(p.step)&&p.step>=0&&p.step<=l.steps.length&&Number.isInteger(p.announced)&&p.announced>=-1&&p.announced<=Math.min(p.step,l.steps.length-1)&&Array.isArray(p.choices)&&p.choices.length===p.step&&p.choices.every((h,i)=>plain(h)&&l.steps[i].choices.some(c=>c.id===h.id)&&Number.isInteger(h.day)&&h.day>=0&&h.day<=s.day&&Number.isInteger(h.week)&&h.week===Math.floor(h.day/7)&&Number.isInteger(h.days)&&h.days>=0&&h.days<=3&&h.day+h.days<=s.day&&typeof h.automatic==='boolean'&&(!h.automatic||h.days===0)&&['cost','cash'].every(k=>Number.isSafeInteger(h[k])&&h[k]>=0&&h[k]<=1000000)&&plain(h.effects)&&Object.keys(h.effects).length===effectKeys.length&&effectKeys.every(k=>Number.isFinite(h.effects[k])&&Math.abs(h.effects[k])<=100)&&(!i||h.day>=p.choices[i-1].day));
 });
 }catch(_){return false;}}
function needReason(s,need){const a=view(s),active=s.routes.filter(r=>r.active),counts={sales:s.sales||0,trips:s.trips||0,crew:s.crew.members,trained:s.crew.trained,businesses:s.businesses.length,activeRoutes:active.length,cities:s.cities.length},labels={sales:'salg',trips:'innkjøpsreiser',crew:'folk i laget',trained:'trente folk',businesses:'bedrifter',activeRoutes:'aktive ruter',cities:'byer'};
 for(const [k,v]of Object.entries(need||{})){
  if(k==='any'){const reasons=v.map(n=>needReason(s,n));if(reasons.every(Boolean))return 'Velg en vei videre: '+reasons.join(' Eller ');}
  else if(k==='coast'){for(const [id,n]of Object.entries(v))if(a.lines[id].step<n)return 'Fullfør '+n+' kapitler i «'+stories.find(l=>l.id===id).title+'» for dette samarbeidet.';}
  else if(Object.hasOwn(counts,k)&&counts[k]<v)return labels[k]+': '+counts[k]+' / '+v+'.';
 }
 return null;
}
function chapter(s,l){const t=l.steps[view(s).lines[l.id].step];if(!t)return null;const callbacks=(t.callbacks||[]).filter(c=>view(s).flags[c.flag]);return {...t,text:[t.text,...callbacks.map(c=>c.text)].join(' '),choiceCosts:callbacks.filter(c=>c.choices),callbackCost:callbacks.filter(c=>!c.choices).reduce((n,c)=>n+(c.cost||0),0)};}
function blocked(s){return s.ended?'Historien er avsluttet.':s.trip?'Fullfør reisen først.':s.event?'Svar på avgjørelsen først.':null;}
function deltas(s,id,c){const crew=c.crew||0,trained=Math.min(c.train||0,Math.max(0,s.crew.members+crew-s.crew.trained));return {crew,trained,rep:c.rep||0,influence:Math.max(0,s.influence+(c.influence||0))-s.influence,loyalty:clamp(s.crew.loyalty+(c.loyalty||0))-s.crew.loyalty,fatigue:clamp(s.crew.fatigue+(c.fatigue||0))-s.crew.fatigue,trust:clamp(view(s).trust[id]+(c.trust||0),-5,5)-view(s).trust[id]};}
function quote(s,arg,automatic=false){if(!plain(arg)||!Number.isInteger(arg.step))return null;const l=stories.find(l=>l.id===arg.line);if(!l)return null;const a=view(s).lines[l.id],t=chapter(s,l),c=t?.choices.find(c=>c.id===arg.choice);if(!c)return null;
 const cost=c.cost+t.callbackCost+t.choiceCosts.filter(k=>k.choices.includes(c.id)).reduce((n,k)=>n+k.cost,0),reason=blocked(s)||(arg.step!==a.step?'Dette valget tilhører et tidligere kapittel.':null)||needReason(s,t.need)||needReason(s,c.need)||(G.END_DAY-s.day<(automatic?0:c.days)?'For få dager igjen til hele oppgaven.':null)||(s.cash<cost?'Du trenger '+cost.toLocaleString('nb-NO')+' kr før oppgaven starter.':null);
 return {...c,cost,days:automatic?0:c.days,taskDays:c.days,includedInWeek:automatic,effects:deltas(s,l.id,c),allowed:!reason,valid:!reason,reason,action:'coastChoice',arg:{line:l.id,choice:c.id,step:a.step},step:a.step,place:t.place,placeId:t.placeId};
}
G.coastQuote=(s,arg)=>quote(s,arg);
G.coastInfo=function(s,id){const l=stories.find(l=>l.id===id);if(!l)return null;const p=view(s).lines[id],done=p.step===l.steps.length,t=s.ended||done?null:chapter(s,l),choices=t?t.choices.map(c=>quote(s,{line:id,choice:c.id,step:p.step})):[],reason=blocked(s)||(done?'Denne fortellingen er avsluttet.':needReason(s,t.need))||(choices.length&&!choices.some(c=>c.allowed)?choices[0].reason:null),last=p.choices.at(-1),ending=done?l.steps.at(-1).choices.find(c=>c.id===last.id):null;
 return {id,title:l.title,intro:l.intro,region:l.region,step:p.step,total:l.steps.length,status:done?'done':'active',ready:!reason,reason,trust:view(s).trust[id],policy:view(s).policy,current:t?{...t,choices}:null,ending:ending?{title:ending.ending,text:ending.text,choice:ending.id}:null,history:p.choices.map((h,i)=>{const t=l.steps[i],c=t.choices.find(c=>c.id===h.id);return {...h,title:t.title,label:c.label,text:c.text,place:t.place,placeId:t.placeId};})};
};
G.coastList=s=>stories.map(l=>G.coastInfo(s,l.id));
G.coastPolicyQuote=function(s,id){const p=Object.hasOwn(policies,id)?policies[id]:null;if(!p)return null;const reason=blocked(s)||(id!=='personal'&&(s.rankLevel<2||s.managers<1)?'Et mandat trenger Pusher-rang og minst én driftsleder.':null);return {id,...p,cost:0,days:0,allowed:!reason,valid:!reason,reason,active:view(s).policy===id,action:'coastPolicy',arg:id};};
function guard(s,arg){if(!plain(arg)||typeof arg.line!=='string'||typeof arg.choice!=='string'||!Number.isInteger(arg.step))return 'Velg et gyldig kapittel og svar.';const a=view(s).lines[arg.line];if(!a)return 'Ukjent kystfortelling.';if(arg.step!==a.step)return 'Dette valget tilhører et tidligere kapittel.';if(a.step>=stories.find(l=>l.id===arg.line).steps.length)return 'Denne fortellingen er avsluttet.';const q=quote(s,arg);return q?q.reason:'Velg et gyldig svar.';}
function commit(s,arg,automatic=false){const q=quote(s,arg,automatic);if(!q?.allowed)return q?.reason||'Ingen slik oppgave er klar.';const l=stories.find(l=>l.id===arg.line),t=chapter(s,l),a=s.coast,p=a.lines[l.id],start=s.day,cash=s.cash,e=q.effects;
 s.cash+=q.cash-q.cost;s.rep+=e.rep;s.influence+=e.influence;s.crew.members+=e.crew;s.crew.trained+=e.trained;s.crew.loyalty+=e.loyalty;s.crew.fatigue+=e.fatigue;a.trust[l.id]+=e.trust;if(q.flag)a.flags[q.flag]=true;
 const h={id:q.id,day:start,week:s.week,cost:q.cost,cash:q.cash,days:0,automatic,effects:{...e}};p.choices.push(h);p.step++;
 resolving.add(s);try{if(!automatic)G.elapse(s,q.days);}finally{resolving.delete(s);}h.days=s.day-start;G.checkProgress?.(s);G.refreshRank(s);
 s.ledger.unshift({day:s.day,week:s.week,title:'Kysten / '+t.title,cost:q.cost,gross:q.cash,net:q.cash-q.cost,status:q.label+(automatic?' · utført innenfor driftsuka':'')});s.ledger=s.ledger.slice(0,120);
 G.notifyScene(s,{id:'coast-result:'+l.id+':'+p.step,title:p.step===l.steps.length?q.ending:t.title,speaker:t.speaker,text:q.text+(automatic?' Lederne løste oppgaven innenfor denne driftsuka.':''),kind:'coastResult',coast:l.id});
 if(!automatic)s.summary={days:s.day-start,weeks:(s.day-start)/7,net:s.cash-cash,stop:q.text};
 if(Array.isArray(s.log)){s.log.unshift(t.speaker+': '+q.text);s.log=s.log.slice(0,80);}return q.text;
}
function announce(s){if(blocked(s))return;for(const l of stories){const p=s.coast.lines[l.id];if(p.announced===p.step||p.step>=l.steps.length)continue;const info=G.coastInfo(s,l.id);if(!info.ready)continue;p.announced=p.step;G.notifyScene(s,{id:'coast:'+l.id+':'+p.step,title:info.current.title,speaker:info.current.speaker,text:info.current.text,kind:'coast',coast:l.id,place:info.current.place});}}
function week(s){const a=s.coast;if(s.ended||a.lastWeek>=s.week)return;a.lastWeek=s.week;if(a.policy==='personal'||resolving.has(s)||blocked(s)||s.rankLevel<2||s.managers<1)return;
 const reserve=Math.max(1500,G.capitalReserve?.(s)||0);for(let offset=0;offset<stories.length;offset++){const i=(a.cursor+offset)%stories.length,l=stories[i],p=a.lines[l.id];if(p.step<l.delegateFrom||p.step>=l.steps.length-1)continue;const t=chapter(s,l);for(const c of t.choices.filter(c=>c.mode===a.policy)){const arg={line:l.id,choice:c.id,step:p.step},q=quote(s,arg,true);if(!q?.allowed||s.cash-q.cost<reserve)continue;commit(s,arg,true);a.cursor=(i+1)%stories.length;return;}}
}
G.registerSystem({id:'coast',migrate,validate,hooks:{week,afterAction:announce},actions:{coastChoice:{guard,handler:(s,arg)=>commit(s,arg)},coastPolicy:{guard(s,id){const q=G.coastPolicyQuote(s,id);return q?q.reason:'Velg et gyldig mandat.';},handler(s,id){s.coast.policy=id;return policies[id].text;}}}});
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

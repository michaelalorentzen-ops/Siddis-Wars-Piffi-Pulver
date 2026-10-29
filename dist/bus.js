(function(root){
'use strict';
const G=root.Game,legacy={fresh:G.fresh,upgrade:G.upgrade,valid:G.valid,act:G.act,week:G.onStrategicWeek};
const systems=[],actions=new Map(),listeners=new Map();let actionDepth=0;
const itemBase={income:G.income,market:G.market,quote:G.quote};
G.income=s=>Math.round(itemBase.income(s)*(G.itemModifiers?.(s).income||1));
G.market=(s,i)=>{const q=itemBase.market(s,i);return {...q,price:Math.max(1,Math.round(q.price*(G.itemModifiers?.(s).salePrice||1)))};};
G.quote=(s,r,w)=>{const q=itemBase.quote(s,r,w),m=G.itemModifiers?.(s);if(!m)return q;const gross=Math.round(q.gross*m.salePrice),freight=Math.round(q.freight*m.travelCost),risk=q.risk/m.routeReliability;return {...q,p:q.p*m.salePrice,gross,freight,risk,net:gross-q.supply-freight,expected:Math.round(gross*(1-risk)+q.supply*q.refund*risk-q.supply-freight)};};

function experience(s){s.experience??={version:1,scenes:[],seen:[],nextScene:1,endingShown:false};return s.experience;}
function migrate(s){experience(s);for(const system of systems)system.migrate?.(s);return s;}
G.on=function(name,fn){if(typeof fn!=='function')throw Error('Event listener must be a function');const list=listeners.get(name)||[];list.push(fn);listeners.set(name,list);return ()=>{const i=list.indexOf(fn);if(i>=0)list.splice(i,1);};};
G.emit=function(name,s,ctx={}){for(const fn of [...(listeners.get(name)||[])])fn(s,ctx);};
G.registerAction=function(type,handler,guard,options={}){if(actions.has(type))throw Error('Duplicate action: '+type);if(typeof handler!=='function')throw Error('Missing action handler: '+type);actions.set(type,{handler,guard,...options});};
G.registerSystem=function(system){if(!system?.id||systems.some(x=>x.id===system.id))throw Error('Duplicate or missing system id');systems.push(system);for(const [event,fn]of Object.entries(system.hooks||{}))G.on(event,fn);for(const [type,definition]of Object.entries(system.actions||{})){const d=typeof definition==='function'?{handler:definition}:definition;G.registerAction(type,d.handler,d.guard,d);}};
G.systemIds=()=>systems.map(s=>s.id);
G.roll=function(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;};
G.notifyScene=function(s,scene){const e=experience(s),id=String(scene.id||'scene-'+e.nextScene++);if(e.seen.includes(id)||e.scenes.some(x=>x.id===id))return false;const clean={...scene,id,title:String(scene.title||'En melding'),speaker:String(scene.speaker||'Raggen'),text:String(scene.text||''),kind:String(scene.kind||'story'),day:s.day,week:s.week};e.scenes.push(clean);if(e.scenes.length>12)e.scenes.shift();return true;};
G.pendingScene=s=>experience(s).scenes[0]||null;
G.dismissScene=function(s,id){const e=experience(s),key=String(id||e.scenes[0]?.id||''),i=e.scenes.findIndex(x=>x.id===key);if(i<0)return false;e.scenes.splice(i,1);e.seen.push(key);e.seen=e.seen.slice(-300);return true;};
G.registerAction('dismissScene',(s,id)=>G.dismissScene(s,id)?'Meldingen er lest.':'Ingen melding.',null,{allowDuringEvent:true,allowDuringTrip:true,allowWhenEnded:true,silent:true});
G.upgrade=s=>migrate(legacy.upgrade(s));
G.fresh=()=>migrate(legacy.fresh());
G.onStrategicWeek=function(s){const before=s.rankLevel;legacy.week(s);migrate(s);G.emit('week',s,{week:s.week,day:s.day});if(actionDepth===0&&s.rankLevel>before)G.emit('rank',s,{from:before,to:s.rankLevel});};
function snapshot(s){return {day:s.day,week:s.week,cash:s.cash,rankLevel:s.rankLevel,heat:s.heat,sales:s.sales,trips:s.trips,cities:s.cities.length,crew:s.crew.members,trained:s.crew.trained};}
G.act=function(s,type,arg){G.upgrade(s);const registered=actions.get(type);if(registered){if(s.ended&&!registered.allowWhenEnded)return 'Runden er avsluttet.';if(s.trip&&!registered.allowDuringTrip)return 'Fullfør reisen først.';if(s.event&&!registered.allowDuringEvent)return 'En viktig avgjørelse venter først.';const denied=registered.guard?.(s,arg);if(denied)return String(denied);}
 const before=snapshot(s),outer=actionDepth===0,beforeState=outer?JSON.stringify(s):null;let result;actionDepth++;try{result=registered?registered.handler(s,arg):legacy.act(s,type,arg);}finally{actionDepth--;}
 if(registered&&!registered.silent){G.checkProgress?.(s);G.refreshRank(s);}
 if(outer&&!registered?.silent&&JSON.stringify(s)!==beforeState){if(s.rankLevel>before.rankLevel){G.emit('rank',s,{from:before.rankLevel,to:s.rankLevel});for(let rank=before.rankLevel+1;rank<=s.rankLevel;rank++)G.notifyScene(s,{id:'rank-'+rank,kind:'rank',title:G.LEVELS[rank].name,speaker:'Raggen',text:['','Du har et navn nå. Folk begynne å huska kem du e.','Du skal ikkje springa med kvar pose sjøl. Finn folk du kan stola på.','Du har fått et bord. Nå må du finna ut kem som får sitte der.','Byane ser mot Stavanger. Det e ikkje alle som smile.','Raggen setter en nøkkel på bordet. «Kofferten kan stå. Nå e det folkå du må passa på.»'][rank]});}
 G.emit('afterAction',s,{type,arg,result,before});if(s.ended&&!experience(s).endingShown){G.emit('ending',s,{day:s.day,week:s.week});experience(s).endingShown=true;}}
 return typeof result==='string'?result:String(result?.message||'Utført.');
};
G.valid=function(s){try{if(!legacy.valid(s))return false;if(s.experience){const e=s.experience;if(e.version!==1||!Array.isArray(e.scenes)||e.scenes.length>12||!Array.isArray(e.seen)||e.seen.length>300||!e.seen.every(x=>typeof x==='string')||!Number.isSafeInteger(e.nextScene)||e.nextScene<1||typeof e.endingShown!=='boolean'||!e.scenes.every(x=>x&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.speaker==='string'&&typeof x.text==='string'&&typeof x.kind==='string'&&Number.isInteger(x.day)&&x.day>=0&&x.day<=s.day))return false;}return systems.every(system=>!system.validate||system.validate(s));}catch(_){return false;}};
G.nextMoves=function(s){const moves=[];if(s.ended)return [{id:'ending',title:'Se hva som står igjen',text:'Historien er fullført. Les avslutningen og velg din neste runde.',view:'experience',label:'Åpne historien'}];if(s.event)return [{id:'decision',title:'En avgjørelse venter',text:'Les meldingen før du lar mer tid gå.',view:'home',label:'Til meldingen'}];if(s.trip)return [{id:'trip',title:'Reisen er ikkje ferdig',text:s.trip.remaining+' dager gjenstår. Lasten kommer hjem med deg.',action:'continueTrip',label:'Fortsett reisen'}];
 const quests=typeof G.questList==='function'?G.questList(s):[];for(const q of quests.filter(q=>q.status!=='done'&&q.status!=='locked').slice(0,1))moves.push({id:'quest-'+q.id,title:q.name||q.title||'En kontakt trenger deg',text:q.current?.text||q.nextText||q.text||'Et løfte venter på at du tar stilling.',view:'experience',arg:{quest:q.id,section:'quests'},label:'Snakk med kontakten'});
 if(s.stock.some(n=>n>0))moves.push({id:'sell',title:'Et parti venter i kofferten',text:'Se dagens etterspørsel og hva handelen faktisk gir.',ui:'sell',label:'Se salget'});else if(!G.canDelegate(s))moves.push({id:'buy',title:'Raggen kjenner en kontakt',text:'Skaff et faktisk parti før du selger. Reise, toll og kalender teller.',ui:'buy',label:'Velg en reise'});
 if(s.rankLevel>=2&&!G.canDelegate(s))moves.push({id:'manager',title:'Finn en driftsleder du stoler på',text:'La folkene ta vareflyten mens du bygger nettverket.',action:'manager',label:'Ansett driftsleder',disabled:s.cash<15000*(s.managers+1),reason:'Sett av penger til lønn og ansettelse.'});
 if(s.arc?.active&&!(s.arc.rival&&s.arc.case))moves.push({id:'arc',title:'Noen ser mot Stavanger',text:'Rivalen og etterforskningen lever videre mens du bygger.',view:'experience',arg:{section:'arc'},label:'Se truslene'});
 moves.push({id:'street',title:'Byen har mer enn handel',text:'Ta en jobb, besøk en kontakt eller undersøk en rival. Se risikoen før du velger.',view:'experience',arg:{section:'crime'},label:'Ut i byen'});
 if(G.canDelegate(s))moves.push({id:'network',title:'Gi laget en retning',text:'Utvid en by eller gi lederne en ny kapitalplan.',view:s.rankLevel>=3?'scaling':'routes',label:'Se nettverket'});return moves.slice(0,3);
};
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

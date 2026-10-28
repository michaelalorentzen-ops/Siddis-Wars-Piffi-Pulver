(function(root){
'use strict';
const G=root.Game,prior={upgrade:G.upgrade,fresh:G.fresh,act:G.act,eventInfo:G.eventInfo,valid:G.valid,demand:G.demand,quote:G.quote,saleQuote:G.saleQuote,income:G.income,upkeep:G.upkeep,outcome:G.outcome};
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const note=(s,t)=>{s.log.unshift(t);s.log=s.log.slice(0,80);};
const record=(s,r)=>{s.ledger.unshift({week:s.week,day:s.day,...r});s.ledger=s.ledger.slice(0,120);};
G.DOCTRINES=[
 {id:'federation',name:'Forbundet',text:'Lokale partnere: −0,6 rivalpress per uke, +0,5 lojalitet. Rutene gir 6 % lavere bruttopris.'},
 {id:'network',name:'Nettverket',text:'Profesjonell logistikk: −3 prosentpoeng ruterisiko og +15 % fullprisetterspørsel. Ingen prisbonus.'},
 {id:'dominion',name:'Egen kontroll',text:'+18 % bruttopris på rutene, +3 prosentpoeng ruterisiko og +0,7 rivalpress per uke. Krever et sterkt lag.'}
];
G.INSTITUTIONS=[
 {id:'logistics',name:'Driftssentralen',cost:350000,text:'+12 % fullprisetterspørsel og −1 prosentpoeng ruterisiko per nivå.'},
 {id:'academy',name:'Lederskolen',cost:450000,text:'Trener ett eksisterende medlem hver fjerde uke per nivå. −1 ekstra slitasje per uke og nivå.'},
 {id:'counsel',name:'Forhandlingsbordet',cost:400000,text:'−0,3 rivalpress per uke og nivå. Gjør lokale partneravtaler mer robuste; kreves i Oslo.'}
];
const cityNames=['Hjemmebanen','Bryggen vil bestemme sjøl','Mer enn sommersesongen','Bordet nordafor','Ingen ledige stoler'];
function state(s){
 s.empire??={version:1,doctrine:null,lastDoctrine:-100,institutions:{},charters:{},operation:null,history:[],decisions:0,successes:0,setbacks:0,nextCouncil:s.week+8,serial:0,legacy:{},effects:[],lastWeek:s.week,revenue:{local:0,routes:0,distribution:0,contracts:0},firstCouncil:null};
 return s.empire;
}
G.upgrade=s=>{prior.upgrade(s);state(s);return s;};
G.fresh=()=>{const s=prior.fresh();state(s);return s;};
const level=(s,id)=>s.empire?.institutions[id]||0;
const charterCount=s=>Object.keys(s.empire?.charters||{}).length;
function effects(s,city){const e=state(s);let price=e.doctrine==='dominion'?1.18:e.doctrine==='federation'?.94:1,demand=1+level(s,'logistics')*.12+(e.doctrine==='network'?.15:0),risk=(e.doctrine==='network'?-.03:e.doctrine==='dominion'?.03:0)-level(s,'logistics')*.01;
 if(e.legacy.national)demand+=.1;if(e.legacy.national)demand+=.1;const c=e.charters[city];if(c==='control')price*=1.12;if(c==='partnership'){demand+=.2;risk-=.02;}
 for(const f of e.effects)if(f.until>s.week&&(f.city===null||f.city===city)){price*=f.price||1;demand*=f.demand||1;risk+=f.risk||0;}
 return {price,demand,risk};
}
G.demand=(s,c,g,w)=>Math.max(1,Math.round(prior.demand(s,c,g,w)*effects(s,c).demand));
G.quote=(s,r,w)=>{const q=prior.quote(s,r,w),f=effects(s,r.city),p=Math.round(q.p*f.price),gross=Math.round((q.full+q.discounted*.6)*p),risk=clamp(q.risk+f.risk,.015,.55);return {...q,p,gross,risk,net:gross-q.supply-q.freight,expected:Math.round(gross*(1-risk)+q.supply*q.refund*risk-q.supply-q.freight)};};
G.income=s=>Math.round(prior.income(s)*(s.empire?.doctrine==='federation'?.97:1));
G.upkeep=s=>prior.upkeep(s)+G.INSTITUTIONS.reduce((n,i)=>n+level(s,i.id)*1500,0);
G.godfatherRequirements=s=>[
 {name:'80 millioner i netto formue',ok:G.netWorth(s)>=80000000},
 {name:'To virksomheter og 80 innflytelse',ok:s.businesses.length>=2&&s.influence>=80},
 {name:'Fire byer i nettverket',ok:s.cities.length>=4},
 {name:'Tre lokale maktavtaler gjennomførte',ok:charterCount(s)>=3},
 {name:'To ulike institusjoner',ok:G.INSTITUTIONS.filter(i=>level(s,i.id)>0).length>=2},
 {name:'Landsavtalen eller etterfølgerplanen fullført',ok:!!(s.empire?.legacy.national||s.empire?.legacy.succession)}
];
G.refreshRank=function(s){let l=s.rankLevel||0;while(l<5&&G.netWorth(s)>=G.LEVELS[l+1].worth){if(l===4&&!G.godfatherRequirements(s).every(r=>r.ok))break;l++;note(s,'NY RANG: '+G.LEVELS[l].name+'.');}s.rankLevel=l;return l;};
function project(s,kind,city,path){const e=state(s),b=s.branches[city],base=Math.round(Math.max(150000,G.income(s)*4));
 if(kind==='charter'){if(!s.cities.includes(city)||city===0||!b||b.level<2||e.charters[city]||!['partnership','control'].includes(path))return null;return {kind,city,path,title:cityNames[city],cost:base,need:8,duration:14,text:(path==='partnership'?'Hold rivalpress ≤55 og lojalitet ≥65 i åtte ukesoppgjør. Gir +20 % etterspørsel og −2 prosentpoeng ruterisiko i byen.':'Gjennomfør åtte leverte ruteoppgjør i byen med lagstyrke ≥60 % av rivalens. Gir +12 % rutebruttopris; oppgjøret koster 1–3 folk.')+(['',' Bergen krever lokal tillit.',' Kristiansand krever to aktive ruter med ulike varer: byen skal leve utenom høysesongen.',' Trondheim krever Driftssentralen på nivå 1: kapasitet må følge ekspansjonen.',' Oslo krever Forhandlingsbordet på nivå 1 og minst 80 innflytelse.'][city])};}
 if(kind==='national'&&!e.legacy.national&&s.cities.length>=4&&charterCount(s)>=3)return {kind,city:0,path:'',title:'Fem bord, én landsavtale',cost:base*2,need:8,duration:16,text:'Hold minst tre ferdigutviklede utposter under 60 rivalpress, med lokal maktavtale og minst 65 lojalitet, i åtte uker. Gir en varig landsavtale og +10 % fullprisetterspørsel.'};
 if(kind==='succession'&&!e.legacy.succession&&level(s,'academy')&&s.cities.length>=3)return {kind,city:0,path:'',title:'Kem tar nøklane når du går?',cost:base*2,need:8,duration:16,text:'Hold minst 12 folk, åtte trente og 75 lojalitet i åtte uker. Etterfølgerplanen sikrer en annen vei til Gudfar og arven din.'};
 if(kind==='contest'&&e.effects.some(f=>f.source==='contest'&&f.city===city&&f.until>s.week))return null;
 if(kind==='contest'&&s.cities.includes(city)&&city>0&&b.level>=1&&!s.lords[city].deals)return {kind,city,path:'',title:'Maktkampen om '+G.CITIES[city].name,cost:base,need:6,duration:12,text:'Seks leverte ruteoppgjør med lagstyrke ≥75 % av rivalens. Seier: −30 rivalpress og +30 % ruteetterspørsel i 26 uker. Seier og nederlag koster folk; andre rivaler får +8 press.'};
 return null;
}
G.projectReady=function(s,q){const routes=s.routes.filter(r=>r.active&&r.city===q.city);if(q.kind==='charter'){if(q.city===2&&new Set(routes.map(r=>r.good)).size<2)return false;if(q.city===3&&!level(s,'logistics'))return false;if(q.city===4&&(!level(s,'counsel')||s.influence<80))return false;if(q.path==='control'&&(!routes.length||G.power(s)<G.enemy(s,q.city)*.6))return false;}if(q.kind==='contest'&&(!routes.length||G.power(s)<G.enemy(s,q.city)*.75))return false;if(q.kind==='succession'&&(s.crew.members<12||s.crew.trained<8||s.crew.loyalty<75))return false;if(q.kind==='national'&&s.cities.filter(c=>c>0&&state(s).charters[c]&&s.branches[c].level===3&&s.branches[c].pressure<60).length<3)return false;return true;};
G.projectQuote=(s,k,c=0,p='')=>project(s,k,c,p);
G.availableProjects=s=>{const out=[];for(const c of s.cities.filter(c=>c>0))for(const p of ['partnership','control']){const q=project(s,'charter',c,p);if(q)out.push(q);}for(const k of ['national','succession']){const q=project(s,k,0,'');if(q)out.push(q);}for(const c of s.cities.filter(c=>c>0)){const q=project(s,'contest',c,'');if(q)out.push(q);}return out;};
function loseCrew(s,count){const n=Math.min(s.crew.members,count);s.crew.members-=n;s.crew.trained=Math.min(s.crew.members,Math.max(0,s.crew.trained-Math.ceil(n/2)));s.crew.fatigue=clamp(s.crew.fatigue+15);return n;}
function finish(s,won){const e=state(s),o=e.operation;let extra='';if(won){e.successes++;if(o.kind==='charter'){e.charters[o.city]=o.path;s.influence+=12;s.branches[o.city].pressure=clamp(s.branches[o.city].pressure-15);if(o.path==='control')extra=' '+loseCrew(s,1+(o.city%3))+' folk er ute av laget.';else s.crew.loyalty=clamp(s.crew.loyalty+5);}if(o.kind==='national')e.legacy.national=true;if(o.kind==='succession')e.legacy.succession=true;if(o.kind==='contest'){s.branches[o.city].pressure=clamp(s.branches[o.city].pressure-30);e.effects.push({source:'contest',city:o.city,until:s.week+26,demand:1.3});for(const c of s.cities)if(c!==o.city)s.branches[c].pressure=clamp(s.branches[c].pressure+8);extra=' '+loseCrew(s,2)+' folk er ute av laget.';s.influence+=15;}}
 else{e.setbacks++;if(o.kind==='contest'||o.path==='control')extra=' '+loseCrew(s,3)+' folk er ute av laget.';s.crew.loyalty=clamp(s.crew.loyalty-5);s.influence=Math.max(0,s.influence-5);}
 const result={title:o.title,kind:o.kind,city:o.city,path:o.path,won,week:s.week,progress:o.progress,need:o.need};e.history.unshift(result);e.history=e.history.slice(0,40);e.operation=null;note(s,(won?'PROSJEKT FULLFØRT: ':'PROSJEKT MISLYKTES: ')+o.title+'.'+extra);G.refreshRank(s);
}
function qualified(s,o){if(!G.projectReady(s,o))return false;if(o.kind==='charter'&&o.path==='partnership')return s.branches[o.city].pressure<=55&&s.crew.loyalty>=65;
 if(o.kind==='national')return s.cities.filter(c=>c>0&&state(s).charters[c]&&s.branches[c].pressure<60&&s.branches[c].level===3).length>=3&&s.crew.loyalty>=65;
 if(o.kind==='succession')return s.crew.members>=12&&s.crew.trained>=8&&s.crew.loyalty>=75;
 return G.power(s)>=G.enemy(s,o.city)*(o.kind==='contest'?.75:.6)&&s.ledger.some(r=>r.week===s.week&&r.route&&r.gross>0&&s.routes.some(t=>t.id===r.route&&t.city===o.city));}
function council(s){const e=state(s);if(s.event||s.ended||s.rankLevel<3||s.cities.length<2||s.week<e.nextCouncil)return;e.firstCouncil??=s.week;const cities=s.cities.filter(c=>c>0),city=cities[e.serial%cities.length];s.event={kind:'empire',id:e.serial%4,city};e.serial++;}
G.onStrategicWeek=function(s){const e=state(s);if(e.lastWeek===s.week)return;e.lastWeek=s.week;
 for(const r of s.ledger.filter(r=>r.week===s.week)){const key=r.route?'routes':r.title.startsWith('Salgsapparat')?'distribution':r.title==='Kvartalsavtale / oppgjør'?'contracts':r.title==='Lokaler og laget'?'local':null;if(key)e.revenue[key]+=r.gross||0;}
 e.effects=e.effects.filter(f=>f.until>s.week);
 for(const b of Object.values(s.branches))b.pressure=clamp(b.pressure+(e.doctrine==='dominion'?.7:e.doctrine==='federation'?-.6:0)-level(s,'counsel')*.3);
 if(e.doctrine==='federation')s.crew.loyalty=clamp(s.crew.loyalty+.5);
 if(s.rankLevel>=3&&s.managers>=2&&e.response!=='manual'&&s.heat>=55){const gross=s.ledger.filter(r=>r.week===s.week&&(r.route||r.title.startsWith('Salgsapparat'))).reduce((n,r)=>n+(r.gross||0),0),fee=Math.min(s.cash,Math.max(2000,Math.round(gross*.025)));s.cash-=fee;s.heat=48;record(s,{title:'Driftslederne / diskret beredskap',gross:0,cost:fee,net:-fee,status:'Søkelys tilbake til 48 · 2,5 % ukentlig handelsbrutto, minst 2 000 kr'});}
 s.crew.fatigue=clamp(s.crew.fatigue-level(s,'academy'));
 if(s.week%4===0)s.crew.trained=Math.min(s.crew.members,s.crew.trained+level(s,'academy'));
 if(e.operation){if(qualified(s,e.operation))e.operation.progress++;if(e.operation.progress>=e.operation.need)finish(s,true);else if(s.week>=e.operation.due)finish(s,false);}
 council(s);G.refreshRank(s);
};
G.eventInfo=function(s){if(s.event?.kind!=='empire')return prior.eventInfo(s);const e=state(s),c=s.event.city,name=G.CITIES[c].name,cost=Math.round(Math.max(50000,G.income(s)*3,G.netWorth(s)*.025)),strong=G.power(s)>=G.enemy(s,c)*.6;
 const cases=[
 {title:name+': partnerne krever en stol',text:'De lokale lederne vil eie en del av veksten. En investering kjøper ro. Selvstyre koster margin. Et ultimatum krever et lag som tåler svaret.',choices:[{name:'Invester i felleskapet',cash:-cost,influence:5,loyalty:6,pressure:-20},{name:'Gi lokalt selvstyre i 13 uker',cash:0,influence:8,loyalty:4,pressure:-15,effect:{price:.88,demand:1.15}},{name:'Sett makt bak kravet',cash:0,influence:strong?10:-6,loyalty:-5,pressure:strong?-18:18,loss:strong?1:3,heat:8}]},
 {title:'Capex vil ha enerett i '+name,text:'Et større volum er fristende. Eksklusivitet gir høyere margin i byen, men flytter risiko og rivalpress over på resten av nettverket.',choices:[{name:'Signer enerett i 13 uker',cash:0,influence:4,loyalty:-3,pressure:12,effect:{price:1.25,risk:.06}},{name:'Bygg flere mindre partnere',cash:-cost,influence:8,loyalty:4,pressure:-12,effect:{demand:1.25,risk:-.02}},{name:'Avslå og behold handlefriheten',cash:0,influence:-2,loyalty:2,pressure:0}]},
 {title:'Lederne vil flytte makt fra Stavanger',text:'En felles sentral gir kapasitet, men distanse til folkene. Lokal kontroll gir ro. Valget varer i 13 uker; vanlig vareflyt fortsetter automatisk.',choices:[{name:'Samle driften sentralt',cash:-cost,influence:5,loyalty:-6,pressure:8,effect:{demand:1.4}},{name:'La byen styre sin egen vekst',cash:0,influence:6,loyalty:7,pressure:-18,effect:{price:.9}},{name:'Krev mer av eksisterende lag',cash:0,influence:2,loyalty:-9,pressure:5,effect:{price:1.1},fatigue:20}]},
 {title:name+': rivalen tester grensene',text:'En rival presser lokale avtaler. Du kan kjøpe et varig pusterom, dele markedet midlertidig, eller bruke laget. Kostnader og tap skjer selv om kassa er stor.',choices:[{name:'Forhandle fram et forlik',cash:-cost,influence:6,loyalty:3,pressure:-25},{name:'Del markedet i 13 uker',cash:0,influence:3,loyalty:0,pressure:-20,effect:{demand:.8,risk:-.03}},{name:strong?'Svar med et avgrenset oppgjør':'Svar med et underlegent lag',cash:0,influence:strong?12:-8,loyalty:-4,pressure:strong?-25:20,loss:strong?2:4,heat:10}]}
 ];const result=cases[s.event.id];return {...result,speaker:G.LORDS[c].name,choices:result.choices.map(x=>({...x,detail:`${x.pressure>0?'+':''}${x.pressure} rivalpress i ${name}${x.loss?' · '+Math.min(s.crew.members,x.loss)+' folk går tapt':''}${x.heat?' · +'+x.heat+' søkelys':''}${x.effect?' · avtalen varer 13 uker':''}`}))};
};
G.act=function(s,type,arg){G.upgrade(s);const e=state(s);if(s.ended)return 'Runden er avsluttet.';
 if(s.event?.kind==='empire'&&['choice','defer'].includes(type)){if(type==='defer'){s.branches[s.event.city].pressure=clamp(s.branches[s.event.city].pressure+8);e.setbacks++;note(s,'Maktrådet utsatt. +8 lokalt rivalpress.');}else{const c=G.eventInfo(s).choices[Number(arg)];if(!c||s.cash+c.cash<0)return 'Velg en avgjørelse du har råd til.';s.cash+=c.cash;s.influence=Math.max(0,s.influence+c.influence);s.crew.loyalty=clamp(s.crew.loyalty+c.loyalty);s.branches[s.event.city].pressure=clamp(s.branches[s.event.city].pressure+c.pressure);if(c.loss)loseCrew(s,c.loss);s.heat=clamp(s.heat+(c.heat||0));s.crew.fatigue=clamp(s.crew.fatigue+(c.fatigue||0));if(c.effect)e.effects.push({...c.effect,city:s.event.city,until:s.week+13});record(s,{title:'Maktrådet / '+c.name,gross:0,cost:-c.cash,net:c.cash,status:'Strategisk valg'});e.decisions++;note(s,'MAKTRÅDET: '+c.name+'.');}s.event=null;e.nextCouncil=s.week+8+(e.serial%3)*2;G.refreshRank(s);return 'Avgjørelsen former nettverket videre.';}
 if(type==='responsePolicy'){if(!['discreet','manual'].includes(arg))return 'Ukjent beredskap.';if(s.event||s.trip)return 'Fullfør avgjørelsen eller reisen først.';e.response=arg;return arg==='discreet'?'Driftslederne håndterer høyt søkelys mot synlig kostnad.':'Du håndterer søkelyset selv.';}
 if(type==='productionPolicy'){if(!['demand','volume'].includes(arg))return 'Ukjent produksjonsplan.';if(s.event||s.trip)return 'Fullfør avgjørelsen eller reisen først.';s.productionMode=arg;return arg==='demand'?'Lederne tilpasser produksjonen til markedet.':'Full kapasitet valgt. Overskudd selges til fallende pris.';}
 if(['doctrine','institution','project','abandonProject'].includes(type)){if(s.event||s.trip)return 'Fullfør avgjørelsen eller reisen først.';if(s.rankLevel<3)return 'Maktrådet åpner som Bakmann.';
 if(type==='doctrine'){const d=G.DOCTRINES.find(d=>d.id===arg);if(!d)return 'Ukjent styringsform.';if(e.doctrine===arg)return 'Styringsformen er allerede valgt.';if(e.doctrine&&(s.week-e.lastDoctrine<13||s.influence<10))return 'Bytte krever 10 innflytelse og 13 uker siden forrige valg.';if(e.doctrine){s.influence-=10;s.crew.loyalty=clamp(s.crew.loyalty-4);}e.doctrine=arg;e.lastDoctrine=s.week;note(s,'STYRINGSFORM: '+d.name);return d.name+' er valgt. Vareflyten fortsetter automatisk.';}
 if(type==='institution'){const i=G.INSTITUTIONS.find(i=>i.id===arg),n=level(s,arg);if(!i||n>=3)return 'Institusjonen er fullt utviklet.';const cost=Math.round(i.cost*Math.pow(2,n));if(s.cash<cost||s.influence<20||s.managers<2)return 'Krever kapital, 20 innflytelse og to ledere. Bruker 8 innflytelse.';s.cash-=cost;s.influence-=8;e.institutions[arg]=n+1;record(s,{title:i.name+' / investering',gross:0,cost,net:-cost,status:'Nivå '+(n+1)});G.refreshRank(s);return i.name+' er på nivå '+(n+1)+'. Fast drift +1 500 kr / uke.';}
 if(type==='abandonProject'){if(!e.operation)return 'Ingen prosjekt pågår.';finish(s,false);return 'Prosjektet er avsluttet uten refusjon.';}
 if(type==='project'){if(e.operation)return 'Fullfør eller avslutt det aktive prosjektet først.';const q=project(s,arg?.kind,arg?.city,arg?.path);if(!q)return 'Prosjektet er ikke tilgjengelig.';if(s.cash<q.cost||s.influence<15)return 'Krever prosjektkapital og 15 innflytelse. Bruker 5 innflytelse.';s.cash-=q.cost;s.influence-=5;e.operation={...q,start:s.week,due:s.week+q.duration,progress:0};record(s,{title:q.title+' / prosjektstart',gross:0,cost:q.cost,net:-q.cost,status:q.need+' måloppgjør'});return q.title+' er i gang. Målene følges automatisk.';}}
 const result=prior.act(s,type,arg);return result;
};
G.outcome=s=>{const o=prior.outcome(s),e=state(s);return {...o,country:o.country&&!!e.legacy.national,exit:o.exit&&!!e.legacy.succession,won:s.goal==='country'?o.country&&!!e.legacy.national:s.goal==='exit'?o.exit&&!!e.legacy.succession:o.coast};};
G.valid=s=>{try{if(!prior.valid(s))return false;if(!s.empire)return true;const e=s.empire;return e.version===1&&(e.doctrine===null||G.DOCTRINES.some(d=>d.id===e.doctrine))&&Number.isFinite(e.nextCouncil)&&Number.isInteger(e.serial)&&e.serial>=0&&Number.isInteger(e.decisions)&&e.decisions>=0&&Number.isInteger(e.successes)&&e.successes>=0&&Number.isInteger(e.setbacks)&&e.setbacks>=0&&G.INSTITUTIONS.every(i=>Number.isInteger(e.institutions[i.id]||0)&&(e.institutions[i.id]||0)>=0&&(e.institutions[i.id]||0)<=3)&&Object.entries(e.charters).every(([c,p])=>s.cities.includes(Number(c))&&['partnership','control'].includes(p))&&Array.isArray(e.history)&&Array.isArray(e.effects)&&e.effects.every(f=>(f.city===null||s.cities.includes(f.city))&&Number.isFinite(f.until)&&['price','demand'].every(k=>f[k]===undefined||(Number.isFinite(f[k])&&f[k]>0))&&(f.risk===undefined||Number.isFinite(f.risk)))&&(!e.operation||(['charter','national','succession','contest'].includes(e.operation.kind)&&s.cities.includes(e.operation.city)&&Number.isInteger(e.operation.progress)&&e.operation.progress>=0&&Number.isInteger(e.operation.need)&&e.operation.need>0&&Number.isInteger(e.operation.due)))&&(!s.event||s.event.kind!=='empire'||(Number.isInteger(s.event.id)&&s.event.id>=0&&s.event.id<4&&s.cities.includes(s.event.city)&&s.event.city>0));}catch(_){return false;}};
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

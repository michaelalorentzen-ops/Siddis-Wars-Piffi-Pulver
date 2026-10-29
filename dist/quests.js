(function(root){
'use strict';
const G=root.Game,lines=G.QUEST_LINES,items=G.QUEST_ITEMS;
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
const contact=id=>G.storyContacts.some(c=>c.id===id);
const flags=new Set(lines.flatMap(q=>q.steps.flatMap(t=>t.choices.map(c=>c.flag).filter(Boolean))));
function migrate(s){
 // Missing fields are legacy saves. Present malformed fields remain invalid;
 // migration must not turn a corrupt import into a different campaign.
 if(['quests','story','items'].some(k=>s[k]!=null&&!plain(s[k])))return;
 if(s.quests?.lines!=null&&!plain(s.quests.lines))return;
 if(s.story&&['relationships','flags'].some(k=>s.story[k]!=null&&!plain(s.story[k])))return;
 if(s.items?.owned!=null&&!Array.isArray(s.items.owned))return;
 s.quests??={version:1,lines:{}};
 s.quests.lines??={};
 s.story??={};s.story.relationships??={};s.story.flags??={};
 s.items??={};s.items.owned??=[];
 for(const c of G.storyContacts)s.story.relationships[c.id]??=0;
 for(const q of lines)s.quests.lines[q.id]??={step:0,status:s.rankLevel>=q.rank?'active':'locked',choices:[],announced:-1};
}
function validate(s){try{
 // Raw imports are validated before upgrade. Only a wholly absent quest
 // subsystem is legacy; present partial or malformed state is rejected.
 const legacy=s.quests===undefined&&s.story?.relationships===undefined&&s.items?.owned===undefined&&![...flags].some(id=>s.story?.flags&&Object.hasOwn(s.story.flags,id));
 if(legacy)return (s.story===undefined||plain(s.story)&&(s.story.flags===undefined||plain(s.story.flags)))&&(s.items===undefined||plain(s.items));
 if(!plain(s.quests)||s.quests.version!==1||!plain(s.quests.lines)||Object.keys(s.quests.lines).length!==lines.length||!plain(s.story)||!plain(s.story.relationships)||!plain(s.story.flags)||!plain(s.items)||!Array.isArray(s.items.owned)||s.items.owned.length>Object.keys(items).length||new Set(s.items.owned).size!==s.items.owned.length||!s.items.owned.every(id=>Object.hasOwn(items,id)))return false;
 if(!Object.entries(s.story.relationships).every(([id,n])=>contact(id)&&Number.isInteger(n)&&n>=-5&&n<=5)||!G.storyContacts.every(c=>Object.hasOwn(s.story.relationships,c.id)))return false;
 // Other systems may own additional story flags; our branch flags must stay boolean.
 if([...flags].some(id=>Object.hasOwn(s.story.flags,id)&&typeof s.story.flags[id]!=='boolean'))return false;
 return lines.every(q=>{const a=s.quests.lines[q.id];return plain(a)&&Number.isInteger(a.step)&&a.step>=0&&a.step<=q.steps.length&&['locked','active','done'].includes(a.status)&&(a.status==='done')===(a.step===q.steps.length)&&(a.status!=='locked'||a.step===0)&&Number.isInteger(a.announced)&&a.announced>=-1&&a.announced<a.step+1&&Array.isArray(a.choices)&&a.choices.length===a.step&&a.choices.every((h,i)=>plain(h)&&q.steps[i].choices.some(c=>c.id===h.id)&&Number.isInteger(h.day)&&h.day>=0&&h.day<=s.day&&(i===0||h.day>=a.choices[i-1].day)&&Number.isSafeInteger(h.cost)&&h.cost>=0);});
 }catch(_){return false;}}
function requirement(s,need){
 const counts={trips:s.trips||0,sales:s.sales||0,crew:s.crew.members,trained:s.crew.trained,routes:s.routes.length,districts:s.districts.length,businesses:s.businesses.length,cities:s.cities.length,minLoyalty:s.crew.loyalty};
 const labels={trips:'innkjøpsreiser',sales:'salg',crew:'folk i laget',trained:'trente folk',routes:'faste ruter',districts:'distrikter',businesses:'bedrifter',cities:'byer',minLoyalty:'lojalitet'};
 for(const [k,v]of Object.entries(need)){
  if(k==='maxHeat'&&s.heat>v)return 'Senk søkelyset til '+v+' (nå '+Math.round(s.heat)+').';
  if(k==='city'&&!s.cities.includes(v))return 'Etabler '+G.CITIES[v].name+'.';
  if(k==='routeCity'&&!s.routes.some(r=>r.city===v))return 'Opprett en rute til '+G.CITIES[v].name+'.';
  if(Object.hasOwn(counts,k)&&counts[k]<v)return labels[k]+': '+Math.floor(counts[k])+' / '+v+'.';
 }
 return null;
}
function quote(s,q,t,c){const speaker=c.contact||t.speaker||q.contact,baseCost=c.cost||0,cost=Math.round(baseCost*(1-s.story.relationships[speaker]*.04));return {...c,baseCost,cost,contact:speaker,itemInfo:c.item?items[c.item]:null};}
function info(s,id){
 const q=lines.find(q=>q.id===id);if(!q)return null;
 const a=s.quests.lines[id],t=q.steps[a.step];
 const reason=a.status==='locked'?'Åpner ved rang '+q.rank+'.':a.status==='done'?'Historien er fullført.':requirement(s,t.need);
 const current=t?{...t,choices:t.choices.map(c=>{const v=quote(s,q,t,c),r=reason||(G.END_DAY-s.day<v.days?'For få dager igjen til dette valget.':s.cash<v.cost?'Du trenger '+v.cost.toLocaleString('nb-NO')+' kr.':null);return {...v,allowed:!r,reason:r};})}:null;
 return {id:q.id,title:q.title,contact:q.contact,intro:q.intro,rank:q.rank,status:a.status,step:a.step,total:q.steps.length,current,objective:t?.objective||'Fullført',ready:!reason,reason,history:a.choices.map((h,i)=>({title:q.steps[i].title,...h,label:q.steps[i].choices.find(c=>c.id===h.id).label})),relationship:s.story.relationships[q.contact]};
}
G.questInfo=(s,id)=>info(s,id);
G.questList=s=>lines.map(q=>info(s,q.id));
G.itemModifiers=function(s){
 const out={income:1,travelCost:1,heatGain:1,trainingCost:1,salePrice:1,routeReliability:1};
 for(const id of s.items?.owned||[])for(const [k,v]of Object.entries(items[id]?.modifiers||{}))out[k]*=v;
 for(const k of Object.keys(out))out[k]=clamp(out[k],.65,1.5);
 return out;
};
function announce(s){
 for(const q of lines){const a=s.quests.lines[q.id];if(a.status==='locked'&&s.rankLevel>=q.rank)a.status='active';if(a.status!=='active')continue;const t=q.steps[a.step];if(a.announced===a.step||requirement(s,t.need))continue;a.announced=a.step;G.notifyScene(s,{id:'quest:'+q.id+':'+a.step,title:t.title,speaker:t.speaker,text:t.text,kind:'quest',quest:q.id,objective:t.objective});}
}
function guard(s,arg){
 if(!plain(arg)||typeof arg.quest!=='string'||typeof arg.choice!=='string')return 'Velg et gyldig oppdrag og svar.';
 const q=info(s,arg.quest);if(!q)return 'Ukjent oppdrag.';
 if(q.reason)return q.reason;
 const c=q.current.choices.find(c=>c.id===arg.choice);if(!c)return 'Velg et gyldig svar.';
 return c.reason;
}
function choose(s,arg){
 // Keep the handler safe if invoked directly by an integration or diagnostic tool.
 const denied=guard(s,arg);if(denied)return denied;
 const q=lines.find(q=>q.id===arg.quest),a=s.quests.lines[q.id],t=q.steps[a.step],c=quote(s,q,t,t.choices.find(c=>c.id===arg.choice)),start=s.day,cash=s.cash;
 s.cash+= (c.cash||0)-c.cost;
 s.rep+=c.rep||0;s.influence=Math.max(0,s.influence+(c.influence||0));
 G.addHeat(s,c.heat||0);s.crew.loyalty=clamp(s.crew.loyalty+(c.loyalty||0),0,100);
 s.story.relationships[c.contact]=clamp(s.story.relationships[c.contact]+(c.relation||0),-5,5);
 if(c.flag)s.story.flags[c.flag]=true;
 if(c.item&&!s.items.owned.includes(c.item))s.items.owned.push(c.item);
 a.choices.push({id:c.id,day:s.day,cost:c.cost});a.step++;
 if(a.step===q.steps.length)a.status='done';
 // Consequences are committed once before time passes; interrupted weeks cannot duplicate a reward.
 G.elapse(s,c.days);
 G.refreshRank(s);
 s.summary={days:s.day-start,weeks:(s.day-start)/7,net:s.cash-cash,stop:c.text};
 if(Array.isArray(s.ledger)){s.ledger.unshift({week:s.week,day:s.day,title:'Historie / '+t.title,gross:c.cash||0,cost:c.cost,net:(c.cash||0)-c.cost,status:c.label});s.ledger=s.ledger.slice(0,120);}
 G.notifyScene(s,{id:'quest-result:'+q.id+':'+a.step,title:a.status==='done'?q.title+' · fullført':t.title,speaker:c.contact,text:c.text,kind:'questResult',quest:q.id,item:c.item||null});
 if(G.note)G.note(s,c.text);
 announce(s);
 return c.text+(c.item?' Du fikk '+items[c.item].name+'.':'');
}
G.registerSystem({id:'quests',migrate,validate,hooks:{afterAction:announce,week:announce,rank:announce},actions:{questChoice:{guard,handler:choose}}});
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

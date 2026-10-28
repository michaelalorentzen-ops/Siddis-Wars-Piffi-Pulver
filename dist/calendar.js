(function(root){
'use strict';
const G=root.Game,market=G.market,demand=G.demand,quote=G.quote,DAY=86400000,epoch=Date.UTC(2026,0,1);
const day=(y,m,d)=>Math.round((Date.UTC(y,m-1,d)-epoch)/DAY);
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;return day(y,Math.floor(n/31),n%31+1);}
const events=[];for(let y=2026;y<=2036;y++){const e=easter(y);events.push({id:'easter-'+y,name:'Påske',from:e-7,to:e+1,kind:'easter',description:'Roligere gater og lavere lokal etterspørsel.'},{id:'may17-'+y,name:'17. mai',from:day(y,5,15),to:day(y,5,19),kind:'may17',description:'Feiring i byen gir høyere etterspørsel.'},{id:'christmas-'+y,name:'Jul og nyttår',from:day(y,12,18),to:day(y,12,31),kind:'christmas',description:'Høysesong for sprit og tobakk.'});}events.sort((a,b)=>a.from-b.from);
G.calendarEvents=()=>events.map(e=>({...e}));
G.activeCalendar=(s,at=s.day)=>events.filter(e=>e.from<=at&&at<=e.to);
G.tripCalendar=function(s,origin){const o=G.ORIGINS[origin];if(!o)return {arrival:s.day,events:[]};const arrival=s.day+o.days;return {arrival,events:events.filter(e=>e.from<arrival&&e.to>=s.day).map(e=>({...e,entire:e.from>=s.day&&e.to<arrival}))};};
G.calendarEffect=function(s,good,at=s.day){let price=1,quantity=1;for(const e of G.activeCalendar(s,at)){if(e.kind==='easter'){price*=.96;quantity*=.55;}if(e.kind==='may17'){price*=good===0?1.08:1.02;quantity*=1.5;}if(e.kind==='christmas'){price*=[0,1].includes(good)?1.12:1;quantity*=[0,1].includes(good)?1.65:1.15;}}return {price,quantity};};
G.market=function(s,i){const m=market({...s,soldToday:{}},i),fx=G.calendarEffect(s,i),used=s.soldToday.day===s.day?(s.soldToday[i]||0):0;return {...m,price:Math.max(1,Math.round(m.price*fx.price)),demand:Math.max(0,Math.round((m.demand+used)*fx.quantity)-used),calendar:G.activeCalendar(s).map(e=>e.name)};};
G.demand=function(s,city,good,week=s.week+1){return Math.max(1,Math.round(demand(s,city,good,week)*G.calendarEffect(s,good,week*7).quantity));};
G.quote=function(s,r,week=s.week+1){const q=quote(s,r,week),fx=G.calendarEffect(s,r.good,week*7),p=Math.round(q.p*fx.price),gross=Math.round((q.full+q.discounted*.6)*p);return {...q,p,gross,net:gross-q.supply-q.freight,expected:Math.round(gross*(1-q.risk)+q.supply*q.refund*q.risk-q.supply-q.freight)};};
if(typeof module!=='undefined')module.exports=G;
})(typeof window!=='undefined'?window:globalThis);

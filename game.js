'use strict';
const KEY='pyegup-dorm-v2',OLD='pyegup-dorm-v1',OFFLINE=.07,MAX_AWAY=8*3600;
const $=id=>document.getElementById(id);
const friendNames=['정태우','추주형','박지훈','정다민','노현승','이세민','홍석진','구준수','천재우','윤서준','이준영','윤지호','차지훈','조서현','송창빈','우도현','나단비'];
const friendImages=friendNames.map((_,i)=>'assets/friends/friend'+String(i+1).padStart(2,'0')+'.png');
const friendPrices=[1e4,5e4,1e5,5e5,1e6,5e6,1e7,5e7,1e8,1e10,5e10,1e11,1e12,1e13,1e14,1e15,5e17];
const friendBonuses=[5,7,10,14,19,25,40,80,200,600,1000,1500,2000,2500,3000,4000,5000];
const giftNames=['크레이지 111에서 훔친 축구화','현대청운중에서 훔친 축구공','샘성에서 훔친 노트북','치과에서 훔친 치아 미백제','윤서준 사물함에서 훔친 가글린','천재우 신발장에서 훔친 깔창','다잇소에서 훔친 가발','안방 화장실에서 훔쳐온 제모크림','이세민 기숙사에서 훔친 키높이 신발','박태양 옷장에서 훔친 옷','여기저기서 훔친 여자의 마음','지성쌤한테 뜯어온 농구공','한의원에서 훔친 키크는 약','입마개','조상한테 뺏긴 남고딩 영혼','여자 정독실에서 훔친 베개','진수의 마음'];
const giftPrices=[5e11,6e11,7e11,8e11,9e11,1e12,5e12,1e13,5e13,1e14,2e14,1e17,1e18,1e19,1e20,1e21,1e22];
const giftBonuses=[100,150,200,250,300,350,400,500,600,700,1000,3000,4000,5000,6000,7000,10000];
const zoneNames=['여자 화장실','탈의실','DELL실','정독실','학년실','체육관','교장실'];
const zonePrices=[2e8,5e8,1e9,2e9,5e9,1e10,1e11],zoneRise=[3e5,5e5,1e6,2e6,3e6,5e6,7e6];
const collectibleNames=['양말 한 짝','청운티','훔친 택배','왼쪽 에어팟','갈색 여치','기숙사 마스터 키','매치포인트 동티'];
const collectiblePrices=[2e11,3e11,4e11,5e11,6e11,7e11,4e13];
const clubNames=['지니어스','시나브로','시냅스','인터폴','라포르','듀스','LOD','쇼군','HBS','RCY','보늘바라기','HCUtube','ILS','CBP','매치포인트'];
const clubPrices=[1e13,2e13,3e13,5e13,1e14,2e14,3e14,5e14,1e15,2e15,3e15,5e15,1e16,2e16,3e16];
const placeNames=['힐튼 모텔','버거킹','진짜배기','봉구스밥버거','속초국밥','화목한 내과','윤이비인후과','차차','현대 아트센터','일산지'];
const placePrices=[1e15,5e15+1e8+5676e4,1e16,5e16,1e17,99e16+9999e12+9573e8,1e19,2e19,3e19+2233e8+3823e4,5e19];
const powerNames=['반장','학생회장','기숙사 사감','학년부장','교감','교장','현대청운고 이사장'];
const powerPrices=[1e20,2e20,3e20,5e20,1e21,2e21,3e21],powerIncome=[1e14,2e14,3e14,5e14,1e15,2e15,3e15];
const relics=[{name:'주인 없는 청운티',price:1e7,type:'tap',bonus:.03},{name:'3년 묵은 양말',price:2e7,type:'auto',bonus:.05},{name:'정갈하게 부러진 옷걸이',price:4e7,type:'tap',bonus:.06},{name:'봉인된 너구리 스프',price:7e7,type:'auto',bonus:.08},{name:'김승훈의 갈색 여치',price:1e8,type:'all',bonus:.07}];
const titles={growth:['성장','터치 강화와 자동 수익을 키우세요.'],friends:['친구','이전 친구 Lv.10 달성 시 다음 친구 해금'],zones:['학교 구역','구매 후 가치가 초당 상승합니다.'],collect:['수집품','수집품을 모으고 되팔 수 있습니다.'],gifts:['친구들의 선물','해당 친구 Lv.30 달성 시 구매 가능'],clubs:['동아리 지배','동아리를 차례로 인수하세요.'],places:['학교 주변 시설','학교 주변 시설을 차례로 확보하세요.'],power:['학교 권력','최상위 초당 수익 콘텐츠'],relics:['유물','확인된 유물 5종만 우선 수록'],prestige:['재입학','레벨을 초기화하고 영구 보너스를 얻습니다.']};
const initial=()=>({money:0,total:0,runEarned:0,tapLevel:0,autoLevel:0,friends:Array(17).fill(0),zones:{},collect:{},gifts:[],clubs:[],places:[],power:[],relics:[],prestiges:0,mana:0,taps:0,last:Date.now()});
function load(){let raw;try{raw=JSON.parse(localStorage.getItem(KEY))}catch{};let s=initial();if(raw&&typeof raw==='object'){
 for(const k of ['money','total','runEarned','tapLevel','autoLevel','prestiges','mana','taps','last'])if(Number.isFinite(raw[k])&&raw[k]>=0)s[k]=raw[k];
 if(Array.isArray(raw.friends))s.friends=s.friends.map((_,i)=>Number.isFinite(raw.friends[i])?Math.max(0,Math.floor(raw.friends[i])):0);
 for(const k of ['gifts','clubs','places','power','relics'])if(Array.isArray(raw[k]))s[k]=[...new Set(raw[k].filter(x=>Number.isInteger(x)&&x>=0&&x<({gifts:17,clubs:15,places:10,power:7,relics:5}[k])))];
 for(const k of ['zones','collect'])if(raw[k]&&typeof raw[k]==='object')for(const [i,v] of Object.entries(raw[k]))if(Number.isInteger(+i)&&Number.isFinite(v)&&v>0)s[k][i]=v;
 }else{try{const old=JSON.parse(localStorage.getItem(OLD));if(old){s.money=Math.max(0,old.points||0);s.total=Math.max(0,old.totalEarned||0);s.runEarned=s.total;s.tapLevel=Math.max(0,old.tapUpgrades||0);s.autoLevel=Math.max(0,old.autoUpgrades||0);}}catch{}}
 return s;
}
let s=load(),tab='growth',lastFrame=Date.now(),lastTap=0,streak=0,renderAt=0;
const fmt=n=>{if(!Number.isFinite(n))return '매우 큰 수';if(n<10000)return Math.floor(n).toLocaleString('ko-KR');const units=[[1e20,'해'],[1e16,'경'],[1e12,'조'],[1e8,'억'],[1e4,'만']];for(const [v,u] of units){if(n>=v){const a=n/v;return (a>=100?Math.floor(a).toLocaleString('ko-KR'):a>=10?a.toFixed(1):a.toFixed(2)).replace(/\.0+$/,'')+u}}return Math.floor(n).toLocaleString('ko-KR')};
const safe=n=>Number.isFinite(n)?Math.max(0,n):Number.MAX_VALUE;
const level=()=>1+Math.floor(Math.sqrt(s.runEarned/25));
const tapCost=()=>safe(Math.floor(10*Math.pow(1.18,s.tapLevel)));
const friendCost=i=>safe(Math.floor(friendPrices[i]*Math.pow(1.18,s.friends[i])));
const baseTap=()=>((s.tapLevel+1)*(s.tapLevel+2)/2+1);
const bonusRelic=kind=>relics.reduce((m,r,i)=>s.relics.includes(i)&&(r.type===kind||r.type==='all')?m*(1+r.bonus):m,1);
const friendTapBonus=()=>s.friends.reduce((m,l,i)=>m+(l>=20?friendBonuses[i]/100:0),1);
const giftTapBonus=()=>s.gifts.reduce((m,i)=>m+giftBonuses[i]/100,1);
const permanent=()=>1+s.prestiges*.1;
const tapGain=()=>safe(Math.floor(baseTap()*friendTapBonus()*giftTapBonus()*bonusRelic('tap')*permanent()));
const friendIncome=()=>s.friends.reduce((m,l,i)=>m+(l?friendPrices[i]/100*Math.pow(1.12,l-1)*l:0),0);
const autoGain=()=>safe(Math.floor((friendIncome()+s.power.reduce((m,i)=>m+powerIncome[i],0))*bonusRelic('auto')*permanent()*(1+s.clubs.length*.02+s.places.length*.03)));
const combo=()=>streak>=940?1.5:streak>=610?1.4:streak>=280?1.3:streak>=80?1.2:1;
function earn(n){if(!Number.isFinite(n)||n<=0)return;s.money=safe(s.money+n);s.total=safe(s.total+n);s.runEarned=safe(s.runEarned+n)}
function spend(n){if(!Number.isFinite(n)||s.money<n)return false;s.money=Math.max(0,s.money-n);return true}
function msg(t){$('message').textContent=t}
function save(){s.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s));msg('저장 완료')}catch{msg('저장 공간 부족: 내보내기를 이용하세요')}}
function countOwned(k){return k==='friends'?s.friends.filter(x=>x>0).length:k==='zones'||k==='collect'?Object.keys(s[k]).length:(s[k]?.length||0)}
function addItem(name,description,buttonText,onClick,disabled=false,imageSrc=null){const row=document.createElement('div');row.className='item';const info=document.createElement('div');info.className='iteminfo';const title=document.createElement('strong');title.textContent=name;const p=document.createElement('p');p.textContent=description;info.append(title,p);if(imageSrc){const photo=document.createElement('img');photo.className='friend-photo';photo.src=imageSrc;photo.alt=name+' 사진';photo.loading='lazy';photo.onerror=()=>{photo.replaceWith(document.createTextNode(''))};row.append(photo)}const b=document.createElement('button');b.textContent=buttonText;b.disabled=disabled;b.addEventListener('click',onClick);row.append(info,b);$('items').append(row)}
function actionBuy(price,callback,label){if(!spend(price)){msg('짬이 부족합니다');return}callback();msg(label+' 완료!');save();render()}
function drawItems(){const el=$('items');el.replaceChildren();$('panelTitle').textContent=titles[tab][0];$('panelSub').textContent=titles[tab][1];$('panelCount').textContent=tab==='growth'||tab==='prestige'?'':countOwned(tab)+' / '+({friends:17,zones:7,collect:7,gifts:17,clubs:15,places:10,power:7,relics:5}[tab]||0);
 if(tab==='growth'){
 addItem('정신 차리기 · Lv.'+s.tapLevel,'터치 기본 수익 '+fmt(baseTap())+' 짬','강화 '+fmt(tapCost()),()=>actionBuy(tapCost(),()=>s.tapLevel++,'정신 차리기'),s.money<tapCost());
 const p=document.createElement('p');p.className='note';p.textContent='콤보는 연속 터치로 올라갑니다. 보너스 단계까지 필요한 터치 횟수는 표시하지 않습니다. 레벨 상한과 학년 구분은 없습니다.';el.append(p);
 }else if(tab==='friends')friendNames.forEach((name,i)=>{const l=s.friends[i],unlocked=i===0||s.friends[i-1]>=10,price=friendCost(i);addItem((i+1)+'. '+name+' · Lv.'+l,unlocked?`자동 수익 · Lv.20 터치 +${friendBonuses[i]}% · Lv.30 선물 해금`:`이전 친구 Lv.10 필요`,unlocked?'강화 '+fmt(price):'잠김',()=>actionBuy(price,()=>s.friends[i]++,'친구 강화'),!unlocked||s.money<price,friendImages[i])});
 else if(tab==='zones')zoneNames.forEach((name,i)=>{const owned=s.zones[i],value=owned?zonePrices[i]+zoneRise[i]*Math.max(0,(Date.now()-owned)/1000):0;addItem(name,owned?'현재 매각 가치 '+fmt(value)+' 짬 · 초당 +'+fmt(zoneRise[i]):'구매가 '+fmt(zonePrices[i])+' 짬 · 초당 가치 +'+fmt(zoneRise[i]),owned?'매각 '+fmt(value):'구매 '+fmt(zonePrices[i]),()=>{if(owned){earn(value);delete s.zones[i];msg(name+' 매각 완료');save();render()}else actionBuy(zonePrices[i],()=>s.zones[i]=Date.now(),name+' 구매')},!owned&&s.money<zonePrices[i])});
 else if(tab==='collect')collectibleNames.forEach((name,i)=>{const owned=s.collect[i],value=owned?collectiblePrices[i]*(1.0001+Math.max(0,(Date.now()-owned)/1000)*.0000001):0;addItem(name,owned?'매각 가치 '+fmt(value)+' 짬':'구매가 '+fmt(collectiblePrices[i])+' 짬',owned?'매각 '+fmt(value):'구매 '+fmt(collectiblePrices[i]),()=>{if(owned){earn(value);delete s.collect[i];msg(name+' 매각 완료');save();render()}else actionBuy(collectiblePrices[i],()=>s.collect[i]=Date.now(),name+' 구매')},!owned&&s.money<collectiblePrices[i])});
 else if(tab==='gifts')giftNames.forEach((name,i)=>{const owned=s.gifts.includes(i),unlock=s.friends[i]>=30;addItem(friendNames[i]+' · '+name,`터치 보너스 +${giftBonuses[i]}% · ${unlock?'해금':'친구 Lv.30 필요'}`,owned?'보유 중':unlock?'구매 '+fmt(giftPrices[i]):'잠김',()=>actionBuy(giftPrices[i],()=>s.gifts.push(i),name+' 획득'),owned||!unlock||s.money<giftPrices[i])});
 else if(tab==='clubs'||tab==='places'||tab==='power'){
 const names=tab==='clubs'?clubNames:tab==='places'?placeNames:powerNames,prices=tab==='clubs'?clubPrices:tab==='places'?placePrices:powerPrices;
 names.forEach((name,i)=>{const owned=s[tab].includes(i),unlock=i===0||s[tab].includes(i-1);const desc=tab==='power'?'초당 +'+fmt(powerIncome[i])+' 짬':tab==='clubs'?'보유 시 자동 수익 +2% (임시 밸런스)':'보유 시 자동 수익 +3% (임시 밸런스)';addItem(name,desc,owned?'보유 중':unlock?'구매 '+fmt(prices[i]):'이전 항목 필요',()=>actionBuy(prices[i],()=>s[tab].push(i),name+' 인수'),owned||!unlock||s.money<prices[i])});
 }else if(tab==='relics'){
 const p=document.createElement('p');p.className='note';p.textContent='유물 항아리 · 마나 '+fmt(s.mana)+'개. 터치 250회마다 마나 1개 획득. 유물 10종 중 세부 수치가 확인된 5종만 구현되어 있습니다. 마나 획득 규칙은 임시 설정입니다.';el.append(p);
 const b=document.createElement('button');b.className='bigbutton';b.textContent='유물 항아리 1회 뽑기 · 마나 3개';b.disabled=s.mana<3;b.onclick=()=>drawRelic(3,1);el.append(b);
 const b2=document.createElement('button');b2.className='bigbutton';b2.style.marginTop='8px';b2.textContent='유물 항아리 11회 뽑기 · 마나 30개';b2.disabled=s.mana<30;b2.onclick=()=>drawRelic(30,11);el.append(b2);
 relics.forEach((r,i)=>{const owned=s.relics.includes(i);addItem(r.name,`${r.type==='tap'?'터치':r.type==='auto'?'자동':'전체'} 수익 +${Math.round(r.bonus*100)}%`,owned?'보유 중':'구매 '+fmt(r.price),()=>actionBuy(r.price,()=>s.relics.push(i),r.name+' 획득'),owned||s.money<r.price)});
 }else if(tab==='prestige'){
 const can=level()>=300;const p=document.createElement('p');p.className='note';p.textContent=`현재 레벨 ${fmt(level())} · 재입학 ${s.prestiges}회 · 영구 수익 배율 ×${permanent().toFixed(1)}. 레벨 300부터 재입학할 수 있습니다. 재입학하면 짬, 친구, 구매한 콘텐츠, 일반 강화가 초기화되고 영구 수익 +10%를 얻습니다. 재입학 보너스 수치는 임시 설정입니다.`;el.append(p);
 const b=document.createElement('button');b.className='bigbutton';b.textContent=can?'재입학하기 · 영구 수익 +10%':'레벨 300에 해금';b.disabled=!can;b.onclick=()=>{if(!confirm('재입학하면 현재 짬과 구매 콘텐츠가 초기화됩니다. 계속할까요?'))return;const next=initial();next.total=s.total;next.prestiges=s.prestiges+1;next.mana=s.mana;s=next;streak=0;save();render()};el.append(b);
 }
}
function drawRelic(cost,n){if(s.mana<cost)return;s.mana-=cost;const got=[];for(let j=0;j<n;j++){const i=Math.floor(Math.random()*relics.length);if(!s.relics.includes(i)){s.relics.push(i);got.push(relics[i].name)}}msg(got.length?'유물 획득: '+got.join(', '):'이미 보유한 유물만 나왔습니다');save();render()}
function render(){const now=Date.now();$('money').textContent=fmt(s.money);$('income').textContent=fmt(autoGain());$('level').textContent=fmt(level());$('tapIncome').textContent=fmt(tapGain()*combo());$('lifetime').textContent=fmt(s.total);$('prestigeTag').textContent='재입학 '+s.prestiges+'회';$('comboTag').textContent='콤보 ×'+combo().toFixed(1);drawItems();renderAt=now}
function tap(ev){const now=Date.now();if(now-lastTap>1800)streak=0;streak++;lastTap=now;s.taps++;if(s.taps%250===0){s.mana++;msg('마나 1개 획득!')}const value=Math.floor(tapGain()*combo());earn(value);$('money').textContent=fmt(s.money);$('level').textContent=fmt(level());$('tapIncome').textContent=fmt(tapGain()*combo());$('comboTag').textContent='콤보 ×'+combo().toFixed(1);const f=document.createElement('span');f.className='float';f.textContent='+'+fmt(value);f.style.setProperty('--dx',(Math.random()*110-55)+'px');$('floaters').append(f);setTimeout(()=>f.remove(),700);if(now-renderAt>600)render()}
$('play').addEventListener('pointerdown',e=>{if(e.target.closest('a, input, select, textarea, button:not(#tap)'))return;e.preventDefault();tap(e)});
$('tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(!b)return;tab=b.dataset.tab;document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x===b));render()});
$('saveBtn').onclick=save;$('settingsBtn').onclick=()=>$('settings').showModal();
$('exportBtn').onclick=()=>{save();const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='폐급키우기-저장.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};
$('importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(!obj||!Array.isArray(obj.friends)||!Number.isFinite(obj.money))throw Error('잘못된 형식');if(!confirm('현재 저장 내용을 덮어쓸까요?'))return;localStorage.setItem(KEY,JSON.stringify(obj));s=load();$('settings').close();render();msg('저장 파일을 불러왔습니다')}catch{alert('올바른 저장 파일이 아닙니다')}e.target.value=''};
$('resetBtn').onclick=()=>{if(!confirm('모든 게임 진행 상황을 초기화할까요?'))return;localStorage.removeItem(KEY);localStorage.removeItem(OLD);s=initial();$('settings').close();render();msg('게임을 초기화했습니다')};
const away=Math.max(0,Math.min(MAX_AWAY,(Date.now()-s.last)/1000));if(away>10){const gained=Math.floor(autoGain()*away*OFFLINE);earn(gained);if(gained>0)msg('오프라인 수익 +'+fmt(gained)+' 짬 (7%)')}
lastFrame=Date.now();setInterval(()=>{const now=Date.now(),dt=Math.min(5,(now-lastFrame)/1000);lastFrame=now;if(now-lastTap>1800)streak=0;earn(autoGain()*dt);if(now-renderAt>950)render()},200);
setInterval(save,15000);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else{const now=Date.now(),away=Math.max(0,Math.min(MAX_AWAY,(now-s.last)/1000));if(away>5)earn(Math.floor(autoGain()*away*OFFLINE));lastFrame=now;render()}});window.addEventListener('pagehide',save);render();

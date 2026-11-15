'use strict';
// v0.1 저장 데이터를 그대로 읽습니다.
const SAVE_KEY='pyegup-dorm-v1',MAX_LEVEL=750,OFFLINE_RATE=.07,MAX_OFFLINE_SECONDS=28800;
const $=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('ko-KR');
const ARTIFACTS=[{id:'shirt',name:'주인 없는 청운티',price:1e7,kind:'tap',bonus:.03,desc:'터치 수익 +3%'},{id:'socks',name:'3년 묵은 양말',price:2e7,kind:'auto',bonus:.05,desc:'자동 수익 +5%'},{id:'hanger',name:'정갈하게 부러진 옷걸이',price:4e7,kind:'tap',bonus:.06,desc:'터치 수익 +6%'},{id:'soup',name:'봉인된 너구리 스프',price:7e7,kind:'auto',bonus:.08,desc:'자동 수익 +8%'},{id:'grasshopper',name:'김승훈의 갈색 여치',price:1e8,kind:'all',bonus:.07,desc:'전체 수익 +7%'}];
// 확인된 5종만 등록. 나머지 확정 유물 정보는 추후 추가합니다.
const ACHIEVEMENTS=[{id:'first',name:'첫 짬',desc:'처음으로 짬 획득',test:s=>s.totalEarned>=1},{id:'hundred',name:'짬 100개',desc:'누적 짬 100 획득',test:s=>s.totalEarned>=100},{id:'auto',name:'자동화 입문',desc:'자동 수익 첫 구매',test:s=>s.autoUpgrades>=1},{id:'grade2',name:'2학년 진급',desc:'251레벨 달성',test:s=>level(s)>=251},{id:'grade3',name:'3학년 진급',desc:'501레벨 달성',test:s=>level(s)>=501},{id:'max',name:'만렙',desc:'750레벨 달성',test:s=>level(s)>=750}];
const fresh=()=>({points:0,totalEarned:0,tapPower:1,autoPower:0,tapUpgrades:0,autoUpgrades:0,artifacts:[],achievements:[],lastSaved:Date.now()});
function load(){try{const old=JSON.parse(localStorage.getItem(SAVE_KEY));if(!old||typeof old!=='object')return fresh();const s=fresh();for(const k of ['points','totalEarned','tapPower','autoPower','tapUpgrades','autoUpgrades'])if(Number.isFinite(old[k])&&old[k]>=0)s[k]=Math.floor(old[k]);if(Number.isFinite(old.lastSaved))s.lastSaved=old.lastSaved;if(Array.isArray(old.artifacts))s.artifacts=old.artifacts.filter(x=>ARTIFACTS.some(a=>a.id===x));if(Array.isArray(old.achievements))s.achievements=old.achievements.filter(x=>ACHIEVEMENTS.some(a=>a.id===x));return s}catch{return fresh()}}
let state=load();const level=s=>Math.min(MAX_LEVEL,1+Math.floor(Math.sqrt(s.totalEarned/25)));const grade=l=>l<=250?'1학년':l<=500?'2학년':'3학년';const tapCost=()=>Math.floor(10*1.18**state.tapUpgrades);const autoCost=()=>Math.floor(25*1.22**state.autoUpgrades);
function multiplier(kind){return ARTIFACTS.filter(a=>state.artifacts.includes(a.id)&&(a.kind===kind||a.kind==='all')).reduce((v,a)=>v*(1+a.bonus),1)}
const tapIncome=()=>Math.max(1,Math.floor(state.tapPower*multiplier('tap')));const autoIncome=()=>Math.floor(state.autoPower*multiplier('auto'));
function unlock(){for(const a of ACHIEVEMENTS)if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);$('status').textContent='업적 달성: '+a.name+'!'}}
function render(){const l=level(state);$('points').textContent=fmt(state.points);$('level').textContent=fmt(l)+' / 750';$('grade').textContent=grade(l);$('per-second').textContent=fmt(autoIncome());$('tap-power').textContent=fmt(tapIncome());$('auto-power').textContent=fmt(autoIncome());$('tap-cost').textContent=fmt(tapCost());$('auto-cost').textContent=fmt(autoCost());$('buy-tap').disabled=state.points<tapCost();$('buy-auto').disabled=state.points<autoCost();const lower=(l-1)**2*25,upper=l===750?lower+1:l*l*25;$('level-progress').style.width=(l===750?100:Math.min(100,(state.totalEarned-lower)/(upper-lower)*100))+'%';$('artifact-count').textContent=`${state.artifacts.length}/${ARTIFACTS.length}`;$('achievement-count').textContent=`${state.achievements.length}/${ACHIEVEMENTS.length}`;renderArtifacts();renderAchievements()}
function renderArtifacts(){const shop=$('artifact-shop'),col=$('artifact-collection');shop.replaceChildren();col.replaceChildren();for(const a of ARTIFACTS){const owned=state.artifacts.includes(a.id),row=document.createElement('div');row.className='item';const info=document.createElement('div'),name=document.createElement('strong'),desc=document.createElement('p');name.textContent=a.name;desc.textContent=a.desc;info.append(name,desc);const btn=document.createElement('button');btn.textContent=owned?'보유 중':fmt(a.price)+' 짬';btn.disabled=owned||state.points<a.price;btn.addEventListener('click',()=>{if(state.artifacts.includes(a.id)||state.points<a.price)return;state.points-=a.price;state.artifacts.push(a.id);$('status').textContent='유물 획득: '+a.name;save();render()});row.append(info,btn);shop.append(row);const card=document.createElement('div');card.className='collect'+(owned?'':' locked');const title=document.createElement('b'),sub=document.createElement('span');title.textContent=owned?a.name:'???';sub.textContent=owned?a.desc:'미획득 유물';card.append(title,sub);col.append(card)}}
function renderAchievements(){const el=$('achievement-collection');el.replaceChildren();for(const a of ACHIEVEMENTS){const owned=state.achievements.includes(a.id),card=document.createElement('div');card.className='collect'+(owned?'':' locked');const title=document.createElement('b'),sub=document.createElement('span');title.textContent=owned?a.name:'?';sub.textContent=owned?a.desc:'미달성 업적';card.append(title,sub);el.append(card)}}
function save(){try{state.lastSaved=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch{$('status').textContent='저장 실패: 브라우저 저장 공간을 확인하세요.'}}
function earn(n){state.points+=n;state.totalEarned+=n;unlock();render()}
// Each new finger counts once. At most eight simultaneous contacts are credited.
const activeTouches=new Set();
const room=$('tap');
function showTapNumber(x,y,n){
  const rect=room.getBoundingClientRect();
  const span=document.createElement('span');
  span.className='float';span.textContent='+'+fmt(n);
  span.style.left=(x-rect.left)+'px';span.style.top=(y-rect.top)+'px';
  room.append(span);setTimeout(()=>span.remove(),650);
}
room.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(activeTouches.has(e.pointerId)||activeTouches.size>=8)return;
  activeTouches.add(e.pointerId);
  const n=tapIncome();earn(n);save();showTapNumber(e.clientX,e.clientY,n);
  const character=$('character-display');
  character.classList.remove('hit');void character.offsetWidth;character.classList.add('hit');
  if(e.cancelable)e.preventDefault();
});
function releasePointer(e){activeTouches.delete(e.pointerId)}
room.addEventListener('pointerup',releasePointer);
room.addEventListener('pointercancel',releasePointer);
room.addEventListener('lostpointercapture',releasePointer);
window.addEventListener('pointerup',releasePointer);
window.addEventListener('pointercancel',releasePointer);
window.addEventListener('blur',()=>activeTouches.clear());
$('buy-tap').addEventListener('click',()=>{const cost=tapCost();if(state.points<cost)return;state.points-=cost;state.tapUpgrades++;state.tapPower++;save();render()});$('buy-auto').addEventListener('click',()=>{const cost=autoCost();if(state.points<cost)return;state.points-=cost;state.autoUpgrades++;state.autoPower++;unlock();save();render()});
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+btn.dataset.tab))}));
$('reset').addEventListener('click',()=>{if(!confirm('현재 브라우저의 모든 게임 진행 상황을 초기화할까요?'))return;state=fresh();save();render();$('status').textContent='게임을 초기화했습니다.'});
function offlineReward(){const elapsed=Math.min(MAX_OFFLINE_SECONDS,Math.max(0,Math.floor((Date.now()-state.lastSaved)/1000)));const reward=Math.floor(elapsed*autoIncome()*OFFLINE_RATE);if(reward>0){state.points+=reward;state.totalEarned+=reward;unlock();$('status').textContent=`오프라인 보상 +${fmt(reward)} 짬 (7%)`}}
offlineReward();unlock();render();save();let lastTick=Date.now();setInterval(()=>{const now=Date.now();if(document.visibilityState!=='visible'){lastTick=now;return}const secs=Math.max(0,Math.floor((now-lastTick)/1000));if(secs){lastTick+=secs*1000;if(autoIncome()>0){earn(secs*autoIncome());save()}}},250);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();else{offlineReward();lastTick=Date.now();render();save()}});window.addEventListener('pagehide',save);

// Photo assets: if absent, keep a playable fallback.
const photo=$('character-photo');
photo.addEventListener('error',()=>{photo.hidden=true;$('avatar-fallback').hidden=false});
photo.addEventListener('load',()=>{photo.hidden=false;$('avatar-fallback').hidden=true});
const bg=new Image();
bg.onload=()=>{$('photo-placeholder').hidden=true};
bg.src='assets/backgrounds/dorm-room.jpg';


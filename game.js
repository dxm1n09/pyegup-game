'use strict';
const SAVE_KEY = 'pyegup-dorm-v1';
const MAX_LEVEL = 750;
const OFFLINE_RATE = 0.07;
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
const $ = (id) => document.getElementById(id);
const freshState = () => ({points:0,totalEarned:0,tapPower:1,autoPower:0,tapUpgrades:0,autoUpgrades:0,lastSaved:Date.now()});
function loadState(){
  try {
    const raw=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!raw || typeof raw!=='object')return freshState();
    const state=freshState();
    for(const key of ['points','totalEarned','tapPower','autoPower','tapUpgrades','autoUpgrades']){
      if(typeof raw[key]==='number' && Number.isFinite(raw[key]) && raw[key]>=0)state[key]=Math.floor(raw[key]);
    }
    if(typeof raw.lastSaved==='number' && Number.isFinite(raw.lastSaved))state.lastSaved=raw.lastSaved;
    return state;
  }catch{return freshState();}
}
let state=loadState();
const number=(n)=>Math.floor(n).toLocaleString('ko-KR');
const tapCost=()=>Math.floor(10*Math.pow(1.18,state.tapUpgrades));
const autoCost=()=>Math.floor(25*Math.pow(1.22,state.autoUpgrades));
// 누적 획득 짬을 기준으로 레벨을 계산합니다. 750레벨에서 멈춥니다.
const level=()=>Math.min(MAX_LEVEL,1+Math.floor(Math.sqrt(state.totalEarned/25)));
const grade=(lv)=>lv<=250?'1학년':lv<=500?'2학년':'3학년';
function render(){
  $('points').textContent=number(state.points);
  const lv=level();$('level').textContent=`${number(lv)} / 750`;
  $('grade').textContent=grade(lv);
  $('per-second').textContent=number(state.autoPower);
  $('tap-power').textContent=number(state.tapPower);
  $('auto-power').textContent=number(state.autoPower);
  $('tap-cost').textContent=number(tapCost());
  $('auto-cost').textContent=number(autoCost());
  $('buy-tap').disabled=state.points<tapCost();
  $('buy-auto').disabled=state.points<autoCost();
}
function earn(amount){state.points+=amount;state.totalEarned+=amount;render();}
function save(){try{state.lastSaved=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{$('status').textContent='저장에 실패했습니다. 브라우저 저장 공간을 확인하세요.';}}
$('tap').addEventListener('click',()=>{earn(state.tapPower);save();});
$('buy-tap').addEventListener('click',()=>{const cost=tapCost();if(state.points<cost)return;state.points-=cost;state.tapUpgrades++;state.tapPower++;render();save();});
$('buy-auto').addEventListener('click',()=>{const cost=autoCost();if(state.points<cost)return;state.points-=cost;state.autoUpgrades++;state.autoPower++;render();save();});
$('reset').addEventListener('click',()=>{if(!confirm('이 브라우저의 게임 진행 상황을 초기화할까요?'))return;state=freshState();save();render();$('status').textContent='진행 상황을 초기화했습니다.';});
const elapsed=Math.min(MAX_OFFLINE_SECONDS,Math.max(0,Math.floor((Date.now()-state.lastSaved)/1000)));
const offline=Math.floor(elapsed*state.autoPower*OFFLINE_RATE);
if(offline>0){state.points+=offline;state.totalEarned+=offline;$('status').textContent=`오프라인 보상 +${number(offline)} 짬 (자동 수익의 7%)`;}
render();save();
let lastTick=Date.now();
setInterval(()=>{
  const now=Date.now();
  // 탭이 숨겨진 동안은 자동 수익을 중복 계산하지 않고, 다음 방문 시 오프라인 보상을 적용합니다.
  if(document.visibilityState!=='visible'){lastTick=now;return;}
  const seconds=Math.max(0,Math.floor((now-lastTick)/1000));
  if(seconds>0){lastTick+=seconds*1000;if(state.autoPower>0){earn(seconds*state.autoPower);save();}}
},250);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){save();}
  else {
    const seconds=Math.min(MAX_OFFLINE_SECONDS,Math.max(0,Math.floor((Date.now()-state.lastSaved)/1000)));
    const reward=Math.floor(seconds*state.autoPower*OFFLINE_RATE);
    if(reward>0){state.points+=reward;state.totalEarned+=reward;$('status').textContent=`복귀 보상 +${number(reward)} 짬`;}
    lastTick=Date.now();render();save();
  }
});
window.addEventListener('pagehide',save);

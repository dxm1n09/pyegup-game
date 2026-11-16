'use strict';
const KEY='pyegup-dorm-v2',OLD='pyegup-dorm-v1',OFFLINE=.7/60,MAX_AWAY=Number.MAX_SAFE_INTEGER;
const $=id=>document.getElementById(id);
const friendNames=['정태우','추주형','박지훈','정다민','노현승','이세민','홍석진','구준수','천재우','윤서준','이준영','윤지호','차지훈','조서현','송창빈','우도현','나단비'];
const friendImages=friendNames.map((_,i)=>i+1);
const friendPortraitPath=i=>'assets/characters/friend-'+String(i+1).padStart(2,'0')+'.png';
function loadFriendPortrait(i,el){
  // Render the individual PNG directly, never a compressed CSS sprite.
  const img=document.createElement('img');
  img.className='friendPortraitPng';
  img.alt='';
  img.decoding='async';
  img.src=friendPortraitPath(i);
  img.onerror=()=>{img.style.display='none'};
  el.style.backgroundImage='none';
  el.style.backgroundPosition='center';
  el.append(img);
}

function renderDormFriends(){const layer=$('dormFriends');if(!layer)return;const owned=friendNames.map((name,i)=>({name,i,level:s.friends[i]})).filter(f=>f.level>0);const key=owned.map(f=>f.i).join(',');if(layer.dataset.friends===key)return;layer.dataset.friends=key;layer.replaceChildren();owned.forEach(({name,i},position)=>{const el=document.createElement('span');el.className='dormFriend';el.setAttribute('role','img');el.setAttribute('aria-label',name+' 친구');el.title=name;const img=document.createElement('span');img.className='dormFriendImage';img.style.imageRendering='auto';if(i===12){img.style.backgroundImage="url('assets/characters/cha-jihoon.jpg?v=1')";img.style.backgroundSize='contain';img.style.backgroundPosition='center'}else{img.style.backgroundPosition=`${(i%4)*100/3}% ${Math.floor(i/4)*25}%`;}el.append(img);loadFriendPortrait(i,img);const col=position%4;const row=Math.floor(position/4);el.style.left=(5+col*24)+'%';el.style.bottom=(4+row*18)+'%';el.style.animationDelay=((position%5)*-.31)+'s';layer.append(el)})}

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

const storyChapters=[
{level:1,title:'1화. 폐급의 탄생',scenes:[
['합격','치열한 입시를 뚫고 마침내 고등학교에 합격했다.\n\n부모님은 명문대 진학을 기대했고, 선생님들은 새로운 인재의 등장을 기대했다.\n\n하지만 그 누구도 이 학생이 앞으로 어떤 전설을 남길지 예상하지 못했다.'],
['기숙사 입소','커다란 캐리어를 끌고 기숙사에 도착했다.\n\n앞으로 3년간 생활할 곳은 515호.\n\n책상과 침대, 옷장까지 모든 것이 준비되어 있었다.\n\n단 하나, 이곳에서 성실하게 생활할 마음가짐만 준비되지 않았다.'],
['첫날의 다짐','입학 첫날, 원대한 목표를 세웠다.\n\n전교권 성적 유지, 규칙적인 생활, 성실한 자습, 명문대 진학.\n\n완벽한 계획이었다.\n\n계획을 세우는 데만큼은 이미 전교 1등이었다.'],
['현실 적응','며칠이 지나자 기숙사 생활의 진실이 드러났다.\n\n아침 기상은 고통이었고, 정독실 의자는 불편했으며, 휴대폰은 언제나 교과서보다 흥미로웠다.\n\n공부할 시간은 부족했지만 이상하게 놀 시간은 충분했다.'],
['전설의 시작','그렇게 평범할 줄 알았던 고등학교 생활이 시작되었다.\n\n아직 벌점도, 대형 사고도, 학부모와의 갈등도 없었다.\n\n그러나 이 평화는 오래가지 못했다.\n\n학교 역사에 남을 폐급의 서막이 올랐다.']]},
{level:150,title:'2화. 학부모와의 전쟁',scenes:[
['사소한 갈등','1학년 어느 날, 같은 반 여자애와 갈등이 생겼다.\n\n처음에는 학생들 사이에서 끝날 법한 일이었다.\n\n하지만 사소한 말다툼은 예상치 못한 방향으로 번져 나갔다.'],
['예상 밖의 상대','갈등이 커지면서 결국 상대 학생의 어머니까지 등장했다.\n\n이제 상대는 같은 반 친구가 아니었다.\n\n고등학교에 입학한 지 얼마 되지도 않아 학부모와 대립하는 믿기 어려운 상황이 펼쳐졌다.'],
['세대 간 대결','평범한 학생이라면 당황했을 상황.\n\n하지만 그는 물러서지 않았고, 결국 학부모와 직접 싸우는 사건이 벌어졌다.\n\n교실에서 시작된 갈등이 세대를 뛰어넘는 대형 소동으로 발전한 것이다.'],
['사건의 후폭풍','사건이 끝난 뒤 교실 분위기는 묘하게 어색해졌다.\n\n친구들 사이에서는 사건에 대한 이야기가 퍼졌다.\n\n입학한 지 얼마 되지도 않았는데 벌써 학교생활의 난도를 스스로 올려 버렸다.'],
['업적 달성','다른 학생들이 첫 시험 성적과 동아리 활동을 이야기할 때, 그는 학부모와 싸운 사건으로 기억되었다.\n\n그렇게 1학년의 첫 번째 대형 흑역사가 완성되었다.\n\n업적 달성: 학부모와의 전쟁.']]},
{level:350,title:'3화. 정독실 대참사',scenes:[
['평화로운 정독실','2학년이 되었다.\n\n정독실에는 책장을 넘기는 소리와 필기하는 소리만 들렸다.\n\n모두가 열심히 공부하는 가운데, 유독 한 사람만 다른 종류의 집중력을 발휘하고 있었다.'],
['진정한 집중력','책상 위에는 문제집이 펼쳐져 있었다.\n\n그러나 시선은 책이 아닌 휴대폰 화면을 향했다.\n\n게임이 시작되자 주변의 모든 소음이 사라졌다.\n\n이 정도 집중력이 공부에 사용되었다면 이미 전교 1등이었을 것이다.'],
['담임 등장','게임이 한창이던 순간, 누군가 가까이 다가왔다.\n\n고개를 들어 보니 담임 선생님이었다.\n\n휴대폰 화면에는 게임이 그대로 켜져 있었다.\n\n수많은 선택지가 있었지만 이미 늦었다.'],
['한 달의 형벌','결과는 한 달간 강제 조퇴.\n\n정독실에서 게임을 하던 대가는 예상보다 훨씬 컸다.\n\n친구들이 남아서 공부하는 동안 그는 학교를 떠나야 했다.\n\n게임 한 판이 한 달짜리 사건이 되어 버렸다.'],
['전설의 조퇴생','한 달 동안 정독실과 강제로 이별하게 되었다.\n\n게임에서 얻은 경험치는 조금이었지만 학교생활에서 얻은 불명예는 엄청났다.\n\n정독실에서 가장 집중력이 좋았던 학생은 결국 정독실에 남지 못했다.']]},
{level:500,title:'4화. 뎀벨레 사건',scenes:[
['새로운 사건','2학년 생활도 어느덧 익숙해졌다.\n\n하지만 평온한 날들은 오래가지 않았다.\n\n이번 사건의 중심에는 우스만 뎀벨레라는 이름이 있었다.\n\n그리고 또다시 문제의 중심에는 주인공이 있었다.'],
['선을 넘다','처음에는 별일 아니라고 생각했다.\n\n그러나 우스만 뎀벨레를 향한 괴롭힘은 결코 가볍게 넘어갈 일이 아니었다.\n\n상대가 불편함을 느끼는 동안에도 그는 자신의 행동이 얼마나 심각한지 제대로 깨닫지 못했다.'],
['학교폭력 신고','결국 사건은 학교폭력 신고로 이어졌다.\n\n상황은 더 이상 친구들끼리 웃고 넘길 수 있는 수준이 아니었다.\n\n주인공은 자신의 행동에 대한 책임을 마주해야 했다.'],
['심각해진 분위기','사건이 알려지면서 학교생활의 분위기가 무거워졌다.\n\n이전의 소동과 달리 이번에는 상대방에게 실제로 피해를 준 행동이었다.\n\n주인공은 뒤늦게 자신의 행동을 돌아보기 시작했다.'],
['남겨진 기록','2학년의 또 다른 사건이 끝났다.\n\n그에게는 웃어넘길 수 없는 교훈이 남았다.\n\n장난이라고 생각한 행동도 상대에게는 괴롭힘이 될 수 있다는 사실이었다.\n\n폐급의 학교생활은 여전히 순탄하지 않았다.']]},
{level:620,title:'5화. 사랑이 쏘아 올린 공부',scenes:[
['3학년의 시작','마침내 고등학교 3학년이 되었다.\n\n주변 친구들은 수능 준비에 몰두하기 시작했다.\n\n하지만 그는 여전히 공부해야 할 이유를 찾지 못하고 있었다.\n\n그러던 어느 날, 예상치 못한 소식을 듣게 되었다.'],
['충격적인 소식','여자친구의 전 남자친구가 좋은 대학교에 합격했다는 소식이었다.\n\n그 순간 머릿속이 복잡해졌다.\n\n친구들의 성적도, 선생님의 충고도 움직이지 못했던 마음이 단 한 사람의 대학 합격 소식에 흔들렸다.'],
['자존심 발동','갑자기 공부에 대한 의지가 불타올랐다.\n\n이유는 학문에 대한 열정도, 미래 사회에 기여하겠다는 사명감도 아니었다.\n\n단지 여자친구의 전 남자친구보다 못한 사람이 되고 싶지 않았을 뿐이었다.'],
['공부 선언','오랫동안 방치했던 문제집을 꺼냈다.\n\n책상 위를 정리하고, 공부 계획표를 작성하고, 목표 대학까지 정했다.\n\n처음으로 진지하게 공부를 결심한 순간이었다.\n\n동기는 이상했지만 의지만큼은 진짜였다.'],
['늦게 켜진 스위치','드디어 공부를 시작했다.\n\n남들은 3년 동안 쌓아 온 실력을 바탕으로 달리고 있었지만, 그는 이제야 출발선에 섰다.\n\n과연 뒤늦게 시작한 공부로 모든 것을 뒤집을 수 있을까?\n\n운명의 6월이 다가오고 있었다.']]},
{level:750,title:'6화. 6월 모의고사의 저주',scenes:[
['결전의 6월','3학년 6월 모의고사가 시작되었다.\n\n그동안 공부를 결심하고 나름대로 노력해 왔다.\n\n이번 시험이야말로 자신의 가능성을 증명할 기회라고 생각했다.\n\n하지만 시험지는 그의 기대를 전혀 고려하지 않았다.'],
['현실의 벽','첫 문제부터 심상치 않았다.\n\n분명 공부했던 내용인데 막상 시험지에서 만나니 낯설었다.\n\n시간은 빠르게 흘렀고, 풀지 못한 문제는 쌓여 갔다.\n\n공부를 결심한 것과 실제로 성적이 오르는 것은 전혀 다른 문제였다.'],
['성적표의 충격','모의고사 결과를 확인했다.\n\n기대했던 반전은 없었다.\n\n좋은 대학에 가겠다는 자신감은 순식간에 무너졌다.\n\n여자친구의 전 남자친구를 뛰어넘겠다는 목표도 점점 멀어지는 것 같았다.'],
['잘못된 선택','큰 좌절감에 빠진 그는 스트레스를 해소할 방법을 찾았다.\n\n그리고 결국 담배에 손을 대기 시작했다.\n\n잠깐 현실을 잊을 수 있다고 생각했지만, 문제는 해결되지 않았다.\n\n오히려 학교생활을 뒤흔들 새로운 위험을 스스로 만들고 있었다.'],
['다가오는 파국','6월 모의고사는 끝났지만 수능까지 남은 시간은 많지 않았다.\n\n성적은 불안했고, 공부에 대한 자신감은 떨어졌다.\n\n거기에 흡연이라는 새로운 문제까지 생겼다.\n\n이 선택이 수능 직전에 어떤 결과를 가져올지는 아직 알지 못했다.']]},
{level:875,title:'7화. 수능 D-14, 강제 퇴사',scenes:[
['수능 2주 전','수능까지 정확히 2주가 남았다.\n\n모든 고3이 마지막 정리에 집중해야 할 시기였다.\n\n그러나 주인공은 여전히 자신의 잘못된 습관을 끊지 못하고 있었다.\n\n그리고 결국 돌이킬 수 없는 사건이 발생했다.'],
['기숙사 적발','기숙사에서 흡연하던 사실이 적발되었다.\n\n학교 규칙을 어긴 대가는 가볍지 않았다.\n\n수능을 불과 2주 앞둔 상황에서 기숙사 생활에 중대한 문제가 생겼다.'],
['임시퇴사 통보','결국 일주일간 기숙사 임시퇴사 처분을 받았다.\n\n수능 직전 가장 중요한 시기에 기숙사를 떠나야 하는 상황이었다.\n\n515호에서 쌓아 온 수많은 사건 중에서도 가장 치명적인 결과였다.'],
['무너진 계획','마지막 2주 동안 공부를 마무리하겠다는 계획은 완전히 꼬였다.\n\n익숙한 생활 환경에서 벗어나면서 공부 리듬도 흔들렸다.\n\n뒤늦게 자신의 행동을 후회했지만 이미 처분은 내려진 뒤였다.'],
['운명의 일주일','일주일의 임시퇴사가 끝나고 수능이 코앞으로 다가왔다.\n\n이제 남은 것은 시험장에서 자신의 실력을 보여주는 일뿐이었다.\n\n수많은 사건을 일으키며 보낸 3년.\n\n그 모든 시간의 결과가 단 하루에 결정될 예정이었다.']]},
{level:875,title:'8화. 전설의 유급생 (엔딩)',scenes:[
['수능 당일','마침내 수능 당일이 밝았다.\n\n지난 3년의 모든 순간이 머릿속을 스쳐 지나갔다.\n\n입학, 학부모와의 갈등, 정독실 게임, 학교폭력 신고, 뒤늦은 공부 결심, 그리고 임시퇴사.\n\n그는 비장한 마음으로 시험장에 들어갔다.'],
['최후의 시험','시험이 시작되었다.\n\n그러나 문제들은 생각보다 훨씬 어려웠다.\n\n분명 공부한 기억은 있는데 정답은 떠오르지 않았다.\n\n수능을 준비한 시간보다 기숙사에서 사고를 친 시간이 더 선명하게 기억났다.'],
['처참한 결과','수능 성적이 발표되었다.\n\n결과는 처참했다.\n\n꿈꾸던 대학은 멀어졌고, 뒤늦게 시작한 공부의 성과도 기대에 미치지 못했다.\n\n그렇게 주인공의 대학 진학 계획은 완전히 무너졌다.'],
['전설의 판정','그리고 이 게임 세계에는 현실과 다른 황당한 규칙이 하나 있었다.\n\n수능을 크게 망친 학생은 졸업할 수 없다는 것이었다.\n\n결국 주인공에게 내려진 최종 판정은 유급.\n\n고등학교 3학년을 한 번 더 다녀야 한다는 통보였다.'],
['THE END...?','515호에서 시작된 3년의 기숙사 생활.\n\n수많은 사고를 거쳐 마침내 도달한 곳은 대학이 아니었다.\n\n바로 다시 고등학교 3학년이었다.\n\n그렇게 학교 역사상 가장 전설적인 폐급이 탄생했다.\n\n축하합니다! 3학년을 다시 시작할 자격을 획득했습니다.']]}
];

const titles={growth:['성장','터치 강화와 자동 수익을 키우세요.'],friends:['친구','이전 친구 Lv.10 달성 시 다음 친구 해금'],zones:['학교 구역','구매 후 가치가 초당 상승합니다.'],collect:['수집품','수집품을 모으고 되팔 수 있습니다.'],gifts:['친구들의 선물','해당 친구 Lv.30 달성 시 구매 가능'],clubs:['동아리 지배','구매 후 판매 가치가 초당 상승합니다. 판매 후 정가로 재구매할 수 있습니다.'],places:['학교 주변 시설','보유하는 동안 판매 가치가 상승하며, 판매 후 정가로 재구매합니다.'],power:['학교 권력','보유 시 판매 가치가 초당 상승합니다.'],relics:['유물','확인된 유물 5종만 우선 수록'],prestige:['재입학','레벨을 초기화하고 영구 보너스를 얻습니다.'],story:['스토리','레벨에 따라 이야기가 해금됩니다.'],achievements:['업적','달성 기록은 재입학해도 유지됩니다.'],encyclopedia:['도감','구매하거나 영입한 모든 종류의 기록입니다.'],ranking:['순위표','보유 짬과 보유 자산의 현재 시세를 합산합니다.']};
const initial=()=>({money:0,total:0,runEarned:0,tapLevel:0,autoLevel:0,friends:Array(17).fill(0),zones:{},collect:{},gifts:[],clubs:[],places:[],power:[],assetBoughtAt:{clubs:{},places:{},power:{}},relics:[],prestiges:0,mana:0,taps:0,history:{friends:[],zones:[],collect:[],gifts:[],clubs:[],places:[],power:[],relics:[]},stats:{peakLevel:1,lifetimeTaps:0,peakCombo:0,sales:0},storyRead:[],achievements:[],last:Date.now()});
function load(){let raw;try{raw=JSON.parse(localStorage.getItem(KEY))}catch{};let s=initial();if(raw&&typeof raw==='object'){
 for(const k of ['money','total','runEarned','tapLevel','autoLevel','prestiges','mana','taps','last'])if(Number.isFinite(raw[k])&&raw[k]>=0)s[k]=raw[k];
 if(Array.isArray(raw.friends))s.friends=s.friends.map((_,i)=>Number.isFinite(raw.friends[i])?Math.max(0,Math.floor(raw.friends[i])):0);
 for(const k of ['gifts','clubs','places','power','relics'])if(Array.isArray(raw[k]))s[k]=[...new Set(raw[k].filter(x=>Number.isInteger(x)&&x>=0&&x<({gifts:17,clubs:15,places:10,power:7,relics:5}[k])))];
 for(const k of ['clubs','places','power']){const src=raw.assetBoughtAt?.[k];for(const i of s[k])s.assetBoughtAt[k][i]=(src&&Number.isFinite(src[i])&&src[i]>0)?src[i]:(Number.isFinite(raw.last)?raw.last:Date.now());}
 for(const k of ['zones','collect'])if(raw[k]&&typeof raw[k]==='object')for(const [i,v] of Object.entries(raw[k]))if(Number.isInteger(+i)&&Number.isFinite(v)&&v>0)s[k][i]=v;
 if(raw.history&&typeof raw.history==='object')for(const k of Object.keys(s.history))if(Array.isArray(raw.history[k]))s.history[k]=[...new Set(raw.history[k].filter(i=>Number.isInteger(i)&&i>=0&&i<({friends:17,zones:7,collect:7,gifts:17,clubs:15,places:10,power:7,relics:5}[k])))];
 if(raw.stats&&typeof raw.stats==='object')for(const k of Object.keys(s.stats))if(Number.isFinite(raw.stats[k])&&raw.stats[k]>=0)s.stats[k]=raw.stats[k];
 if(Array.isArray(raw.storyRead))s.storyRead=[...new Set(raw.storyRead.filter(i=>Number.isInteger(i)&&i>=0&&i<8))];
 if(Array.isArray(raw.achievements))s.achievements=[...new Set(raw.achievements.filter(x=>typeof x==='string'&&x.length<60))];
 s.stats.lifetimeTaps=Math.max(s.stats.lifetimeTaps,s.taps);

 }else{try{const old=JSON.parse(localStorage.getItem(OLD));if(old){s.money=Math.max(0,old.points||0);s.total=Math.max(0,old.totalEarned||0);s.runEarned=s.total;s.tapLevel=Math.max(0,old.tapUpgrades||0);s.autoLevel=Math.max(0,old.autoUpgrades||0);}}catch{}}
 return s;
}
let s=load(),tab='growth',storyPage=null,collectionCategory='friends',lastFrame=Date.now(),lastTap=0,streak=0,renderAt=0;
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
const autoGain=()=>safe(Math.floor(friendIncome()*bonusRelic('auto')*permanent()));
const ASSET_RATE_PER_SECOND=.0000005; // 0.00005 percent of purchase price / second
const assetValue=(category,i,price,time=Date.now())=>safe(price+price*ASSET_RATE_PER_SECOND*Math.max(0,(time-(s.assetBoughtAt?.[category]?.[i]||time))/1000));

const catalogGroups=[
 ['friends','친구',friendNames],['zones','학교 구역',zoneNames],['collect','수집품',collectibleNames],
 ['gifts','친구들의 선물',giftNames],['clubs','동아리 지배',clubNames],['places','주변 시설',placeNames],
 ['power','학교 권력',powerNames],['relics','유물',relics.map(x=>x.name)]
];
function updateRecords(){
 const current={friends:s.friends.map((n,i)=>n>0?i:-1).filter(i=>i>=0),zones:Object.keys(s.zones).map(Number),
 collect:Object.keys(s.collect).map(Number),gifts:s.gifts,clubs:s.clubs,places:s.places,power:s.power,relics:s.relics};
 for(const [k] of catalogGroups)s.history[k]=[...new Set([...(s.history[k]||[]),...current[k]])].sort((a,b)=>a-b);
 s.stats.peakLevel=Math.max(s.stats.peakLevel||1,level());
 s.stats.lifetimeTaps=Math.max(s.stats.lifetimeTaps||0,s.taps);
 for(const [key,, ,condition] of achievementDefs)if(!s.achievements.includes(key)&&condition())s.achievements.push(key);
}
const achievementDefs=[
 ['first-tap','첫 짬','누적 터치 1회',()=>s.stats.lifetimeTaps>=1],
 ['tap-100','손가락 훈련','누적 터치 100회',()=>s.stats.lifetimeTaps>=100],
 ['tap-1000','터치 장인','누적 터치 1,000회',()=>s.stats.lifetimeTaps>=1000],
 ['tap-10000','터치의 전설','누적 터치 10,000회',()=>s.stats.lifetimeTaps>=10000],
 ['combo-80','콤보 입문','최대 콤보 80 달성',()=>s.stats.peakCombo>=80],
 ['combo-820','콤보 정점','최대 콤보 820 달성',()=>s.stats.peakCombo>=820],
 ['friend-1','첫 친구','친구 1명 영입',()=>s.history.friends.length>=1],
 ['friend-all','친구 수집 완료','친구 17명 영입',()=>s.history.friends.length===17],
 ['zone-all','학교 정복','학교 구역 7곳 구매',()=>s.history.zones.length===7],
 ['collect-all','수집왕','수집품 7종 구매',()=>s.history.collect.length===7],
 ['club-1','동아리 인수','동아리 1개 구매',()=>s.history.clubs.length>=1],
 ['club-all','동아리 지배자','동아리 15개 구매',()=>s.history.clubs.length===15],
 ['places-all','시설 수집 완료','주변 시설 10곳 구매',()=>s.history.places.length===10],
 ['power-all','권력의 정점','학교 권력 7종 구매',()=>s.history.power.length===7],
 ['gift-all','선물 수집 완료','친구 선물 17종 구매',()=>s.history.gifts.length===17],
 ['relic-1','유물 발견','유물 1종 획득',()=>s.history.relics.length>=1],
 ['relic-all','유물 도감 완성','유물 5종 획득',()=>s.history.relics.length===5],
 ['sale-1','첫 매각','자산 1회 판매',()=>s.stats.sales>=1],
 ['prestige-1','다시 시작','재입학 1회',()=>s.prestiges>=1],
 ['story-2','학부모와의 전쟁','2화 이야기 완독',()=>s.storyRead.includes(1)],
 ['story-8','전설의 유급생','8화 엔딩 완독',()=>s.storyRead.includes(7)],
 ['level-150','Lv.150 달성','최고 150레벨',()=>s.stats.peakLevel>=150],
 ['level-350','Lv.350 달성','최고 350레벨',()=>s.stats.peakLevel>=350],
 ['level-750','Lv.750 달성','최고 750레벨',()=>s.stats.peakLevel>=750],
 ['level-875','Lv.875 달성','최고 875레벨',()=>s.stats.peakLevel>=875]
];
function worthAt(time=Date.now()){
 const ownedValue=(group,prices)=>s[group].reduce((total,i)=>total+assetValue(group,i,prices[i],time),0);
 const zones=Object.entries(s.zones).reduce((a,[i,t])=>a+zonePrices[i]*(1+ASSET_RATE_PER_SECOND*Math.max(0,(time-t)/1000)),0);
 const collect=Object.entries(s.collect).reduce((a,[i,t])=>a+collectiblePrices[i]*(1+ASSET_RATE_PER_SECOND*Math.max(0,(time-t)/1000)),0);
 const gifts=s.gifts.reduce((a,i)=>a+giftPrices[i],0);
 return safe(s.money+zones+collect+gifts+ownedValue('clubs',clubPrices)+ownedValue('places',placePrices)+ownedValue('power',powerPrices));
}
function leaderboardSnapshot(){
 const now=Date.now();
 let rate=0;
 for(const [group,prices] of [['zones',zonePrices],['collect',collectiblePrices]]){
   for(const i of Object.keys(s[group]))rate+=prices[+i]*ASSET_RATE_PER_SECOND;
 }
 for(const [group,prices] of [['clubs',clubPrices],['places',placePrices],['power',powerPrices]]){
   for(const i of s[group])rate+=prices[i]*ASSET_RATE_PER_SECOND;
 }
 return {net_worth:worthAt(now),growth_per_second:rate};
}
function displayRow(container,name,detail,locked=false){
 const row=document.createElement('div');row.className='archive-row'+(locked?' archive-locked':'');
 const label=document.createElement('strong');label.textContent=name;const p=document.createElement('p');p.textContent=detail;
 row.append(label,p);container.append(row);return row;
}
function displayStory(container){
 storyChapters.forEach((chapter,i)=>{
  const available=s.stats.peakLevel>=chapter.level;
  const row=document.createElement('div');row.className='archive-row';
  const title=document.createElement('strong');title.textContent=available?chapter.title:'잠김 · Lv.'+chapter.level;
  const desc=document.createElement('p');desc.textContent=available?'Lv.'+chapter.level+' · 5장면 · '+(s.storyRead.includes(i)?'완독':'열람 가능'):'Lv.'+chapter.level+' 달성 시 공개';
  const b=document.createElement('button');b.className='archive-button';b.textContent=available?'읽기':'잠김';b.disabled=!available;
  b.onclick=()=>{storyPage={chapter:i,scene:0};renderStoryViewer()};
  row.append(title,desc,b);container.append(row);
 });
}
function renderStoryViewer(){
 const viewer=$('storyViewer');if(!viewer)return;
 if(!storyPage){viewer.hidden=true;return}
 const c=storyChapters[storyPage.chapter],sc=c.scenes[storyPage.scene];
 viewer.hidden=false;$('storyHeading').textContent=c.title;$('storyProgress').textContent=(storyPage.scene+1)+' / '+c.scenes.length+' · '+sc[0];
 $('storyText').textContent=sc[1];$('storyPrev').disabled=storyPage.scene===0;
 $('storyNext').textContent=storyPage.scene===c.scenes.length-1?'완독':'다음';
}
function displayCatalog(container){
 const selectors=document.createElement('div');selectors.className='archive-categories';
 for(const [key,label] of catalogGroups){
  const b=document.createElement('button');b.className='archive-button'+(collectionCategory===key?' selected':'');
  b.textContent=label;b.onclick=()=>{collectionCategory=key;render()};selectors.append(b);
 }
 container.append(selectors);
 const [key,,names]=catalogGroups.find(([k])=>k===collectionCategory)||catalogGroups[0];
 const seen=new Set(s.history[key]);
 const heading=document.createElement('p');heading.className='archive-count';
 heading.textContent='발견 '+seen.size+' / '+names.length+' · 판매하거나 재입학해도 기록 유지';container.append(heading);
 names.forEach((name,i)=>{
  const unlocked=seen.has(i);const row=displayRow(container,unlocked?name:'???',unlocked?'발견 완료':'미발견',!unlocked);
  if(key==='friends'&&unlocked){
   const pic=document.createElement('span');pic.className='friend-photo';pic.setAttribute('role','img');pic.setAttribute('aria-label',name+' 사진');
   loadFriendPortrait(i,pic);row.prepend(pic);
  }
 });
}
function displayAchievements(container){
 const count=s.achievements.length;
 const summary=document.createElement('p');summary.className='archive-count';summary.textContent='달성 '+count+' / '+achievementDefs.length;container.append(summary);
 for(const [id,title,desc] of achievementDefs){
  const done=s.achievements.includes(id);
  displayRow(container,(done?'달성 · ':'미달성 · ')+title,desc,!done);
 }
}
let leaderboardRows=[],leaderboardError='',leaderboardRequested=false;
function showLeaderboard(container){
 const note=document.createElement('p');note.className='archive-count';
 note.textContent='총자산 = 보유 짬 + 학교 구역·수집품·선물·동아리·주변 시설·학교 권력 시세 (현재 시간 기준)';
 container.append(note);
 const button=document.createElement('button');button.className='archive-button';button.textContent='순위 새로고침';
 button.onclick=()=>{leaderboardRequested=true;window.pyegupCloud?.refreshLeaderboard?.()};container.append(button);
 if(leaderboardError)displayRow(container,'순위표 연결 오류',leaderboardError);
 if(!leaderboardRows.length){displayRow(container,'순위 데이터 없음','계정별 클라우드 동기화 후 표시됩니다.');return}
 const now=Date.now(),rows=leaderboardRows.map(row=>({...row,calculated:row.net_worth+Math.max(0,(now-new Date(row.updated_at).getTime())/1000)*row.growth_per_second})).sort((a,b)=>b.calculated-a.calculated);
 rows.slice(0,100).forEach((row,i)=>displayRow(container,(i+1)+'위 · '+row.username,fmt(row.calculated)+' 짬'));
}
window.pyegupLeaderboard={
 snapshot:leaderboardSnapshot,
 setRows(rows){leaderboardRows=Array.isArray(rows)?rows:[];leaderboardError='';if(tab==='ranking')render()},
 setError(text){leaderboardError=String(text);if(tab==='ranking')render()}
};

const COMBO_LIMITS=[0,80,280,550,820];
const combo=()=>streak>=820?1.5:streak>=550?1.4:streak>=280?1.3:streak>=80?1.2:1;
function updateComboUI(){const tier=streak>=820?4:streak>=550?3:streak>=280?2:streak>=80?1:0;const low=COMBO_LIMITS[tier],high=COMBO_LIMITS[Math.min(4,tier+1)];const progress=tier===4?100:Math.max(0,Math.min(100,(streak-low)/(high-low)*100));$('comboTag').textContent='콤보 ×'+combo().toFixed(1);$('comboFill').style.width=progress+'%';$('comboNext').textContent=tier===4?'최대 콤보':'다음 ×'+(1.2+tier*.1).toFixed(1);}
function earn(n){if(!Number.isFinite(n)||n<=0)return;s.money=safe(s.money+n);s.total=safe(s.total+n);s.runEarned=safe(s.runEarned+n)}
function spend(n){if(!Number.isFinite(n)||s.money<n)return false;s.money=Math.max(0,s.money-n);return true}
function msg(t){$('message').textContent=t}
function save(){updateRecords();s.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s));if(window.pyegupCloud?.ready)window.pyegupCloud.queueSave(structuredClone(s));msg('저장 완료')}catch{msg('저장 공간 부족: 내보내기를 이용하세요')}}
function countOwned(k){return k==='friends'?s.friends.filter(x=>x>0).length:k==='zones'||k==='collect'?Object.keys(s[k]).length:(s[k]?.length||0)}
function addItem(name,description,buttonText,onClick,disabled=false,imageSrc=null){const row=document.createElement('div');row.className='item';const info=document.createElement('div');info.className='iteminfo';const title=document.createElement('strong');title.textContent=name;const p=document.createElement('p');p.textContent=description;info.append(title,p);if(imageSrc){const photo=document.createElement('span');photo.className='friend-photo';if(imageSrc==='locked'){photo.classList.add('friend-locked');photo.textContent='?';photo.setAttribute('aria-label','미해금 친구');}else if(imageSrc===13){photo.style.backgroundImage="url('assets/characters/cha-jihoon.jpg?v=1')";photo.style.backgroundSize='contain';photo.style.backgroundPosition='center'}else{photo.style.backgroundPosition=`${((imageSrc-1)%4)*100/3}% ${Math.floor((imageSrc-1)/4)*25}%`;}photo.setAttribute('role','img');if(imageSrc!=='locked'){photo.setAttribute('aria-label',friendNames[imageSrc-1]+' 사진');row.append(photo);loadFriendPortrait(imageSrc-1,photo)}else row.append(photo)}const b=document.createElement('button');b.textContent=buttonText;b.disabled=disabled;b.addEventListener('click',onClick);row.append(info,b);$('items').append(row)}
function actionBuy(price,callback,label){if(!spend(price)){msg('짬이 부족합니다');return}callback();msg(label+' 완료!');save();render()}
function drawItems(){const el=$('items');el.replaceChildren();updateRecords();$('panelTitle').textContent=titles[tab][0];$('panelSub').textContent=titles[tab][1];$('panelCount').textContent=['growth','prestige','story','achievements','encyclopedia','ranking'].includes(tab)?'':countOwned(tab)+' / '+({friends:17,zones:7,collect:7,gifts:17,clubs:15,places:10,power:7,relics:5}[tab]||0);
 if(tab==='story'){displayStory(el)}else if(tab==='achievements'){displayAchievements(el)}else if(tab==='encyclopedia'){displayCatalog(el)}else if(tab==='ranking'){showLeaderboard(el)}else if(tab==='growth'){
 addItem('정신 차리기 · Lv.'+s.tapLevel,'터치 기본 수익 '+fmt(baseTap())+' 짬','강화 '+fmt(tapCost()),()=>actionBuy(tapCost(),()=>s.tapLevel++,'정신 차리기'),s.money<tapCost());

 }else if(tab==='friends')friendNames.forEach((name,i)=>{const l=s.friends[i],unlocked=i===0||s.friends[i-1]>=10,price=friendCost(i);addItem(unlocked?(i+1)+'. '+name+' · Lv.'+l:(i+1)+'. ???',unlocked?`자동 수익 · Lv.20 터치 +${friendBonuses[i]}% · Lv.30 선물 해금`:'앞 친구 Lv.10 필요',unlocked?(l>0?'레벨업 ':'영입 ')+fmt(price):'🔒 미해금',()=>actionBuy(price,()=>s.friends[i]++,'친구 강화'),!unlocked||s.money<price,unlocked?friendImages[i]:'locked')});
 else if(tab==='zones')zoneNames.forEach((name,i)=>{const owned=s.zones[i],value=owned?zonePrices[i]+zonePrices[i]*ASSET_RATE_PER_SECOND*Math.max(0,(Date.now()-owned)/1000):0;addItem(name,owned?'현재 매각 가치 '+fmt(value)+' 짬 · 초당 +'+fmt(zonePrices[i]*ASSET_RATE_PER_SECOND):'구매가 '+fmt(zonePrices[i])+' 짬 · 초당 가치 +'+fmt(zonePrices[i]*ASSET_RATE_PER_SECOND),owned?'매각 '+fmt(value):'구매 '+fmt(zonePrices[i]),()=>{if(owned){earn(value);s.stats.sales++;delete s.zones[i];msg(name+' 매각 완료');save();render()}else actionBuy(zonePrices[i],()=>s.zones[i]=Date.now(),name+' 구매')},!owned&&s.money<zonePrices[i])});
 else if(tab==='collect')collectibleNames.forEach((name,i)=>{const owned=s.collect[i],value=owned?collectiblePrices[i]*(1+Math.max(0,(Date.now()-owned)/1000)*ASSET_RATE_PER_SECOND):0;addItem(name,owned?'매각 가치 '+fmt(value)+' 짬 · 초당 +'+fmt(collectiblePrices[i]*ASSET_RATE_PER_SECOND):'구매가 '+fmt(collectiblePrices[i])+' 짬 · 초당 가치 +'+fmt(collectiblePrices[i]*ASSET_RATE_PER_SECOND),owned?'매각 '+fmt(value):'구매 '+fmt(collectiblePrices[i]),()=>{if(owned){earn(value);s.stats.sales++;delete s.collect[i];msg(name+' 매각 완료');save();render()}else actionBuy(collectiblePrices[i],()=>s.collect[i]=Date.now(),name+' 구매')},!owned&&s.money<collectiblePrices[i])});
 else if(tab==='gifts')giftNames.forEach((name,i)=>{const owned=s.gifts.includes(i),unlock=s.friends[i]>=30;addItem(unlock?friendNames[i]+' · '+name:(i+1)+'. ???',unlock?`터치 보너스 +${giftBonuses[i]}%`:'??? · 해당 친구 Lv.30 달성 시 공개',!unlock?'???':owned?'보유 중':'구매 '+fmt(giftPrices[i]),()=>actionBuy(giftPrices[i],()=>s.gifts.push(i),name+' 획득'),owned||!unlock||s.money<giftPrices[i])});
 else if(tab==='clubs'||tab==='places'||tab==='power'){
 const names=tab==='clubs'?clubNames:tab==='places'?placeNames:powerNames,prices=tab==='clubs'?clubPrices:tab==='places'?placePrices:powerPrices;
 names.forEach((name,i)=>{const owned=s[tab].includes(i),price=prices[i],value=owned?assetValue(tab,i,price):price,rate=price*ASSET_RATE_PER_SECOND;
 addItem(name,owned?'현재 판매 가치 '+fmt(value)+' 짬 · 초당 가치 +'+fmt(rate):'정가 '+fmt(price)+' 짬 · 초당 가치 +'+fmt(rate),owned?'판매 '+fmt(value):'구매 '+fmt(price),()=>{
 if(owned){earn(assetValue(tab,i,price));s.stats.sales++;s[tab]=s[tab].filter(x=>x!==i);delete s.assetBoughtAt[tab][i];msg(name+' 판매 완료');save();render()}
 else actionBuy(price,()=>{s[tab].push(i);s.assetBoughtAt[tab][i]=Date.now()},name+' 구매');
 },!owned&&s.money<price);
 });
 }else if(tab==='relics'){
 const p=document.createElement('p');p.className='note';p.textContent='유물 항아리 · 마나 '+fmt(s.mana)+'개. 터치 1,000회마다 마나 1개 획득. 유물 10종 중 세부 수치가 확인된 5종만 구현되어 있습니다. 마나 획득 규칙은 임시 설정입니다.';el.append(p);
 const b=document.createElement('button');b.className='bigbutton';b.textContent='유물 항아리 1회 뽑기 · 마나 3개';b.disabled=s.mana<3;b.onclick=()=>drawRelic(3,1);el.append(b);
 const b2=document.createElement('button');b2.className='bigbutton';b2.style.marginTop='8px';b2.textContent='유물 항아리 11회 뽑기 · 마나 30개';b2.disabled=s.mana<30;b2.onclick=()=>drawRelic(30,11);el.append(b2);
 relics.forEach((r,i)=>{const owned=s.relics.includes(i);addItem(r.name,`${r.type==='tap'?'터치':r.type==='auto'?'자동':'전체'} 수익 +${Math.round(r.bonus*100)}%`,owned?'보유 중':'구매 '+fmt(r.price),()=>actionBuy(r.price,()=>s.relics.push(i),r.name+' 획득'),owned||s.money<r.price)});
 }else if(tab==='prestige'){
 const can=level()>=300;const p=document.createElement('p');p.className='note';p.textContent=`현재 레벨 ${fmt(level())} · 재입학 ${s.prestiges}회 · 영구 수익 배율 ×${permanent().toFixed(1)}. 레벨 300부터 재입학할 수 있습니다. 재입학하면 짬, 친구, 구매한 콘텐츠, 일반 강화가 초기화되고 영구 수익 +10%를 얻습니다. 재입학 보너스 수치는 임시 설정입니다.`;el.append(p);
 const b=document.createElement('button');b.className='bigbutton';b.textContent=can?'재입학하기 · 영구 수익 +10%':'레벨 300에 해금';b.disabled=!can;b.onclick=()=>{if(!confirm('재입학하면 현재 짬과 구매 콘텐츠가 초기화됩니다. 계속할까요?'))return;const next=initial();next.total=s.total;next.prestiges=s.prestiges+1;next.mana=s.mana;next.history=structuredClone(s.history);next.stats=structuredClone(s.stats);next.storyRead=[...s.storyRead];next.achievements=[...s.achievements];s=next;streak=0;save();render()};el.append(b);
 }
}
function drawRelic(cost,n){if(s.mana<cost)return;s.mana-=cost;const got=[];for(let j=0;j<n;j++){const i=Math.floor(Math.random()*relics.length);if(!s.relics.includes(i)){s.relics.push(i);got.push(relics[i].name)}}msg(got.length?'유물 획득: '+got.join(', '):'이미 보유한 유물만 나왔습니다');save();render()}
function render(){updateRecords();renderDormFriends();const now=Date.now();$('money').textContent=fmt(s.money);$('income').textContent=fmt(autoGain());$('level').textContent=fmt(level());$('tapIncome').textContent=fmt(tapGain()*combo());$('prestigeTag').textContent='재입학 '+s.prestiges+'회';updateComboUI();drawItems();renderAt=now}
function tap(ev){const now=Date.now();streak=Math.min(820,streak+1);lastTap=now;s.taps++;s.stats.lifetimeTaps++;s.stats.peakCombo=Math.max(s.stats.peakCombo,streak);if(s.taps%1000===0){s.mana++;msg('마나 1개 획득!')}const value=Math.floor(tapGain()*combo());earn(value);$('money').textContent=fmt(s.money);$('level').textContent=fmt(level());$('tapIncome').textContent=fmt(tapGain()*combo());updateComboUI();const f=document.createElement('span');f.className='float';const label=document.createElement('span');label.className='floatJam';label.textContent='짬';const amount=document.createElement('span');amount.className='floatAmount';amount.textContent='+'+fmt(value);f.append(label,amount);const scene=$('play').getBoundingClientRect();const px=ev&&Number.isFinite(ev.clientX)?ev.clientX-scene.left:scene.width/2;const py=ev&&Number.isFinite(ev.clientY)?ev.clientY-scene.top:scene.height*.4;f.style.left=Math.max(18,Math.min(scene.width-18,px))+'px';f.style.top=Math.max(20,Math.min(scene.height-20,py))+'px';f.style.setProperty('--dx',(Math.random()*38-19)+'px');$('play').append(f);setTimeout(()=>f.remove(),850);if(now-renderAt>600)render()}
// Prevent mobile browsers (including Safari) from zooming on repeated game taps.
// The game already handles taps on pointerdown, so cancelling a rapid touchend
// only suppresses the browser's double-tap gesture, not game scoring.
let lastGameTouchEnd=0;
$('play').addEventListener('touchend',event=>{
  if(event.changedTouches.length!==1)return;
  const now=Date.now();
  if(now-lastGameTouchEnd<350&&event.cancelable)event.preventDefault();
  lastGameTouchEnd=now;
},{passive:false});
function reactToCharacterTouch(target){
  const friend=target.closest('.dormFriend');
  const main=target.closest('.character');
  const actor=friend||main;
  if(!actor)return;
  const figure=friend?friend.querySelector('.friendPortraitPng'):main.querySelector('img');
  if(!figure)return;
  // Restart each press immediately, even during very fast combo tapping.
  figure.getAnimations().forEach(animation=>{if(animation.id==='character-tap-reaction')animation.cancel()});
  const animation=figure.animate([
    {translate:'0 0',scale:1,rotate:'0deg'},
    {translate:'0 -9px',scale:1.13,rotate:'-5deg',offset:.35},
    {translate:'0 2px',scale:.96,rotate:'3deg',offset:.7},
    {translate:'0 0',scale:1,rotate:'0deg'}
  ],{duration:280,easing:'ease-out'});
  animation.id='character-tap-reaction';
}
$('play').addEventListener('pointerdown',e=>{if(e.target.closest('a, input, select, textarea, button:not(#tap)'))return;e.preventDefault();reactToCharacterTouch(e.target);tap(e)});
$('tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(!b)return;tab=b.dataset.tab;if(tab==='ranking')window.pyegupCloud?.refreshLeaderboard?.();document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x===b));render()});
$('settingsBtn').onclick=()=>$('settings').showModal();
$('storyClose').onclick=()=>{storyPage=null;renderStoryViewer()};
$('storyPrev').onclick=()=>{if(storyPage&&storyPage.scene>0){storyPage.scene--;renderStoryViewer()}};
$('storyNext').onclick=()=>{if(!storyPage)return;const idx=storyPage.chapter;if(storyPage.scene<storyChapters[idx].scenes.length-1){storyPage.scene++;renderStoryViewer()}else{if(!s.storyRead.includes(idx))s.storyRead.push(idx);storyPage=null;save();render();renderStoryViewer()}};
$('resetBtn').onclick=()=>{if(!confirm('모든 게임 진행 상황을 초기화할까요?'))return;localStorage.removeItem(KEY);localStorage.removeItem(OLD);s=initial();$('settings').close();render();msg('게임을 초기화했습니다')};
const away=Math.max(0,Math.min(MAX_AWAY,(Date.now()-s.last)/1000));if(away>10){const gained=Math.floor(autoGain()*away*OFFLINE);earn(gained);if(gained>0)msg('오프라인 수익 +'+fmt(gained)+' 짬 (경과 분 × 0.7 × 초당 수익)')}
let hiddenSince=document.hidden?Date.now():null;
lastFrame=Date.now();setInterval(()=>{const now=Date.now(),dt=Math.min(5,(now-lastFrame)/1000);lastFrame=now;if(document.hidden)return;if(lastTap&&now-lastTap>650&&streak>0){streak=Math.max(0,streak-24*dt);updateComboUI();$('tapIncome').textContent=fmt(tapGain()*combo())}earn(autoGain()*dt);if(now-renderAt>950)render()},200);
setInterval(()=>{if(!document.hidden)save()},15000);document.addEventListener('visibilitychange',()=>{if(document.hidden){save();hiddenSince=Date.now()}else{const now=Date.now(),away=Math.max(0,(now-(hiddenSince??s.last))/1000);if(away>5){const gained=Math.floor(autoGain()*(away/60)*.7);earn(gained);if(gained>0)msg('오프라인 수익 +'+fmt(gained)+' 짬')}hiddenSince=null;lastFrame=now;render()}});window.addEventListener('pagehide',save);render();

/* Account bridge: Firebase authentication and cloud sync are initialized separately. */
window.pyegupAccount={
 getLocal:()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}},
 loadCloud:data=>{if(!data||typeof data!=='object')return;localStorage.setItem(KEY,JSON.stringify(data));s=load();streak=0;lastFrame=Date.now();render()},
 resetForAccount:()=>{s=initial();streak=0;lastFrame=Date.now();render()},
 snapshot:()=>structuredClone(s),
 saveNow:()=>save()
};

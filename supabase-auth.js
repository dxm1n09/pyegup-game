import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.49.10';
const el=id=>document.getElementById(id),gate=el('authGate'),status=el('authStatus');
const login=el('loginBtn'),signup=el('signupBtn'),importBtn=el('importLocalBtn');
const cfg=window.PYEGUP_SUPABASE_CONFIG;
const legacySave=window.pyegupAccount?.getLocal();
const message=t=>status.textContent=t;
const lock=busy=>{login.disabled=busy;signup.disabled=busy;importBtn.disabled=busy};
if(!cfg?.url||!cfg?.anonKey||!cfg?.authDomain||!/^https:\/\//.test(cfg.url)||!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(cfg.authDomain)){
 message('Supabase 연결 설정이 필요합니다. 관리자가 supabase-config.js를 설정해야 합니다.');lock(true);
}else{
 const sb=createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 let uid=null,ready=false,pending=null,timer=null,saving=Promise.resolve(),activeVersion=0,username='';
 const emailFor=name=>name+'@'+cfg.authDomain;
 async function refreshLeaderboard(){if(!uid||!ready)return;const {data,error}=await sb.from('game_leaderboard').select('username,net_worth,growth_per_second,updated_at').limit(1000);if(error){window.pyegupLeaderboard?.setError(error.message);return}window.pyegupLeaderboard?.setRows((data||[]).map(row=>({...row,net_worth:Number(row.net_worth),growth_per_second:Number(row.growth_per_second)})))}
 const validName=name=>/^[a-z][a-z0-9_]{3,19}$/.test(name);
 function queueSave(data){if(!ready||!uid)return;pending=data;clearTimeout(timer);timer=setTimeout(()=>void flush(),1800)}
 async function flush(){if(!ready||!uid||!pending)return saving;const data=pending,target=uid;pending=null;
 saving=saving.catch(()=>{}).then(async()=>{if(uid!==target||!ready)return;const {error}=await sb.from('game_saves').upsert({user_id:target,state:data,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;const total=window.pyegupLeaderboard?.snapshot?.();if(total){const {error:rankErr}=await sb.from('game_leaderboard').upsert({user_id:target,username,net_worth:total.net_worth,growth_per_second:total.growth_per_second,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(rankErr)throw rankErr}}).catch(e=>{if(uid===target){pending=data;message('클라우드 저장 실패: '+e.message)}});return saving}
 window.pyegupCloud={get ready(){return ready},queueSave,refreshLeaderboard:()=>void refreshLeaderboard()};
 async function enter(user){const version=++activeVersion;ready=false;uid=user.id;username=(user.email||'').split('@')[0];lock(true);gate.hidden=false;message('계정 진행 상황 불러오는 중…');
 try{const {data,error}=await sb.from('game_saves').select('state').eq('user_id',user.id).maybeSingle();if(error)throw error;if(version!==activeVersion||uid!==user.id)return;
 if(data?.state)window.pyegupAccount.loadCloud(data.state);else window.pyegupAccount.resetForAccount();
 importBtn.hidden=!legacySave;ready=true;queueSave(window.pyegupAccount.snapshot());gate.hidden=true;el('logoutBtn').textContent='로그아웃';message('클라우드 연결 완료');void refreshLeaderboard();
 }catch(e){message('클라우드 불러오기 실패: '+e.message+' — 데이터 보호를 위해 게임을 잠갔습니다.');ready=false;}finally{lock(false)} }
 async function exit(){++activeVersion;ready=false;uid=null;username='';pending=null;clearTimeout(timer);gate.hidden=false;importBtn.hidden=true;lock(false);message('게임 아이디와 비밀번호로 로그인하세요.')}
 sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT')void exit();else if(event==='INITIAL_SESSION'||event==='SIGNED_IN'){if(session?.user&&(!ready||uid!==session.user.id))void enter(session.user);else if(!session?.user)void exit()}});
 async function authenticate(register){const name=el('authEmail').value.trim().toLowerCase(),password=el('authPassword').value;
 if(!validName(name)){message('아이디는 영문 소문자로 시작하는 4~20자의 영문·숫자·밑줄만 가능합니다.');return}
 if(password.length<8){message('비밀번호는 8자 이상이어야 합니다.');return}lock(true);message('계정 확인 중…');
 try{if(register){const {data,error}=await sb.auth.signUp({email:emailFor(name),password});if(error)throw error;if(!data.session)throw Error('이메일 인증이 켜져 있습니다. Supabase에서 Confirm email을 끄세요.');}
 else{const {error}=await sb.auth.signInWithPassword({email:emailFor(name),password});if(error)throw error}}
 catch(e){message('계정 처리 실패: '+e.message)}finally{lock(false)}}
 login.onclick=()=>void authenticate(false);signup.onclick=()=>void authenticate(true);
 el('logoutBtn').onclick=async()=>{if(!confirm('로그아웃할까요?'))return;window.pyegupAccount.saveNow();clearTimeout(timer);await flush();await sb.auth.signOut();el('settings').close();window.pyegupAccount.resetForAccount()};
 const importOld=async()=>{if(!ready||!uid||!legacySave){alert('가져올 기존 저장 데이터가 없습니다.');return}
 if(!confirm('현재 계정의 클라우드 저장을 기존 기기 저장 데이터로 덮어쓸까요?'))return;
 window.pyegupAccount.loadCloud(legacySave);queueSave(window.pyegupAccount.snapshot());await flush();el('settings').close();message('기존 진행 상황 가져오기 완료')};
 importBtn.onclick=()=>void importOld();
}

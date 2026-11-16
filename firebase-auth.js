import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const el=id=>document.getElementById(id);
const gate=el('authGate'),status=el('authStatus'),login=el('loginBtn'),signup=el('signupBtn'),importBtn=el('importLocalBtn');
const cfg=window.PYEGUP_FIREBASE_CONFIG;
const message=t=>status.textContent=t;
const lock=busy=>{login.disabled=busy;signup.disabled=busy;importBtn.disabled=busy};
if(!cfg?.apiKey||!cfg?.authDomain||!cfg?.projectId||!cfg?.appId){
 message('관리자가 Firebase 설정을 완료해야 회원가입과 로그인을 사용할 수 있습니다. firebase-config.js를 설정하세요.');lock(true);
}else{
 const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
 let uid=null,ready=false,pending=null,timer=null,saving=Promise.resolve();
 const cloudRef=id=>doc(db,'users',id,'game','progress');
 function queueSave(data){if(!ready||!uid)return;pending=data;clearTimeout(timer);timer=setTimeout(flush,1200)}
 function flush(){if(!ready||!uid||!pending)return saving;const data=pending;pending=null;const target=uid;saving=saving.catch(()=>{}).then(async()=>{if(uid!==target)return;await setDoc(cloudRef(target),{state:data,updatedAt:Date.now()});}).catch(e=>{if(uid===target){pending=data;message('클라우드 저장 실패: '+e.message)}});return saving}
 window.pyegupCloud={get ready(){return ready},queueSave};
 async function enter(user){lock(true);ready=false;uid=user.uid;gate.hidden=false;message('클라우드 진행 상황 불러오는 중…');
 try{const snap=await getDoc(cloudRef(uid));if(auth.currentUser?.uid!==uid)return;
 if(snap.exists()&&snap.data()?.state){window.pyegupAccount.loadCloud(snap.data().state);importBtn.hidden=false;}
 else{window.pyegupAccount.resetForAccount();importBtn.hidden=false;}
 ready=true;gate.hidden=true;message('계정 연결됨: '+user.email);el('logoutBtn').textContent='로그아웃 ('+user.email+')';
 }catch(e){ready=false;message('클라우드 불러오기 실패: '+e.message+' — 저장 데이터 보호를 위해 게임을 잠갔습니다.');}finally{lock(false)} }
 onAuthStateChanged(auth,user=>{if(user)enter(user);else{ready=false;uid=null;pending=null;clearTimeout(timer);gate.hidden=false;importBtn.hidden=true;message('이메일과 비밀번호로 회원가입하거나 로그인하세요.');lock(false)}});
 async function authenticate(register){const email=el('authEmail').value.trim(),password=el('authPassword').value;if(!email||password.length<6){message('이메일과 6자 이상의 비밀번호를 입력하세요.');return}lock(true);message('계정 확인 중…');try{if(register)await createUserWithEmailAndPassword(auth,email,password);else await signInWithEmailAndPassword(auth,email,password)}catch(e){message('로그인 실패: '+e.code);lock(false)}}
 login.onclick=()=>authenticate(false);signup.onclick=()=>authenticate(true);
 el('logoutBtn').onclick=async()=>{if(!confirm('로그아웃할까요?'))return;window.pyegupAccount.saveNow();clearTimeout(timer);await flush();ready=false;uid=null;await signOut(auth);el('settings').close();window.pyegupAccount.resetForAccount()};
 importBtn.onclick=async()=>{if(!ready||!uid)return;const local=window.pyegupAccount.getLocal();if(!local){message('이 기기에 가져올 저장 데이터가 없습니다.');gate.hidden=false;return}if(!confirm('현재 계정의 클라우드 저장을 이 기기의 저장 데이터로 덮어쓸까요?'))return;window.pyegupAccount.loadCloud(local);queueSave(window.pyegupAccount.snapshot());await flush();message('기존 저장 데이터 가져오기 완료')};
}

const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');
const homeBtn = document.querySelector('#homeBtn');
const soundBtn = document.querySelector('#soundBtn');
const bestPill = document.querySelector('#bestPill');
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (state.screen === 'home') renderHome();
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('PLAY11이 홈 화면에 설치됐어요.');
});

const GAMES = [
  {id:'word',icon:'🎙️',title:'끝말잇기 배틀',desc:'마이크로 받아쓰기 · 제한시간 배틀',tag:'VOICE / 1–5'},
  {id:'tetris',icon:'🧱',title:'블록 퍼즐 테트리스',desc:'원터치 조작 · 쌓고 지우기',tag:'ARCADE / 1–5'},
  {id:'rhythm',icon:'🎵',title:'비트팡팡',desc:'4라인 박자 맞추기 · 콤보',tag:'MUSIC / 1–5'},
  {id:'brick',icon:'🎾',title:'벽돌깨기 대모험',desc:'드래그 패들 · 공의 궤적',tag:'ACTION / 1–5'},
  {id:'capital',icon:'🌍',title:'수도로 국가 맞추기',desc:'60개국 대륙별 지리 퀴즈',tag:'QUIZ / 1–5'},
  {id:'flag',icon:'🚩',title:'국기 보고 나라 찾기',desc:'60개국 플래그 퀴즈',tag:'QUIZ / 1–5'},
  {id:'consonant',icon:'💡',title:'자음으로 단어 맞추기',desc:'초성 힌트 어휘력 퀴즈',tag:'WORDS / 1–5'},
  {id:'slide',icon:'🧩',title:'슬라이딩 퍼즐 맞추기',desc:'2×2부터 4×4까지 두뇌 퍼즐',tag:'PUZZLE / 1–5'},
  {id:'tower',icon:'🛡️',title:'몬스터 타워 디펜스',desc:'터치 사격 + 자동 포탑',tag:'DEFENSE / 1–5'},
  {id:'emblem',icon:'🚘',title:'엠블럼으로 메이커 맞추기',desc:'국내외 자동차 브랜드 퀴즈',tag:'AUTO / 1–5'},
  {id:'car',icon:'🏎️',title:'사진으로 자동차 이름 맞추기',desc:'국산차부터 슈퍼카 모델명',tag:'AUTO / 1–5'}
];

const countries = [
 ['대한민국','서울','🇰🇷','아시아'],['일본','도쿄','🇯🇵','아시아'],['중국','베이징','🇨🇳','아시아'],['인도','뉴델리','🇮🇳','아시아'],['태국','방콕','🇹🇭','아시아'],['베트남','하노이','🇻🇳','아시아'],['인도네시아','자카르타','🇮🇩','아시아'],['필리핀','마닐라','🇵🇭','아시아'],['싱가포르','싱가포르','🇸🇬','아시아'],['몽골','울란바토르','🇲🇳','아시아'],['호주','캔버라','🇦🇺','오세아니아'],['뉴질랜드','웰링턴','🇳🇿','오세아니아'],['미국','워싱턴 D.C.','🇺🇸','북아메리카'],['캐나다','오타와','🇨🇦','북아메리카'],['멕시코','멕시코시티','🇲🇽','북아메리카'],['쿠바','아바나','🇨🇺','북아메리카'],['브라질','브라질리아','🇧🇷','남아메리카'],['아르헨티나','부에노스아이레스','🇦🇷','남아메리카'],['칠레','산티아고','🇨🇱','남아메리카'],['페루','리마','🇵🇪','남아메리카'],['콜롬비아','보고타','🇨🇴','남아메리카'],['영국','런던','🇬🇧','유럽'],['프랑스','파리','🇫🇷','유럽'],['독일','베를린','🇩🇪','유럽'],['이탈리아','로마','🇮🇹','유럽'],['스페인','마드리드','🇪🇸','유럽'],['포르투갈','리스본','🇵🇹','유럽'],['네덜란드','암스테르담','🇳🇱','유럽'],['벨기에','브뤼셀','🇧🇪','유럽'],['스위스','베른','🇨🇭','유럽'],['오스트리아','빈','🇦🇹','유럽'],['그리스','아테네','🇬🇷','유럽'],['스웨덴','스톡홀름','🇸🇪','유럽'],['노르웨이','오슬로','🇳🇴','유럽'],['덴마크','코펜하겐','🇩🇰','유럽'],['핀란드','헬싱키','🇫🇮','유럽'],['폴란드','바르샤바','🇵🇱','유럽'],['체코','프라하','🇨🇿','유럽'],['튀르키예','앙카라','🇹🇷','유럽'],['이집트','카이로','🇪🇬','아프리카'],['남아프리카공화국','프리토리아','🇿🇦','아프리카'],['케냐','나이로비','🇰🇪','아프리카'],['나이지리아','아부자','🇳🇬','아프리카'],['모로코','라바트','🇲🇦','아프리카'],['에티오피아','아디스아바바','🇪🇹','아프리카'],['가나','아크라','🇬🇭','아프리카'],['이스라엘','예루살렘','🇮🇱','아시아'],['사우디아라비아','리야드','🇸🇦','아시아'],['아랍에미리트','아부다비','🇦🇪','아시아'],['카타르','도하','🇶🇦','아시아'],['러시아','모스크바','🇷🇺','유럽'],['우크라이나','키이우','🇺🇦','유럽'],['아일랜드','더블린','🇮🇪','유럽'],['아이슬란드','레이캬비크','🇮🇸','유럽'],['파키스탄','이슬라마바드','🇵🇰','아시아'],['방글라데시','다카','🇧🇩','아시아'],['네팔','카트만두','🇳🇵','아시아'],['스리랑카','스리자야와르데네푸라코테','🇱🇰','아시아'],['말레이시아','쿠알라룸푸르','🇲🇾','아시아'],['캄보디아','프놈펜','🇰🇭','아시아']
].map(([name,capital,flag,continent])=>({name,capital,flag,continent}));

const consonants = [
 ['ㄱㅂ','가방'],['ㅂㄷ','바다'],['ㅅㄱ','사과'],['ㅎㄴ','하늘'],['ㅈㅈㄱ','자전거'],['ㅋㅍ','커피'],['ㅅㅂ','선물'],['ㄱㅇ','거울'],['ㅂㅎㄱ','비행기'],['ㅊㅋㄹ','초콜릿'],['ㅇㅅㄴ','우산'],['ㅅㅈ','사진'],['ㄷㅂ','도서관'],['ㅁㅇ','마음'],['ㅎㅂ','행복'],['ㄱㅈ','기차'],['ㅅㄹ','사랑'],['ㅂㄹ','바람'],['ㅊㅇ','친구'],['ㅁㄹ','미래']
].map(([hint,answer])=>({hint,answer}));
const emblems = [['H','현대'],['K','기아'],['G','제네시스'],['A','아우디'],['B','BMW'],['M','메르세데스-벤츠'],['V','폭스바겐'],['T','토요타'],['L','렉서스'],['P','포르쉐'],['F','페라리'],['L','람보르기니'],['V','볼보'],['N','닛산'],['H','혼다'],['J','지프'],['R','르노'],['S','쉐보레'],['D','닷지'],['S','스바루']].map(([mark,answer])=>({mark,answer}));
const cars = [['IONIQ 5','현대 아이오닉 5','EV'],['Grandeur','현대 그랜저','SEDAN'],['K8','기아 K8','SEDAN'],['EV6','기아 EV6','EV'],['G80','제네시스 G80','LUXURY'],['Tucson','현대 투싼','SUV'],['Carnival','기아 카니발','MPV'],['911','포르쉐 911','SPORT'],['Model 3','테슬라 모델 3','EV'],['Mustang','포드 머스탱','SPORT'],['Supra','토요타 수프라','SPORT'],['Cayenne','포르쉐 카이엔','SUV'],['488','페라리 488','SUPER'],['Urus','람보르기니 우루스','SUPER'],['G-Class','메르세데스 G-클래스','SUV'],['Aventador','람보르기니 아벤타도르','SUPER']].map(([label,answer,type])=>({label,answer,type}));

const state = {screen:'home', game:null, level:1, score:0, sound:true, runtime:{}, best:JSON.parse(localStorage.getItem('play11-best')||'{}')};
const $ = s => document.querySelector(s);
const shuffle = arr => [...arr].sort(()=>Math.random()-.5);
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
function stopRuntime(){
  const r=state.runtime;
  if(r.raf) cancelAnimationFrame(r.raf);
  if(r.intervals) r.intervals.forEach(clearInterval);
  if(r.timeouts) r.timeouts.forEach(clearTimeout);
  state.runtime={};
}
function saveBest(game,score){ if(score>(state.best[game]||0)){state.best[game]=score;localStorage.setItem('play11-best',JSON.stringify(state.best));} updateBest(); }
function updateBest(){bestPill.textContent=`BEST ${Object.values(state.best).reduce((a,b)=>a+b,0)}`;}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),1800)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function gameById(id){return GAMES.find(g=>g.id===id)}
function goHome(){stopRuntime();state.screen='home';state.game=null;renderHome();}
homeBtn.addEventListener('click',goHome);
soundBtn.addEventListener('click',()=>{state.sound=!state.sound;soundBtn.textContent=state.sound?'◒':'○';toast(state.sound?'사운드 안내가 켜졌어요':'사운드 안내가 꺼졌어요')});

function renderHome(){
  state.screen='home'; updateBest();
  const installBanner = deferredInstallPrompt ? `<div class="install-banner"><span>📲</span><div><strong>홈 화면에 설치하기</strong>앱처럼 한 번에 실행할 수 있어요.</div><button id="installBtn">설치</button><button class="close-install" id="closeInstall" aria-label="닫기">×</button></div>` : '';
  app.innerHTML=`${installBanner}<section class="hero"><div><p class="eyebrow">11 MINI ARCADE / MOBILE FIRST</p><h1>오늘은<br><em>뭐하고 놀까?</em></h1><p class="hero-copy">3분이면 충분한 집중력 충전. 터치하고, 듣고, 맞히고, 깨부수는 11가지 짧은 승부를 한 곳에서 즐겨보세요.</p></div><div class="hero-stats"><div class="stat-card"><b>11</b><span>PLAYABLE GAMES</span></div><div class="stat-card"><b>5</b><span>LEVELS EACH</span></div><div class="stat-card"><b>60</b><span>COUNTRIES QUIZ</span></div><div class="stat-card"><b id="homeBest">${Object.values(state.best).reduce((a,b)=>a+b,0)}</b><span>MY BEST SCORE</span></div></div></section><div class="section-head"><div><h2>게임 라인업</h2><p>카드를 눌러 바로 시작하세요</p></div><span class="pill">TOUCH READY</span></div><section class="games-grid">${GAMES.map((g,i)=>`<button class="game-card" data-game="${g.id}"><div><span class="game-icon">${g.icon}</span><h3>${g.title}</h3><p>${g.desc}</p></div><div class="game-meta"><b>${String(i+1).padStart(2,'0')}</b><span>${g.tag}</span></div></button>`).join('')}</section>`;
  document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));
  if ($('#installBtn')) $('#installBtn').onclick = async () => { deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; renderHome(); };
  if ($('#closeInstall')) $('#closeInstall').onclick = () => { deferredInstallPrompt = null; renderHome(); };
}
function openGame(id){stopRuntime();state.game=id;state.level=1;state.score=0;renderGame();}
function renderGame(){
  const g=gameById(state.game); if(!g)return;
  app.innerHTML=`<section class="game-view"><div class="game-header"><button class="back-btn" id="backBtn">←</button><div class="game-heading"><h1>${g.icon} ${g.title}</h1><p>${g.desc}</p></div></div><div class="level-picker">${[1,2,3,4,5].map(i=>`<button class="level-btn ${i===state.level?'active':''}" data-level="${i}">LEVEL ${i}</button>`).join('')}</div><div class="game-layout"><section class="game-stage" id="stage"></section><aside class="side-panel"><div><h3>ROUND DATA</h3><div class="side-list"><div class="side-row"><span>난이도</span><b id="levelVal">LEVEL ${state.level}</b></div><div class="side-row"><span>현재 점수</span><b id="scoreVal">0</b></div><div class="side-row"><span>내 최고점</span><b>${state.best[state.game]||0}</b></div></div></div><p class="tip">${tipFor(state.game)}</p></aside></div></section>`;
  $('#backBtn').addEventListener('click',goHome);
  document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{state.level=+b.dataset.level;renderGame()}));
  startGame(state.game);
  app.focus();
}
function tipFor(id){return ({word:'마이크가 잘 안 들리면 아래 입력창에 직접 적어도 돼요.',tetris:'좌우 이동과 회전으로 빈칸 없이 쌓아보세요.',rhythm:'노트가 판정선에 닿을 때 같은 라인을 눌러요.',brick:'패들을 드래그해 공의 낙하지점을 예측하세요.',capital:'레벨이 오를수록 여러 대륙의 수도들이 섞여 나와요.',flag:'이모지 국기를 보고 가장 빠르게 선택하세요.',consonant:'초성은 단어의 첫소리만 보여주는 힌트예요.',slide:'빈칸과 맞닿은 타일을 눌러 숫자를 순서대로 맞추세요.',tower:'화면을 터치하면 그 위치로 포탄을 발사해요.',emblem:'엠블럼의 이니셜과 실루엣을 보고 맞혀보세요.',car:'차량 실루엣과 차급 힌트로 모델명을 추리하세요.'})[id]||''}
function setScore(n){state.score=n;const el=$('#scoreVal');if(el)el.textContent=n}
function finish(score=state.score,msg='ROUND CLEAR'){saveBest(state.game,score);toast(`${msg} · ${score}점`)}

function startGame(id){
  if(id==='word') return startWord();
  if(id==='tetris') return startTetris();
  if(id==='rhythm') return startRhythm();
  if(id==='brick') return startBrick();
  if(['capital','flag','consonant','emblem','car'].includes(id)) return startQuiz(id);
  if(id==='slide') return startSlide();
  if(id==='tower') return startTower();
}

function startQuiz(kind){
  const stage=$('#stage'); let round;
  if(kind==='capital') round=shuffle(countries).slice(0,8).map(c=>({q:`${c.name}의 수도는?`,answer:c.capital,options:shuffle([c.capital,...shuffle(countries.filter(x=>x.name!==c.name).map(x=>x.capital)).slice(0,3)])}));
  if(kind==='flag') round=shuffle(countries).slice(0,8).map(c=>({q:c.flag,sub:'이 국기의 나라는?',answer:c.name,options:shuffle([c.name,...shuffle(countries.filter(x=>x.name!==c.name).map(x=>x.name)).slice(0,3)])}));
  if(kind==='consonant') round=shuffle(consonants).slice(0,8).map(c=>({q:c.hint,sub:'초성에 맞는 단어는?',answer:c.answer,options:shuffle([c.answer,...shuffle(consonants.filter(x=>x.answer!==c.answer).map(x=>x.answer)).slice(0,3)])}));
  if(kind==='emblem') round=shuffle(emblems).slice(0,8).map(c=>({q:c.mark,sub:'이 엠블럼의 메이커는?',answer:c.answer,options:shuffle([c.answer,...shuffle(emblems.filter(x=>x.answer!==c.answer).map(x=>x.answer)).slice(0,3)])}));
  if(kind==='car') round=shuffle(cars).slice(0,8).map(c=>({q:c.answer,sub:c.type==='SUPER'?'SUPERCAR':c.type,answer:c.answer,options:shuffle([c.answer,...shuffle(cars.filter(x=>x.answer!==c.answer).map(x=>x.answer)).slice(0,3)]),photo:c.label}));
  state.runtime.quiz={round,index:0,score:0}; renderQuizQuestion(kind);
}
function renderQuizQuestion(kind){
  const q=state.runtime.quiz.round[state.runtime.quiz.index]; if(!q){finish(state.runtime.quiz.score,'ROUND CLEAR');$('#stage').innerHTML=`<div class="quiz-card"><p class="eyebrow">ROUND COMPLETE</p><div class="quiz-question">${state.runtime.quiz.score}점</div><p class="status">8문제 중 ${state.runtime.quiz.correct||0}개 정답이에요.</p><button class="primary" id="againBtn">한 판 더</button></div>`;$('#againBtn').onclick=()=>renderGame();return}
  const progress=(state.runtime.quiz.index/state.runtime.quiz.round.length)*100;
  let visual='';
  if(kind==='flag')visual=`<div class="quiz-question">${q.q}</div>`;
  else if(kind==='emblem')visual=`<div class="emblem">${q.q}</div>`;
  else if(kind==='car')visual=`<div class="car-photo"><span class="photo-label">${q.photo} / PHOTO CLUE</span></div><div class="quiz-question" style="font-size:24px;margin:12px 0">모델명을 골라보세요</div>`;
  else visual=`<div class="quiz-question">${q.q}</div>`;
  $('#stage').innerHTML=`<div class="quiz-card"><div class="hud"><span class="pill">${state.runtime.quiz.index+1} / ${state.runtime.quiz.round.length}</span><span class="pill">SCORE <b>${state.runtime.quiz.score}</b></span></div><div class="progress"><i style="width:${progress}%"></i></div><div class="quiz-kicker">${q.sub||'WORLD QUIZ'}</div>${visual}<div class="answer-grid">${q.options.map(o=>`<button class="answer" data-answer="${o}">${o}</button>`).join('')}</div><p class="feedback" id="feedback"></p></div>`;
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(btn,q)));
}
function answerQuiz(btn,q){
  if(btn.dataset.locked)return; document.querySelectorAll('[data-answer]').forEach(b=>b.dataset.locked='1');
  const correct=btn.dataset.answer===q.answer; const fb=$('#feedback');
  if(correct){btn.classList.add('correct');state.runtime.quiz.score+=100*state.level;state.runtime.quiz.correct=(state.runtime.quiz.correct||0)+1;setScore(state.runtime.quiz.score);fb.textContent='정답! 감각이 아주 좋아요.'}
  else{btn.classList.add('wrong');document.querySelector(`[data-answer="${CSS.escape(q.answer)}"]`)?.classList.add('correct');fb.textContent=`정답은 ${q.answer}`}
  const t=setTimeout(()=>{state.runtime.quiz.index++;renderQuizQuestion(state.game)},550);state.runtime.timeouts=(state.runtime.timeouts||[]).concat(t);
}

function startWord(){
  const seconds=[18,14,11,8,6][state.level-1];
  const responses={과:'과자',자:'자전거',거:'거울',울:'울타리',리:'리본',본:'본능',능:'능력',력:'역사',사:'사과',과자:'자전거',전:'전구',구:'구름',름:'음악',악:'악기',기:'기차',차:'차표',표:'표범',범:'범고래',래:'래퍼'};
  const words=['과자','자전거','거울','울타리','리본','본능','능력','역사','사과','전구','구름','음악','악기','기차','차표','표범','범고래','래퍼'];
  const r={current:'사과',expected:'과',score:0,time:seconds,round:0};state.runtime.word=r;
  $('#stage').innerHTML=`<div class="quiz-card"><div class="hud"><span class="pill">ROUND <b id="wordRound">1</b></span><span class="pill">TIME <b id="wordTime">${seconds}</b>s</span><span class="pill">SCORE <b id="wordScore">0</b></span></div><div class="quiz-kicker" style="margin-top:28px">MY WORD → COMPUTER WORD</div><div class="quiz-question" id="wordCurrent" style="font-size:38px">${r.current}</div><p class="status">다음 단어는 <b style="color:var(--lime)">${r.expected}</b>(으)로 시작해야 해요.</p><div class="word-input"><input id="wordInput" placeholder="단어를 입력하세요" autocomplete="off"/><button class="mic-btn" id="micBtn" aria-label="음성 입력">🎙️</button><button class="primary" id="wordSubmit">제출</button></div><p class="feedback" id="wordFeedback">마이크 버튼을 누르면 음성으로 받아써요.</p></div>`;
  const input=$('#wordInput');
  const submit=()=>{
    const val=input.value.trim(); if(!val)return;
    if(!val.startsWith(r.expected)){ $('#wordFeedback').textContent=`${r.expected}(으)로 시작하는 단어가 필요해요.`;input.select();return; }
    r.round++;r.score+=80*state.level;setScore(r.score);r.current=val;r.expected=val.slice(-1);let reply=responses[r.expected];if(!reply||reply===val)reply=pick(words.filter(w=>w!==val));r.current=reply;r.expected=reply.slice(-1);r.time=seconds;$('#wordCurrent').textContent=reply;$('#wordRound').textContent=r.round+1;$('#wordScore').textContent=r.score;$('#wordFeedback').textContent=`컴퓨터: ${reply} · 다시 ${r.expected}(으)로 시작!`;input.value='';
  };
  $('#wordSubmit').onclick=submit;input.addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
  let timer=setInterval(()=>{r.time--;$('#wordTime').textContent=r.time;if(r.time<=0){clearInterval(timer);finish(r.score,'시간 종료');$('#wordFeedback').textContent=`시간 종료! ${r.score}점`}},1000);state.runtime.intervals=[timer];
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SpeechRecognition){const rec=new SpeechRecognition();rec.lang='ko-KR';rec.interimResults=false;rec.onstart=()=>$('#micBtn').classList.add('listening');rec.onend=()=>$('#micBtn').classList.remove('listening');rec.onresult=e=>{input.value=e.results[0][0].transcript.replace(/\s/g,'');submit()};$('#micBtn').onclick=()=>rec.start();}else $('#micBtn').onclick=()=>toast('이 브라우저는 음성 인식을 지원하지 않아요. 직접 입력해 주세요.');
}

const tetrominoes=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
function rotateMatrix(m){return m[0].map((_,i)=>m.map(r=>r[i]).reverse())}
function startTetris(){
  const stage=$('#stage');stage.innerHTML=`<div class="canvas-wrap"><canvas id="tetrisCanvas" class="game-canvas" width="300" height="560"></canvas></div><div class="touch-controls"><button data-t="left">◀</button><button data-t="rotate">↻</button><button data-t="down">▼</button><button data-t="right">▶</button></div><p class="mini-note">키보드 ← → ↑ ↓ 또는 아래 버튼</p>`;
  const c=$('#tetrisCanvas'),ctx=c.getContext('2d'),cols=10,rows=18,cell=30,colors=['#57e8ff','#ffb55b','#d6ff55','#ff6b9d','#a681ff','#61e3a7','#f58bff'];let board=Array.from({length:rows},()=>Array(cols).fill(0));let piece=null,drop=0,score=0,over=false;
  const newPiece=()=>{const shape=pick(tetrominoes).map(r=>[...r]);piece={shape,x:Math.floor((cols-shape[0].length)/2),y:0,color:Math.floor(Math.random()*colors.length)+1};if(collide(piece)){over=true;finish(score,'GAME OVER')}};
  const collide=p=>p.shape.some((row,y)=>row.some((v,x)=>v&&(board[p.y+y]?.[p.x+x]||p.x+x<0||p.x+x>=cols||p.y+y>=rows)));
  const merge=()=>p=>p.shape.forEach((row,y)=>row.forEach((v,x)=>{if(v)board[p.y+y][p.x+x]=p.color}));
  const clearLines=()=>{let lines=0;board=board.filter(row=>{if(row.every(Boolean)){lines++;return false}return true});while(board.length<rows)board.unshift(Array(cols).fill(0));if(lines){score+=lines*100*state.level;setScore(score)}};
  const move=dx=>{if(!piece)return;piece.x+=dx;if(collide(piece))piece.x-=dx};
  const rotate=()=>{if(!piece)return;const old=piece.shape;piece.shape=rotateMatrix(piece.shape);if(collide(piece))piece.shape=old};
  const down=()=>{if(!piece||over)return;piece.y++;if(collide(piece)){piece.y--;merge()(piece);clearLines();newPiece()}};
  const draw=()=>{ctx.fillStyle='#0a1423';ctx.fillRect(0,0,c.width,c.height);board.forEach((row,y)=>row.forEach((v,x)=>{if(v){ctx.fillStyle=colors[v-1];ctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4)}}));if(piece)piece.shape.forEach((row,y)=>row.forEach((v,x)=>{if(v){ctx.fillStyle=colors[piece.color-1];ctx.fillRect((piece.x+x)*cell+2,(piece.y+y)*cell+2,cell-4,cell-4)}}));if(over){ctx.fillStyle='#fff';ctx.font='bold 24px system-ui';ctx.fillText('GAME OVER',74,280)}};
  newPiece();const speed=[720,600,480,350,250][state.level-1];let last=0;const loop=t=>{if(!over){if(t-last>speed){down();last=t}draw();state.runtime.raf=requestAnimationFrame(loop)}};state.runtime.raf=requestAnimationFrame(loop);window.onkeydown=e=>{if(state.game!=='tetris')return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);if(e.key==='ArrowUp')rotate();if(e.key==='ArrowDown')down()};document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>({left:()=>move(-1),right:()=>move(1),rotate,down}[b.dataset.t])());
}

function startRhythm(){
  $('#stage').innerHTML=`<div class="canvas-wrap"><canvas id="rhythmCanvas" class="game-canvas" width="640" height="360"></canvas></div><div class="touch-controls rhythm-controls">${[0,1,2,3].map(i=>'<button data-lane="'+i+'">'+(i+1)+'</button>').join('')}</div><p class="mini-note">노트가 아래 판정선에 닿을 때 같은 라인을 톡!</p>`;
  const c=$('#rhythmCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,lanes=4, laneW=w/lanes, duration=22000;let start=performance.now(),score=0,combo=0,notes=Array.from({length:34},(_,i)=>({lane:Math.floor(Math.random()*4),t:900+i*(690-[0,70,130,190,240][state.level-1]),hit:false})),ended=false;
  const tap=lane=>{const elapsed=performance.now()-start;let target=notes.filter(n=>n.lane===lane&&!n.hit).sort((a,b)=>Math.abs(a.t-elapsed)-Math.abs(b.t-elapsed))[0];if(target&&Math.abs(target.t-elapsed)<260){target.hit=true;combo++;score+=Math.round((100+combo*10)*state.level);setScore(score);toast(combo>2?`${combo} COMBO`:'GOOD')}else{combo=0;toast('라인을 맞춰보세요')}};
  document.querySelectorAll('[data-lane]').forEach(b=>b.onclick=()=>tap(+b.dataset.lane));window.onkeydown=e=>{if(state.game==='rhythm'&&['1','2','3','4'].includes(e.key))tap(+e.key-1)};
  const draw=now=>{const elapsed=now-start;ctx.fillStyle='#0a1423';ctx.fillRect(0,0,w,h);for(let i=0;i<lanes;i++){ctx.fillStyle=i%2?'#102138':'#0d1b2d';ctx.fillRect(i*laneW,0,laneW,h);ctx.strokeStyle='#28415f';ctx.strokeRect(i*laneW,0,laneW,h)}ctx.fillStyle='#d6ff55';ctx.fillRect(0,h-54,w,4);notes.forEach(n=>{if(n.hit)return;const y=h-70-(n.t-elapsed)/4; if(y>-30&&y<h){ctx.fillStyle=['#57e8ff','#ff6b9d','#d6ff55','#ffb55b'][n.lane];ctx.beginPath();ctx.roundRect(n.lane*laneW+20,y,laneW-40,26,10);ctx.fill()}});ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText(`COMBO ${combo}`,18,24);if(elapsed<duration){state.runtime.raf=requestAnimationFrame(draw)}else if(!ended){ended=true;finish(score,'BEAT CLEAR')}};state.runtime.raf=requestAnimationFrame(draw);
}

function startBrick(){
  $('#stage').innerHTML=`<div class="canvas-wrap"><canvas id="brickCanvas" class="game-canvas" width="640" height="390"></canvas></div><p class="mini-note">캔버스를 손가락으로 드래그해 패들을 움직이세요.</p>`;
  const c=$('#brickCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;let paddle={x:w/2-55,y:h-32,width:110-[0,10,20,30,40][state.level-1],height:12},ball={x:w/2,y:h-55,dx:3+state.level*.5,dy:-4-state.level*.3,r:8},rows=3+state.level,cols=8,bricks=[];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)bricks.push({x:22+x*76,y:35+y*23,w:64,h:14,on:true});let running=true,score=0;
  const move=e=>{const rect=c.getBoundingClientRect();paddle.x=clamp((e.clientX-rect.left)*(w/rect.width)-paddle.width/2,0,w-paddle.width)};c.addEventListener('pointermove',move);c.addEventListener('pointerdown',move);
  const draw=()=>{ctx.fillStyle='#0a1423';ctx.fillRect(0,0,w,h);bricks.forEach((b,i)=>{if(b.on){ctx.fillStyle=['#57e8ff','#d6ff55','#ffb55b','#ff6b9d'][i%4];ctx.fillRect(b.x,b.y,b.w,b.h)}});ctx.fillStyle='#fff';ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);ctx.beginPath();ctx.fillStyle='#ffb55b';ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText(`BRICKS ${bricks.filter(b=>b.on).length}`,18,h-12)};
  const loop=()=>{if(!running)return;ball.x+=ball.dx;ball.y+=ball.dy;if(ball.x<ball.r||ball.x>w-ball.r)ball.dx*=-1;if(ball.y<ball.r)ball.dy*=-1;if(ball.y>paddle.y-ball.r&&ball.y<paddle.y+paddle.height&&ball.x>paddle.x&&ball.x<paddle.x+paddle.width){ball.dy=-Math.abs(ball.dy);ball.dx+=(ball.x-(paddle.x+paddle.width/2))/25}bricks.forEach(b=>{if(b.on&&ball.x>b.x&&ball.x<b.x+b.w&&ball.y-ball.r<b.y+b.h&&ball.y+ball.r>b.y){b.on=false;ball.dy*=-1;score+=25*state.level;setScore(score)}});if(ball.y>h+20){running=false;finish(score,'BALL DROP')}if(bricks.every(b=>!b.on)){running=false;finish(score+500,'ALL CLEAR')}draw();if(running)state.runtime.raf=requestAnimationFrame(loop)};state.runtime.raf=requestAnimationFrame(loop);
}

function startSlide(){
  const size=state.level<=2?2:state.level<=4?3:4;let tiles=Array.from({length:size*size-1},(_,i)=>i+1).concat([0]);
  const moveBlank=idx=>{const blank=tiles.indexOf(0),r=Math.floor(blank/size),c=blank%size,tr=Math.floor(idx/size),tc=idx%size;if(Math.abs(r-tr)+Math.abs(c-tc)===1){[tiles[blank],tiles[idx]]=[tiles[idx],tiles[blank]];render();if(tiles.slice(0,-1).every((x,i)=>x===i+1)){finish(500*state.level,'PUZZLE CLEAR');$('#slideStatus').textContent='완성! 다시 섞어 한 판 더 해보세요.'}}};
  for(let i=0;i<Math.max(10,size*size*5);i++){const b=tiles.indexOf(0),r=Math.floor(b/size),c=b%size,choices=[];if(r)choices.push(b-size);if(r<size-1)choices.push(b+size);if(c)choices.push(b-1);if(c<size-1)choices.push(b+1);const j=pick(choices);[tiles[b],tiles[j]]=[tiles[j],tiles[b]]}
  const render=()=>{$('#stage').innerHTML=`<div class="quiz-card"><div class="hud"><span class="pill">BOARD <b>${size}×${size}</b></span><span class="pill">MOVES <b id="moves">0</b></span></div><div class="slide-board" style="grid-template-columns:repeat(${size},1fr)">${tiles.map((n,i)=>'<button class="tile '+(n===0?'blank':'')+'" data-tile="'+i+'">'+(n||'')+'</button>').join('')}</div><p id="slideStatus" class="status">숫자를 1부터 순서대로 맞춰보세요.</p><button class="secondary" id="slideShuffle">다시 섞기</button></div>`;document.querySelectorAll('[data-tile]').forEach(b=>b.onclick=()=>{moveBlank(+b.dataset.tile);$('#moves').textContent=(+(($('#moves')||{}).textContent)||0)+1});$('#slideShuffle').onclick=()=>startSlide()};render();
}

function startTower(){
  $('#stage').innerHTML=`<div class="canvas-wrap"><canvas id="towerCanvas" class="game-canvas" width="640" height="390"></canvas></div><p class="tower-help">몬스터를 터치하면 즉시 사격. 자동 포탑은 가장 가까운 적을 추적합니다.</p>`;
  const c=$('#towerCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;let monsters=[],shots=[],score=0,lives=5,elapsed=0,last=performance.now(),spawnEvery=1200-state.level*120,ended=false;
  const fireAt=(x,y)=>shots.push({x:w/2,y:h-42,tx:x,ty:y,life:0});c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)*w/r.width,y=(e.clientY-r.top)*h/r.height;fireAt(x,y);const target=monsters.find(m=>Math.hypot(m.x-x,m.y-y)<30);if(target){target.hp=0;score+=120*state.level;setScore(score);toast('직격!')}});
  const loop=now=>{const dt=now-last;last=now;elapsed+=dt;if(elapsed>spawnEvery){elapsed=0;monsters.push({x:30+Math.random()*(w-60),y:-20,hp:1+Math.floor(state.level/3),speed:0.045+state.level*.012})}monsters.forEach(m=>m.y+=m.speed*dt);const auto=monsters.filter(m=>m.hp>0).sort((a,b)=>b.y-a.y)[0];if(auto&&Math.random()<.12)fireAt(auto.x,auto.y);shots.forEach(s=>{s.life+=dt/240;const x=s.x+(s.tx-s.x)*Math.min(1,s.life),y=s.y+(s.ty-s.y)*Math.min(1,s.life);s.x=x;s.y=y;const hit=monsters.find(m=>m.hp>0&&Math.hypot(m.x-x,m.y-y)<25);if(hit){hit.hp--;s.life=1;if(hit.hp<=0){score+=50*state.level;setScore(score)}}});shots=shots.filter(s=>s.life<1);monsters=monsters.filter(m=>{if(m.y>h-55){lives--;return false}return m.hp>0});ctx.fillStyle='#0a1423';ctx.fillRect(0,0,w,h);ctx.fillStyle='#111f34';ctx.fillRect(0,h-58,w,58);ctx.fillStyle='#d6ff55';ctx.beginPath();ctx.arc(w/2,h-32,24,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0b1728';ctx.fillRect(w/2-5,h-68,10,38);monsters.forEach(m=>{ctx.fillStyle=m.hp>1?'#ffb55b':'#ff6b9d';ctx.beginPath();ctx.arc(m.x,m.y,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText('●',m.x-5,m.y+4)});shots.forEach(s=>{ctx.fillStyle='#57e8ff';ctx.beginPath();ctx.arc(s.x,s.y,5,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText(`LIVES ${'♥'.repeat(lives)}${'♡'.repeat(5-lives)}`,18,25);if(lives<=0&&!ended){ended=true;finish(score,'BASE DOWN')}if(!ended)state.runtime.raf=requestAnimationFrame(loop)};state.runtime.raf=requestAnimationFrame(loop);
}

renderHome();

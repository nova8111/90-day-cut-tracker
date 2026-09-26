const APP_VERSION = 2;
const TOTAL_DAYS = 90;

let deferredInstallPrompt = null;

function isStandaloneMode() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function pwaInstallStatusText() {
  if (isStandaloneMode()) return 'Installed on this phone';
  if (deferredInstallPrompt) return 'Ready to install';
  return 'Open this site in Chrome over HTTPS, then use Add to Home screen / Install app if the button is unavailable.';
}

async function installPwa() {
  if (isStandaloneMode()) { toast('App is already installed'); return; }
  if (!deferredInstallPrompt) {
    alert('Chrome has not offered the install prompt yet. Use Chrome menu → Add to Home screen / Install app. GitHub Pages or another HTTPS host is required.');
    return;
  }
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice.outcome === 'accepted') toast('Install accepted');
  deferredInstallPrompt = null;
  if (state.user && state.activeTab === 'settings') renderApp();
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (state.user && state.activeTab === 'settings') renderApp();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Cut Tracker installed ✓');
  if (state.user && state.activeTab === 'settings') renderApp();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('Service worker registration failed', err));
  });
}

const PLAN = {
  startWeight: 108,
  stretchGoal: 91,
  realisticEnd: '96–100 kg',
  calories: 1900,
  proteinTarget: 170,
  proteinMin: 150,
  fatTarget: '55–65 g',
  carbsTarget: '160–180 g',
  fiberTarget: '25–35 g',
  waterTarget: '2.5–3.0 L',
  hotDayWater: '3.0–3.5 L if sweating heavily',
  stepFloor: 3000,
  stepProgression: '4,000–5,000',
  eatingWindow: '12 PM–6 PM',
  sleep: 'about 2:30 AM–10:00 AM',
  sweetRule: 'Up to 2 small 100–150 kcal portions/week, after a meal',
  restaurantRule: 'Maximum 1 restaurant meal/week; never turn it into a cheat day',
  supplements: 'Creatine monohydrate 3–5 g/day is useful; whey is optional for protein convenience.'
};

const SESSION_ORDER = ['Upper A', 'Lower A', 'Rest', 'Upper B', 'Lower B', 'Conditioning', 'Rest'];

const CHECKLIST = [
  ['weight', 'Morning weight recorded', 'After bathroom, before food/drink, same scale.'],
  ['calories', 'Calories near target', 'Aim around 1,900 kcal; consistency matters more than perfection.'],
  ['protein', 'Protein minimum reached', 'At least 150 g; ideal target 165–175 g.'],
  ['vegetables', 'Vegetables at 2 meals', 'Build volume, fiber and micronutrients into lunch and dinner.'],
  ['fruit', '1–2 fruits', 'Use simple options such as guava, apple, orange, papaya or banana.'],
  ['water', 'Hydration target reached', 'Usually 2.5–3.0 L, more if heat/sweat genuinely requires it.'],
  ['steps', 'Step floor reached', 'At least 3,000; gradually move toward 4,000–5,000 without chasing 10,000.'],
  ['workout', 'Training completed as planned', 'Resistance session, conditioning session or deliberate recovery day.'],
  ['cardio', 'Programmed cardio completed', 'Tick this when cardio was prescribed today; on a true rest day you may tick it as not applicable/completed.'],
  ['tea', 'Only one sugary milk tea', 'Keep the planned 12 PM milk tea; avoid a second sugary tea.'],
  ['window', 'Eating window respected', 'Aim to finish by 6 PM; occasional 7–8 PM finish is acceptable.'],
  ['lateNight', 'No habitual late-night calories', 'Use water, unsweetened tea/coffee or a zero-calorie drink first.'],
  ['sleep', 'Sleep target protected', 'Aim for about 7–8 hours and keep sleep/wake timing reasonably consistent.']
];

const MEALS = [
  { day: 1, title: 'Chicken rice plate', meals: [
    '12 PM: 1.25 cups cooked rice (~250 g), 200 g cooked chicken, 1.5 cups vegetables, 150 g curd, 1 milk tea.',
    '3:15 PM: 2 eggs, 200 g curd/Greek yogurt, 1 fruit.',
    '5:45 PM: 2 chapati, ~150 g chicken curry, large vegetable serving, 100 g curd.'
  ]},
  { day: 2, title: 'Dosa + chicken', meals: [
    '12 PM: 2 dosa, 3 eggs, 120–150 g chicken curry, vegetables, 1 milk tea.',
    '3:15 PM: 250 g curd/Greek yogurt, 1 fruit, ~10 g almonds.',
    '5:45 PM: 1 cup rice (~200 g), 200 g chicken, 1/2 cup dal, 1–2 cups vegetables.'
  ]},
  { day: 3, title: 'Palaya soru day', meals: [
    '12 PM: ~200 g palaya soru, 200 g curd, 3 eggs, 150 g chicken, onion/chilli/vegetables, 1 milk tea.',
    '3:15 PM: 250 g curd/Greek yogurt and 1 guava.',
    '5:45 PM: 2 chapati, 200 g chicken curry, large vegetables, 1/2 cup dal.'
  ]},
  { day: 4, title: 'Rice + egg dinner', meals: [
    '12 PM: ~250 g cooked rice, 200 g chicken, 1/2 cup dal, ~200 g vegetables, 100–150 g curd, 1 milk tea.',
    '3:15 PM: 2 eggs, 1 fruit, 150–200 g curd.',
    '5:45 PM: 2 chapati, 3 eggs, vegetable curry, curd.'
  ]},
  { day: 5, title: 'Dosa + sambar', meals: [
    '12 PM: 2 dosa, 3 eggs, 150 g chicken, sambar, vegetables, 1 milk tea.',
    '3:15 PM: 250 g curd/Greek yogurt and banana or apple.',
    '5:45 PM: ~200 g cooked rice, 200 g chicken, vegetables, 1/2 cup dal.'
  ]},
  { day: 6, title: 'Flexible Indian meal day', meals: [
    '12 PM: 200–250 g cooked rice, 200 g chicken, vegetable curry, curd, 1 milk tea.',
    '3 PM: 2 eggs, fruit, curd.',
    '5:30 PM: 2 chapati + chicken curry + vegetables OR 2 dosa + 3 eggs + sambar + vegetables.'
  ]},
  { day: 7, title: 'Flexible/rest day', meals: [
    '12 PM: 2 dosa, 3 eggs, ~150 g chicken, sambar, vegetables, 1 milk tea.',
    '3 PM: 250 g curd/Greek yogurt, fruit.',
    '5:30 PM: ~200 g rice, 200 g chicken, vegetables, dal.'
  ]}
];

const GYM_WORKOUTS = {
  'Upper A': [
    ['Machine chest press', '8–12', '2 min'],
    ['Lat pulldown', '8–12', '2 min'],
    ['Seated cable row', '8–12', '2 min'],
    ['Machine shoulder press', '8–12', '90 sec'],
    ['Cable triceps pressdown', '10–15', '60–90 sec'],
    ['Dumbbell curl', '10–15', '60–90 sec']
  ],
  'Lower A': [
    ['Leg press', '8–12', '2 min'],
    ['Seated leg curl', '10–15', '90 sec'],
    ['Leg extension', '10–15', '90 sec'],
    ['Glute bridge / hip thrust', '8–12', '2 min'],
    ['Calf raise', '10–15', '60–90 sec'],
    ['Cable / machine core', '10–15', '60–90 sec']
  ],
  'Upper B': [
    ['Incline machine / dumbbell press', '8–12', '2 min'],
    ['Chest-supported row', '8–12', '2 min'],
    ['Neutral-grip pulldown', '8–12', '2 min'],
    ['Cable lateral raise', '12–15', '60–90 sec'],
    ['Triceps extension', '10–15', '60–90 sec'],
    ['Cable curl', '10–15', '60–90 sec']
  ],
  'Lower B': [
    ['Goblet squat or hack squat', '8–12', '2 min'],
    ['Romanian deadlift', '8–12', '2–3 min'],
    ['Leg press', '10–12', '2 min'],
    ['Seated leg curl', '10–15', '90 sec'],
    ['Calf raise', '10–15', '60–90 sec'],
    ['Plank', '30–60 sec', '60 sec']
  ],
  'Conditioning': [
    ['Incline treadmill / bike / elliptical', '30–40 min', 'RPE 5–6/10'],
    ['Optional core / arms / mobility', '10–15 min', 'Easy–moderate']
  ],
  'Rest': [['Recovery day', 'Easy walking / mobility', 'No hard training']]
};

const HOME_WORKOUTS = {
  'Upper A': [
    ['DB floor press', '8–15'], ['One-arm DB row', '8–15/side'], ['Band pulldown', '10–15'],
    ['DB shoulder press', '8–12'], ['DB curl', '10–15'], ['Band triceps extension', '10–15']
  ],
  'Lower A': [
    ['Goblet squat', '8–15'], ['DB Romanian deadlift', '8–15'], ['Bulgarian split squat', '8–12/leg'],
    ['DB hip thrust', '10–15'], ['Calf raise', '12–20']
  ],
  'Upper B': [
    ['Push-up', '8–20'], ['DB row', '10–15'], ['Band pulldown', '10–15'], ['DB lateral raise', '12–20'],
    ['DB curl', '10–15'], ['Band triceps pressdown', '10–15']
  ],
  'Lower B': [
    ['DB squat', '10–15'], ['DB Romanian deadlift', '8–15'], ['Reverse lunge', '8–12/leg'],
    ['DB hip thrust', '10–15'], ['Calf raise', '15–20']
  ],
  'Conditioning': [['Brisk walk / low-impact cardio', '30–45 min'], ['Optional skipping', 'Only if pain-free; very gradual intervals']],
  'Rest': [['Recovery day', 'Easy walking / mobility']]
};

let state = {
  user: null,
  activeTab: 'today',
  selectedDay: 1
};

const $ = (sel) => document.querySelector(sel);
const app = () => $('#app');

function esc(v='') {
  return String(v).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[s]));
}

async function hash(text) {
  const bytes = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

function userIndex() { return JSON.parse(localStorage.getItem('cutTrackerUsers') || '{}'); }
function saveUserIndex(data) { localStorage.setItem('cutTrackerUsers', JSON.stringify(data)); }
function profileKey(username) { return `cutTrackerProfile:${username.toLowerCase()}`; }
function sessionKey() { return 'cutTrackerSession'; }

function defaultProfile(username, startDate) {
  return {
    version: APP_VERSION,
    username,
    startDate,
    createdAt: new Date().toISOString(),
    settings: { calorieTarget: 1900, proteinTarget: 170, proteinMin: 150, stepFloor: 3000 },
    days: {},
    measurements: {},
    customSessionOrder: SESSION_ORDER,
  };
}

function saveProfile(profile) {
  localStorage.setItem(profileKey(profile.username), JSON.stringify(profile));
}

function loadProfile(username) {
  const raw = localStorage.getItem(profileKey(username));
  return raw ? JSON.parse(raw) : null;
}

function toISODateLocal(d) {
  const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function parseISODate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate()+days); return d; }
function dayDate(profile, dayNum) { return addDays(parseISODate(profile.startDate), dayNum-1); }
function currentDayNumber(profile) {
  const start = parseISODate(profile.startDate); const today = new Date();
  start.setHours(0,0,0,0); today.setHours(0,0,0,0);
  const n = Math.floor((today-start)/86400000)+1;
  return Math.max(1, Math.min(TOTAL_DAYS, n));
}
function weekOf(dayNum) { return Math.ceil(dayNum/7); }
function phaseFor(dayNum) {
  const w = weekOf(dayNum);
  if (w <= 2) return {n:1, name:'Adaptation & habits', weeks:'Weeks 1–2'};
  if (w <= 4) return {n:2, name:'Consistent fat loss', weeks:'Weeks 3–4'};
  if (w <= 8) return {n:3, name:'Main gym phase', weeks:'Weeks 5–8'};
  return {n:4, name:'Home transition', weeks:'Weeks 9–13'};
}
function defaultSessionForDay(profile, dayNum) {
  const order = profile.customSessionOrder || SESSION_ORDER;
  return order[(dayNum-1)%7] || 'Rest';
}
function setsAndRir(dayNum) {
  const w = weekOf(dayNum);
  if (w <= 2) return {sets:'2 working sets', rir:'RIR 3', note:'Technique first. No failure. Leave about 3 clean reps in reserve.'};
  if (w <= 4) return {sets:'3 sets on principal movements', rir:'RIR 2', note:'Begin progressive overload while keeping clean technique.'};
  if (w <= 8) return {sets:'3 sets main lifts; 2–3 sets accessories', rir:'RIR 1–2', note:'Hard but controlled. Avoid technical failure on demanding compounds.'};
  return {sets:'Usually 3 sets', rir:'RIR 1–2', note:'Use slower eccentrics, pauses, unilateral work or bands if dumbbells become too light.'};
}
function cardioPrescription(dayNum, session) {
  const w = weekOf(dayNum);
  if (session === 'Rest') return 'Recovery only; easy walking/mobility is fine.';
  if (session === 'Conditioning') return w <= 8 ? '30–40 min incline treadmill, bike or elliptical at RPE 5–6/10.' : '30–45 min brisk walking or low-impact cardio.';
  if (w <= 2) return '10–15 min low-impact cardio after 3 sessions this week.';
  if (w <= 4) return 'About 20 min low-impact cardio after 3–4 sessions this week.';
  if (w <= 8) return '20–30 min low-impact cardio after up to 4 sessions this week.';
  return 'Keep one dedicated conditioning day; optional easy walking after strength work.';
}
function getDay(profile, dayNum) {
  if (!profile.days[dayNum]) {
    profile.days[dayNum] = {
      date: toISODateLocal(dayDate(profile, dayNum)),
      session: defaultSessionForDay(profile, dayNum),
      checks: {}, weight:'', waist:'', calories:'', protein:'', water:'', steps:'', restaurantMeal:false, sweetPortion:false, notes:'', closed:false, closedAt:null
    };
  }
  return profile.days[dayNum];
}
function countChecks(day) { return CHECKLIST.filter(([k]) => day.checks?.[k]).length; }
function adherencePct(day) { return Math.round((countChecks(day)/CHECKLIST.length)*100); }
function weeklyFlexCounts(profile, dayNum) {
  const w=weekOf(dayNum), start=(w-1)*7+1, end=Math.min(TOTAL_DAYS,start+6);
  let restaurant=0, sweets=0;
  for(let d=start; d<=end; d++){ const log=profile.days[d]; if(log?.restaurantMeal) restaurant++; if(log?.sweetPortion) sweets++; }
  return {restaurant,sweets};
}
function closedDays(profile) { return Object.values(profile.days).filter(d=>d.closed).length; }

function getWeights(profile) {
  return Object.entries(profile.days)
    .map(([n,d]) => ({day:+n, weight:parseFloat(d.weight)}))
    .filter(x => Number.isFinite(x.weight))
    .sort((a,b)=>a.day-b.day);
}
function average(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null; }
function rolling7(profile, throughDay) {
  const vals=[];
  for(let d=Math.max(1,throughDay-6); d<=throughDay; d++) {
    const v=parseFloat(profile.days[d]?.weight); if(Number.isFinite(v)) vals.push(v);
  }
  return average(vals);
}
function weekAverage(profile, week) {
  const vals=[]; const start=(week-1)*7+1; const end=Math.min(TOTAL_DAYS,start+6);
  for(let d=start; d<=end; d++){ const v=parseFloat(profile.days[d]?.weight); if(Number.isFinite(v)) vals.push(v); }
  return average(vals);
}
function latestWeight(profile) {
  const arr=getWeights(profile); return arr.length ? arr[arr.length-1].weight : null;
}
function totalLoss(profile) {
  const current=latestWeight(profile); return current ? PLAN.startWeight-current : null;
}

function toast(msg) {
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
  setTimeout(()=>el.remove(),2200);
}

function renderLogin() {
  const today=toISODateLocal(new Date());
  app().innerHTML = `
    <div class="login-page">
      <div class="card login-card">
        <div class="kicker">90-day system</div>
        <h1>Cut Tracker</h1>
        <p>Your daily fat-loss checklist, training plan, weigh-ins and progress history in one place. Data is saved on this device.</p>
        <div class="field"><label>Profile name</label><input id="loginName" autocomplete="username" placeholder="e.g. Abdul" /></div>
        <div class="field" style="margin-top:12px"><label>4–8 digit PIN</label><input id="loginPin" type="password" inputmode="numeric" maxlength="8" autocomplete="current-password" placeholder="••••" /></div>
        <div class="field" style="margin-top:12px"><label>Program start date (used only when creating a new profile)</label><input id="startDate" type="date" value="${today}" /></div>
        <div class="actions"><button class="btn primary" id="loginBtn">Open / create profile</button></div>
        <div id="loginError" class="error"></div>
        <div class="login-note"><strong>Privacy:</strong> this login is a local profile lock, not an internet account. It separates profiles on this browser/device. Use Export Backup regularly if the history matters to you. The included README explains how to add real cloud authentication later.</div>
      </div>
    </div>`;
  $('#loginBtn').addEventListener('click', handleLogin);
  $('#loginPin').addEventListener('keydown', e=>{ if(e.key==='Enter') handleLogin(); });
}

async function handleLogin() {
  const name=$('#loginName').value.trim(); const pin=$('#loginPin').value.trim(); const startDate=$('#startDate').value;
  const err=$('#loginError'); err.textContent='';
  if(name.length<2) return err.textContent='Enter a profile name.';
  if(!/^\d{4,8}$/.test(pin)) return err.textContent='Use a 4–8 digit numeric PIN.';
  if(!startDate) return err.textContent='Choose a start date.';
  const idx=userIndex(); const key=name.toLowerCase(); const pinHash=await hash(`${key}:${pin}`);
  if(idx[key]) {
    if(idx[key].pinHash!==pinHash) return err.textContent='That PIN does not match this profile.';
  } else {
    idx[key]={name, pinHash}; saveUserIndex(idx); saveProfile(defaultProfile(name,startDate));
  }
  localStorage.setItem(sessionKey(), key); state.user=loadProfile(name); state.selectedDay=currentDayNumber(state.user); renderApp();
}

function renderApp() {
  const p=state.user; if(!p) return renderLogin();
  const current=currentDayNumber(p); const selected=state.selectedDay || current; const phase=phaseFor(selected);
  const week=weekOf(selected); const day=getDay(p,selected); saveProfile(p);
  const progress=Math.round((closedDays(p)/TOTAL_DAYS)*100);
  const rw=rolling7(p,current); const loss=totalLoss(p);
  app().innerHTML = `
  <div class="app-shell">
    <div class="topbar">
      <div class="brand"><div class="brand-mark">90</div><div><h1>Cut Tracker</h1><p>${esc(p.username)} · 108 kg start · 91 kg stretch</p></div></div>
      <div class="user-actions"><button class="btn" id="exportBtn">⇩ <span>Backup</span></button><button class="btn" id="logoutBtn">↪ <span>Logout</span></button></div>
    </div>

    <section class="card hero">
      <div>
        <span class="phase-badge">Phase ${phase.n} · ${phase.weeks}</span>
        <h2>Day ${selected} of 90</h2>
        <p>${phase.name}. Today is <strong>${formatDate(dayDate(p,selected))}</strong>. ${selected===current ? 'This is your current program day.' : 'You are viewing a different program day.'}</p>
      </div>
      <div class="progress-ring-wrap"><div class="progress-ring" style="--progress:${progress}%"><div class="inner"><strong>${progress}%</strong><span>${closedDays(p)} days closed</span></div></div></div>
    </section>

    <div class="grid grid-4" style="margin-bottom:14px">
      <div class="card metric"><small>7-day weight avg</small><strong>${rw ? rw.toFixed(1)+' kg' : '—'}</strong><span>Use trend, not single-day noise</span></div>
      <div class="card metric"><small>Total scale change</small><strong>${loss!==null ? (loss>=0?'−':' +')+Math.abs(loss).toFixed(1)+' kg' : '—'}</strong><span>Starting reference: 108 kg</span></div>
      <div class="card metric"><small>Daily calories</small><strong>${p.settings.calorieTarget}</strong><span>Review every 14 days</span></div>
      <div class="card metric"><small>Protein</small><strong>${p.settings.proteinTarget} g</strong><span>${p.settings.proteinMin} g minimum</span></div>
    </div>

    <nav class="tabs">
      ${tabButton('today','Today')}${tabButton('calendar','90 Days')}${tabButton('progress','Progress')}${tabButton('plan','Plan')}${tabButton('settings','Settings')}
    </nav>
    <main id="tabContent">${renderTabContent(p,selected)}</main>
  </div>`;
  bindAppEvents();
}

function tabButton(id,label){ return `<button class="tab ${state.activeTab===id?'active':''}" data-tab="${id}">${label}</button>`; }
function renderTabContent(p,dayNum) {
  if(state.activeTab==='calendar') return renderCalendar(p);
  if(state.activeTab==='progress') return renderProgress(p);
  if(state.activeTab==='plan') return renderPlan(p,dayNum);
  if(state.activeTab==='settings') return renderSettings(p);
  return renderToday(p,dayNum);
}

function renderToday(p, dayNum) {
  const d=getDay(p,dayNum); const phase=phaseFor(dayNum); const week=weekOf(dayNum); const training=setsAndRir(dayNum);
  const session=d.session || defaultSessionForDay(p,dayNum); const meal=MEALS[(dayNum-1)%7]; const flex=weeklyFlexCounts(p,dayNum);
  return `
  <section class="card padded" style="margin-bottom:14px">
    <div class="section-title"><h3>Daily numbers</h3><small>Autosaves on this device</small></div>
    <div class="form-grid">
      ${field('weight','Morning weight (kg)',d.weight,'number','0.1')}
      ${field('waist','Waist (optional, weekly)',d.waist,'number','0.1')}
      ${field('calories','Calories eaten',d.calories,'number','1')}
      ${field('protein','Protein (g)',d.protein,'number','1')}
      ${field('water','Water (L)',d.water,'number','0.1')}
      ${field('steps','Steps',d.steps,'number','1')}
      <div class="field"><label>Today's session</label><select data-dayfield="session">${['Upper A','Lower A','Upper B','Lower B','Conditioning','Rest'].map(x=>`<option ${x===session?'selected':''}>${x}</option>`).join('')}</select></div>
      <div class="field"><label>Daily adherence</label><input disabled value="${adherencePct(d)}% checklist complete" /></div>
    </div>
  </section>

  <div class="grid grid-2" style="margin-bottom:14px">
    <section class="card padded">
      <div class="section-title"><h3>Today's workout · ${esc(session)}</h3><span class="status-badge">Week ${week}</span></div>
      <div class="plan-callout"><strong>${training.sets} · ${training.rir}</strong><br><span class="tip">${training.note}</span></div>
      ${renderWorkoutTable(dayNum,session)}
      <p class="tip"><strong>Cardio:</strong> ${cardioPrescription(dayNum,session)}</p>
      <p class="tip"><strong>Progression:</strong> When you hit the top of the rep range across all prescribed sets with clean form, increase the load next time and return to the lower end of the rep range.</p>
    </section>
    <section class="card padded">
      <div class="section-title"><h3>Today's food template</h3><span class="status-badge">Rotation day ${meal.day}</span></div>
      <h4 style="margin:6px 0 10px">${meal.title}</h4>
      ${meal.meals.map(x=>`<p class="tip" style="font-size:13px">${x}</p>`).join('')}
      <div class="plan-callout" style="margin-top:12px"><strong>12 PM tea stays.</strong> One milk tea with sugar is budgeted into the day. Keep the rest of the drinks calorie-free unless part of a planned meal.</div>
    </section>
  </div>

  <section class="card padded" style="margin-bottom:14px">
    <div class="section-title"><h3>Weekly flexibility budget</h3><small>Week ${week}</small></div>
    <div class="grid grid-2">
      <label class="check-item ${d.restaurantMeal?'done':''}"><input type="checkbox" data-flex="restaurantMeal" ${d.restaurantMeal?'checked':''}/><div><strong>Restaurant meal today</strong><span>This week: ${flex.restaurant}/1 planned maximum. One meal, not a cheat day.</span></div></label>
      <label class="check-item ${d.sweetPortion?'done':''}"><input type="checkbox" data-flex="sweetPortion" ${d.sweetPortion?'checked':''}/><div><strong>Sweet portion today</strong><span>This week: ${flex.sweets}/2. Keep it around 100–150 kcal and preferably after a proper meal.</span></div></label>
    </div>
  </section>

  <section class="card padded" style="margin-bottom:14px">
    <div class="section-title"><h3>Daily checklist</h3><small>${countChecks(d)}/${CHECKLIST.length} complete</small></div>
    <div class="checklist">
      ${CHECKLIST.map(([k,title,desc])=>`<label class="check-item ${d.checks[k]?'done':''}"><input type="checkbox" data-check="${k}" ${d.checks[k]?'checked':''}/><div><strong>${title}</strong><span>${desc}</span></div></label>`).join('')}
    </div>
  </section>

  <section class="card padded">
    <div class="section-title"><h3>Notes & close day</h3><span class="status-badge ${d.closed?'complete':''}">${d.closed?'Closed':'Open'}</span></div>
    <div class="field"><label>Notes</label><textarea data-dayfield="notes" placeholder="Hunger, gym performance, restaurant meal, sleep, soreness, cravings, anything worth remembering...">${esc(d.notes)}</textarea></div>
    <div class="actions">
      <button class="btn ${d.closed?'secondary':'primary'}" id="closeDayBtn">${d.closed?'Reopen day':'Close Day '+dayNum}</button>
      ${dayNum>1?'<button class="btn" id="prevDayBtn">← Previous</button>':''}
      ${dayNum<TOTAL_DAYS?'<button class="btn" id="nextDayBtn">Next →</button>':''}
    </div>
    <p class="tip">Closing a day freezes nothing—you can reopen it and edit later. It simply marks the day complete in your 90-day calendar.</p>
  </section>`;
}

function renderWorkoutTable(dayNum, session) {
  const phase=phaseFor(dayNum); const source=phase.n===4?HOME_WORKOUTS:GYM_WORKOUTS; const rows=source[session]||source.Rest;
  if(phase.n===4) return `<table class="workout-table"><thead><tr><th>Exercise</th><th>Reps / duration</th><th>Sets</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${session==='Conditioning'||session==='Rest'?'—':'3'}</td></tr>`).join('')}</tbody></table>`;
  return `<table class="workout-table"><thead><tr><th>Exercise</th><th>Reps</th><th>Rest</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]||'—'}</td></tr>`).join('')}</tbody></table>`;
}

function field(key,label,value,type='text',step='') { return `<div class="field"><label>${label}</label><input data-dayfield="${key}" type="${type}" ${step?`step="${step}"`:''} value="${esc(value)}" /></div>`; }

function renderCalendar(p) {
  const current=currentDayNumber(p);
  return `<section class="card padded">
    <div class="section-title"><h3>Your 90 days</h3><small>Tap any day to open it</small></div>
    <div class="day-grid">${Array.from({length:TOTAL_DAYS},(_,i)=>{const n=i+1; const d=p.days[n]; const cls=d?.closed?'closed':d&&countChecks(d)>0?'partial':n>current?'future':''; return `<button class="day-cell ${cls} ${n===current?'current':''}" data-open-day="${n}" title="${formatDate(dayDate(p,n))}">${n}</button>`;}).join('')}</div>
    <div class="plan-callout" style="margin-top:14px">Green = closed day · amber = started but open · outlined = current program day.</div>
  </section>`;
}

function renderProgress(p) {
  const current=currentDayNumber(p); const rows=[];
  for(let w=1;w<=13;w++){
    const avg=weekAverage(p,w); const prev=w>1?weekAverage(p,w-1):null; const change=avg&&prev?avg-prev:null;
    const waistDays=Object.entries(p.days).filter(([n,d])=>weekOf(+n)===w && parseFloat(d.waist)).map(([n,d])=>parseFloat(d.waist));
    rows.push({w,avg,change,waist:waistDays.length?waistDays[waistDays.length-1]:null});
  }
  return `
  <div class="grid grid-2" style="margin-bottom:14px">
    <section class="card padded"><div class="section-title"><h3>Weight trend</h3><small>Daily weights + 7-day trend</small></div><div class="chart-wrap"><canvas id="weightChart"></canvas></div></section>
    <section class="card padded"><div class="section-title"><h3>Adjustment rule</h3><small>Review every 14 days</small></div>
      <div class="plan-copy"><ul>
      <li><strong>0.5–1.0%/week:</strong> do nothing.</li>
      <li><strong>&lt;0.5%/week for 2 weeks</strong> with genuine high adherence: reduce 100–150 kcal/day <em>or</em> add ~10 min cardio 2–3×/week.</li>
      <li><strong>&gt;1.25%/week for 2 weeks after Week 2:</strong> add 100–150 kcal/day, especially if training or recovery suffers.</li>
      <li><strong>5–7 day stall:</strong> do not react. Wait for the 14-day trend.</li>
      </ul></div>
    </section>
  </div>
  <section class="card padded">
    <div class="section-title"><h3>13-week log</h3><small>Weekly averages are calculated automatically</small></div>
    <div class="week-row head"><div>Week</div><div>Avg weight</div><div>Weekly change</div><div>Waist</div><div>Calories</div></div>
    ${rows.map(r=>`<div class="week-row"><div>Week ${r.w}</div><div>${r.avg?r.avg.toFixed(1)+' kg':'—'}</div><div>${r.change!==null?(r.change>0?'+':'')+r.change.toFixed(1)+' kg':'—'}</div><div>${r.waist?r.waist.toFixed(1):'—'}</div><div>${p.settings.calorieTarget}</div></div>`).join('')}
  </section>`;
}

function renderPlan(p,dayNum) {
  const ph=phaseFor(dayNum);
  return `<div class="grid grid-2">
    <section class="card padded plan-copy">
      <div class="section-title"><h3>Core targets</h3><span class="phase-badge">Current: Phase ${ph.n}</span></div>
      <ul>
        <li><strong>Calories:</strong> ~${p.settings.calorieTarget}/day initially.</li>
        <li><strong>Protein:</strong> ${p.settings.proteinTarget} g target; ${p.settings.proteinMin} g minimum.</li>
        <li><strong>Fat:</strong> ${PLAN.fatTarget}; <strong>carbs:</strong> ${PLAN.carbsTarget}.</li>
        <li><strong>Fiber:</strong> ${PLAN.fiberTarget}.</li>
        <li><strong>Steps:</strong> ${p.settings.stepFloor} floor; gradually ${PLAN.stepProgression}.</li>
        <li><strong>Eating window:</strong> ${PLAN.eatingWindow}; occasional 7–8 PM finish is acceptable.</li>
        <li><strong>Hydration:</strong> ${PLAN.waterTarget}; ${PLAN.hotDayWater}.</li>
      </ul>
      <h4>Pre-workout</h4><p>Train fasted if you feel good. Around 10 AM drink ~400–600 mL water. Black coffee is optional. During training, sip water according to thirst and sweat. If fasted training repeatedly makes you dizzy or unusually weak, use a small pre-workout meal instead.</p>
      <h4>Post-workout</h4><p>Your 12 PM meal should be substantial: roughly 40–60 g protein, carbohydrate, vegetables and some fat. The planned milk tea fits here.</p>
      <h4>Restaurant & sweets</h4><p>${PLAN.restaurantRule}. ${PLAN.sweetRule}. For a midnight craving, first use water and wait; then unsweetened tea/coffee or a zero-calorie drink. If it is true hunger rather than a passing craving, move more of the day's planned calories toward the final meal instead of repeatedly white-knuckling hunger.</p>
    </section>
    <section class="card padded plan-copy">
      <div class="section-title"><h3>90-day phases</h3><small>One continuous program</small></div>
      <h4>Phase 1 · Weeks 1–2</h4><p>Adapt to training and habits. Two working sets per exercise, RIR 3, short low-impact cardio. Keep calories near target and learn portions.</p>
      <h4>Phase 2 · Weeks 3–4</h4><p>Move most principal exercises to 3 sets at about RIR 2. Cardio rises toward ~20 minutes after 3–4 sessions.</p>
      <h4>Phase 3 · Weeks 5–8</h4><p>Main gym phase. Keep progressive overload, most hard sets at RIR 1–2, and 20–30 minutes of low-impact cardio on up to 4 sessions.</p>
      <h4>Phase 4 · Weeks 9–13</h4><p>Move to dumbbells, bodyweight and resistance bands at home. Preserve muscular effort and keep one dedicated conditioning day. Skipping remains optional and should only be introduced gradually if feet, ankles, knees and Achilles feel completely fine.</p>
      <h4>Scale goal</h4><p><strong>91 kg is a stretch goal, not a deadline.</strong> A very successful outcome is around ${PLAN.realisticEnd} with a smaller waist and good strength retention.</p>
      <h4>Supplements</h4><p>${PLAN.supplements} Creatine can add temporary intracellular water and raise scale weight without adding body fat. Fat burners are unnecessary.</p>
    </section>
  </div>`;
}

function renderSettings(p) {
  const installed = isStandaloneMode();
  return `<div class="grid">
    <section class="card padded install-card">
      <div class="section-title"><h3>Android app</h3><span class="status-badge ${installed ? 'complete' : ''}">${installed ? 'Installed' : 'PWA ready'}</span></div>
      <p class="tip" style="font-size:13px;line-height:1.6;margin:0 0 10px">${esc(pwaInstallStatusText())}</p>
      <div class="actions">
        <button class="btn primary" id="installAppBtn" ${installed ? 'disabled' : ''}>${installed ? 'Installed ✓' : 'Install on this phone'}</button>
      </div>
      <div class="plan-callout" style="margin-top:14px"><strong>Offline-ready:</strong> after the first successful online load, the app shell is cached so the tracker can open without a connection. Your logs still save locally on this device.</div>
    </section>
    <section class="card padded">
      <div class="section-title"><h3>Settings & backup</h3><small>Changes save locally</small></div>
      <div class="form-grid">
        <div class="field"><label>Program start date</label><input id="settingStart" type="date" value="${esc(p.startDate)}"></div>
        <div class="field"><label>Daily calorie target</label><input id="settingCalories" type="number" value="${p.settings.calorieTarget}"></div>
        <div class="field"><label>Protein target (g)</label><input id="settingProtein" type="number" value="${p.settings.proteinTarget}"></div>
        <div class="field"><label>Step floor</label><input id="settingSteps" type="number" value="${p.settings.stepFloor}"></div>
      </div>
      <div class="actions">
        <button class="btn primary" id="saveSettingsBtn">Save settings</button>
        <button class="btn secondary" id="importBtn">Import backup</button>
        <button class="btn danger" id="resetBtn">Reset profile data</button>
        <input type="file" id="importFile" accept="application/json" class="hidden">
      </div>
      <div class="plan-callout" style="margin-top:14px"><strong>Storage model:</strong> your data lives in browser localStorage. It survives normal refreshes and browser restarts, but clearing site data can erase it. Export a backup periodically. For true multi-device cloud sync, use the Supabase upgrade instructions in README.</div>
    </section>
  </div>`;
}

function bindAppEvents() {
  document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',()=>{state.activeTab=el.dataset.tab; renderApp(); afterRender();}));
  $('#logoutBtn')?.addEventListener('click',()=>{localStorage.removeItem(sessionKey()); state.user=null; renderLogin();});
  $('#exportBtn')?.addEventListener('click',exportBackup);
  document.querySelectorAll('[data-dayfield]').forEach(el=>el.addEventListener('change',saveDayField));
  document.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',saveCheck));
  document.querySelectorAll('[data-flex]').forEach(el=>el.addEventListener('change',saveFlex));
  $('#closeDayBtn')?.addEventListener('click',toggleCloseDay);
  $('#prevDayBtn')?.addEventListener('click',()=>{state.selectedDay--; renderApp();});
  $('#nextDayBtn')?.addEventListener('click',()=>{state.selectedDay++; renderApp();});
  document.querySelectorAll('[data-open-day]').forEach(el=>el.addEventListener('click',()=>{state.selectedDay=+el.dataset.openDay; state.activeTab='today'; renderApp();}));
  $('#installAppBtn')?.addEventListener('click',installPwa);
  $('#saveSettingsBtn')?.addEventListener('click',saveSettings);
  $('#importBtn')?.addEventListener('click',()=>$('#importFile').click());
  $('#importFile')?.addEventListener('change',importBackup);
  $('#resetBtn')?.addEventListener('click',resetProfile);
  afterRender();
}

function afterRender(){ if(state.activeTab==='progress') requestAnimationFrame(()=>drawWeightChart(state.user)); }
function saveDayField(e) {
  const p=state.user, d=getDay(p,state.selectedDay), key=e.target.dataset.dayfield; d[key]=e.target.value; saveProfile(p); toast('Saved');
  if(['weight','waist','calories','protein','water','steps','session'].includes(key)) renderApp();
}
function saveCheck(e) {
  const p=state.user, d=getDay(p,state.selectedDay); d.checks[e.target.dataset.check]=e.target.checked; saveProfile(p); renderApp();
}
function saveFlex(e) {
  const p=state.user, d=getDay(p,state.selectedDay); d[e.target.dataset.flex]=e.target.checked; saveProfile(p); renderApp();
}
function toggleCloseDay(){ const d=getDay(state.user,state.selectedDay); d.closed=!d.closed; d.closedAt=d.closed?new Date().toISOString():null; saveProfile(state.user); toast(d.closed?'Day closed ✓':'Day reopened'); renderApp(); }
function saveSettings(){
  const p=state.user; const date=$('#settingStart').value; const cal=parseInt($('#settingCalories').value); const pro=parseInt($('#settingProtein').value); const st=parseInt($('#settingSteps').value);
  if(date) p.startDate=date; if(cal>1000) p.settings.calorieTarget=cal; if(pro>80) p.settings.proteinTarget=pro; if(st>=1000) p.settings.stepFloor=st;
  saveProfile(p); state.selectedDay=currentDayNumber(p); toast('Settings saved'); renderApp();
}
function exportBackup(){
  const p=state.user; const blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download=`cut-tracker-${p.username}-${toISODateLocal(new Date())}.json`; a.click(); URL.revokeObjectURL(url); toast('Backup downloaded');
}
function importBackup(e){
  const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=>{try{const data=JSON.parse(reader.result); if(!data.username||!data.days) throw new Error(); data.username=state.user.username; state.user=data; saveProfile(data); toast('Backup imported'); renderApp();}catch{alert('This file does not look like a valid Cut Tracker backup.');}}; reader.readAsText(f);
}
function resetProfile(){
  if(!confirm('Reset all day logs for this profile? This cannot be undone unless you exported a backup.')) return;
  const fresh=defaultProfile(state.user.username,state.user.startDate); fresh.settings={...state.user.settings}; state.user=fresh; saveProfile(fresh); state.selectedDay=1; toast('Profile reset'); renderApp();
}

function drawWeightChart(p) {
  const c=$('#weightChart'); if(!c) return; const ctx=c.getContext('2d'); const rect=c.getBoundingClientRect(); const dpr=window.devicePixelRatio||1;
  c.width=rect.width*dpr; c.height=rect.height*dpr; ctx.scale(dpr,dpr); const W=rect.width,H=rect.height; ctx.clearRect(0,0,W,H);
  const weights=getWeights(p); ctx.font='12px system-ui'; ctx.fillStyle='#9fb0c7';
  if(weights.length<2){ctx.fillText('Add at least two morning weights to see your trend.',18,32);return;}
  const vals=weights.map(x=>x.weight); const min=Math.floor(Math.min(...vals)-1); const max=Math.ceil(Math.max(...vals)+1); const pad={l:42,r:16,t:18,b:30};
  const x=d=>pad.l+((d-1)/(TOTAL_DAYS-1))*(W-pad.l-pad.r); const y=v=>pad.t+(max-v)/(max-min)*(H-pad.t-pad.b);
  ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1;
  for(let i=0;i<5;i++){const yy=pad.t+i*(H-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(W-pad.r,yy);ctx.stroke(); const val=max-i*(max-min)/4;ctx.fillStyle='#9fb0c7';ctx.fillText(val.toFixed(1),4,yy+4);}
  ctx.strokeStyle='#5fb2ff';ctx.lineWidth=2;ctx.beginPath();weights.forEach((pt,i)=>{const xx=x(pt.day),yy=y(pt.weight);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});ctx.stroke();
  const trend=[]; for(let d=1;d<=TOTAL_DAYS;d++){const a=rolling7(p,d); if(a && Array.from({length:7},(_,i)=>p.days[d-i]?.weight).filter(Boolean).length>=3) trend.push({day:d,weight:a});}
  if(trend.length>1){ctx.strokeStyle='#52d273';ctx.lineWidth=3;ctx.beginPath();trend.forEach((pt,i)=>{const xx=x(pt.day),yy=y(pt.weight);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});ctx.stroke();}
  ctx.fillStyle='#9fb0c7';ctx.fillText('Day 1',pad.l,H-7);ctx.fillText('Day 90',W-pad.r-42,H-7);
  ctx.fillStyle='#5fb2ff';ctx.fillRect(W-190,8,12,3);ctx.fillStyle='#cfe7ff';ctx.fillText('Daily',W-172,13);ctx.fillStyle='#52d273';ctx.fillRect(W-118,8,12,3);ctx.fillStyle='#cfe7ff';ctx.fillText('7-day avg',W-100,13);
}

function formatDate(d){ return new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(d); }

(function init(){
  const session=localStorage.getItem(sessionKey()); const idx=userIndex();
  if(session && idx[session]) { state.user=loadProfile(idx[session].name); if(state.user){state.selectedDay=currentDayNumber(state.user);renderApp();return;} }
  renderLogin();
})();

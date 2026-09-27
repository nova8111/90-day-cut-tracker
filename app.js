const APP_VERSION = 4;
const TOTAL_DAYS = 90;

let deferredInstallPrompt = null;
let waterReminderTimer = null;

const PLAN = {
  startWeight: 108,
  stretchGoal: 91,
  realisticEnd: '96–100 kg',
  calories: 1900,
  proteinTarget: 170,
  proteinMin: 150,
  waterTarget: 2.5,
  stepFloor: 3000,
  eatingWindow: '12 PM–6 PM',
  sleep: 'about 2:30 AM–10:00 AM'
};

const DAILY_QUOTES = [
  'You do not need a perfect day. You need a completed day.',
  'Win the next decision, then repeat.',
  'Consistency is what turns effort into visible change.',
  'Today is one vote for the person you are becoming.',
  'Keep the promise you made to yourself this morning.',
  'A controlled day beats an extreme day every time.',
  'Do the basics well enough, long enough, and they become results.',
  'Your job today is simple: follow the plan, not the mood.',
  'Small disciplined choices compound faster than motivation.',
  'Do not chase perfection. Protect the streak.',
  'Every meal logged is one less decision left to chance.',
  'Train with purpose. Eat with intention. Recover without guilt.',
  'You are building proof that you can trust yourself.',
  'Fat loss happens quietly before it becomes obvious.',
  'The scale is data. Your habits are the engine.',
  'One difficult hour does not need to become a difficult day.',
  'Finish today in a way tomorrow-you will respect.',
  'Strong routines make weak moments easier.',
  'You can want the craving without obeying it.',
  'Progress is often boring. That is why it works.',
  'Keep training hard enough to remind your body what to keep.',
  'Your next meal matters more than your last mistake.',
  'A good plan followed imperfectly beats a perfect plan abandoned.',
  'The goal is not punishment. The goal is control.',
  'You are not starting over each morning; you are continuing.',
  'Let hunger be information, not an instruction.',
  'The mirror changes after the habits do.',
  'Make the easy choice the planned choice.',
  'Do not negotiate with the plan when you are tired.',
  'Another ordinary day done well is a serious achievement.',
  'Strength maintained while weight drops is a win.',
  'You only need enough motivation to begin; routine can finish the job.',
  'A craving passes. The result of your choice stays longer.',
  'Keep your standards high and your process simple.',
  'The fastest useful progress is the progress you can keep.',
  'You are training discipline at the same time as muscle.',
  'Measure the trend, not the emotion of one weigh-in.',
  "Do not spend tomorrow's calories fixing today's feelings.",
  'Your body responds to repeated weeks, not isolated moments.',
  'A planned restaurant meal is still part of the plan.',
  'You do not have to feel ready to act ready.',
  'Build a day you can repeat, not one you need to recover from.',
  'Keep showing up until the routine feels more normal than quitting.',
  'The work that feels small today becomes visible later.',
  'Control the portions and you can keep the foods you enjoy.',
  'Your strength sessions are an investment in the weight you want to keep.',
  'Do not let one number erase a week of good behavior.',
  'Eat for the goal you chose, not the impulse that appeared.',
  'Halfway is not a reason to relax; it is proof the system is working.',
  'Momentum is easier to protect than rebuild.',
  "The late-night craving has no authority over tomorrow's goal.",
  'You are allowed to be tired and still be consistent.',
  'The plan does not need excitement. It needs execution.',
  'Your waistline cannot hide consistent weeks forever.',
  'Keep the deficit controlled and the training serious.',
  'A missed target is feedback, not permission to abandon the day.',
  'The next seven days can change the story of the last seven.',
  'Do not rush the result so hard that you damage the process.',
  'Every workout completed while dieting protects more than calories.',
  'Choose the action that makes tonight easier, not just the next five minutes.',
  'The strongest version of you is built through repeated ordinary choices.',
  'Let the plan decide before hunger and convenience start negotiating.',
  'If the trend is moving, your job is to stay patient.',
  'You are closer because you kept going on the unremarkable days.',
  "Today's discipline is tomorrow's confidence.",
  'Do not confuse temporary water weight with failed fat loss.',
  'Keep meals simple enough that consistency has nowhere to hide.',
  'You can finish strong without becoming extreme.',
  'The aim is leaner, stronger, and healthier—not simply lighter.',
  'A good final month is built one closed day at a time.',
  'Protect protein, protect training, protect the routine.',
  'The difficult choice becomes easier each time you repeat it.',
  'Make tonight boring enough that tomorrow feels successful.',
  'You have already done too much work to hand control back to old habits.',
  "The result is getting closer even when today's mirror looks the same.",
  'Finish the meal you planned, not the one your appetite improvises.',
  'Your body is adapting; keep giving it a consistent signal.',
  'Do not celebrate progress by abandoning the habits that created it.',
  'The final weeks reward patience more than panic.',
  'Stay aggressive about consistency, not about starving yourself.',
  'The best finish is one that leaves you stronger for what comes next.',
  'Keep the routine clean when motivation gets noisy.',
  'One more controlled day is one more step away from your old baseline.',
  'Use the data, make small adjustments, and keep moving.',
  'The finish line does not need a sprint if your pace is working.',
  'You are proving that structure can beat impulse.',
  'Close today with fewer excuses than you opened it with.',
  'The last stretch is where consistency becomes identity.',
  'Do not chase a number at the cost of the physique you are building.',
  'Day 90 is not an ending; it is evidence that you can run the system again.'
];

const SESSION_ORDER = ['Upper A', 'Lower A', 'Rest', 'Upper B', 'Lower B', 'Conditioning', 'Rest'];

const FOOD = {
  rice: { name:'White rice', serving:'1 cup cooked (~200 g)', kcal:260, p:5, c:57, f:0.5, factors:[0.5,0.75,1,1.25,1.5] },
  palaya: { name:'Palaya soru / pazhaya soru', serving:'1 cup (~200 g)', kcal:250, p:5, c:55, f:0.5, factors:[0.5,0.75,1,1.25,1.5] },
  dosa: { name:'Dosa', serving:'1 medium dosa', kcal:170, p:4, c:30, f:4, factors:[1,2,3,4], count:'dosa' },
  chapati: { name:'Chapati', serving:'1 medium chapati', kcal:120, p:4, c:22, f:3, factors:[1,2,3,4], count:'chapati' },
  egg: { name:'Whole egg', serving:'1 large egg', kcal:70, p:6, c:0.4, f:5, factors:[1,2,3,4], count:'egg' },
  chicken: { name:'Chicken, cooked lean', serving:'100 g cooked', kcal:165, p:31, c:0, f:3.6, factors:[1,1.5,2,2.5] },
  chickenCurry: { name:'Chicken curry', serving:'100 g chicken + gravy', kcal:200, p:24, c:5, f:9, factors:[1,1.5,2,2.5] },
  fish: { name:'Fish, cooked', serving:'100 g', kcal:180, p:24, c:0, f:8, factors:[1,1.5,2] },
  dal: { name:'Dal', serving:'½ cup (~100 g)', kcal:120, p:7, c:20, f:2, factors:[0.5,1,1.5,2] },
  sambar: { name:'Sambar', serving:'1 cup (~200 g)', kcal:130, p:6, c:20, f:3, factors:[0.5,1,1.5] },
  veg: { name:'Vegetable poriyal/curry', serving:'1 cup (~150 g)', kcal:90, p:4, c:15, f:2, factors:[0.5,1,1.5,2] },
  curd: { name:'Plain curd', serving:'150 g', kcal:95, p:5, c:7, f:5, factors:[0.5,1,1.5,2] },
  greek: { name:'High-protein/Greek yogurt', serving:'200 g', kcal:130, p:20, c:8, f:2, factors:[0.5,1,1.5] },
  tea: { name:'Milk tea with sugar', serving:'1 cup', kcal:100, p:3, c:15, f:3, factors:[1], count:'cup' },
  guava: { name:'Guava', serving:'1 medium (~150 g)', kcal:100, p:4, c:21, f:1, factors:[0.5,1,1.5], count:'portion' },
  apple: { name:'Apple', serving:'1 medium', kcal:95, p:0.5, c:25, f:0.3, factors:[0.5,1,1.5], count:'portion' },
  orange: { name:'Orange', serving:'1 medium', kcal:65, p:1.3, c:16, f:0.2, factors:[1,2], count:'orange' },
  papaya: { name:'Papaya', serving:'1 cup (~150 g)', kcal:65, p:1, c:16, f:0.4, factors:[0.5,1,1.5,2] },
  banana: { name:'Banana', serving:'1 medium', kcal:105, p:1.3, c:27, f:0.4, factors:[0.5,1,1.5], count:'portion' },
  almonds: { name:'Almonds', serving:'10 g', kcal:58, p:2.1, c:2.2, f:5, factors:[1,2,3] },
  whey: { name:'Whey protein (optional)', serving:'1 scoop (~30 g)', kcal:120, p:24, c:3, f:2, factors:[0.5,1,1.5], count:'scoop' },
  chocolate: { name:'Planned chocolate treat', serving:'20 g', kcal:110, p:1.5, c:12, f:6.5, factors:[0.5,1] },
  gulab: { name:'Small gulab jamun', serving:'1 small piece', kcal:150, p:2, c:24, f:5, factors:[1], count:'piece' },
  icecream: { name:'Ice cream', serving:'1 small scoop (~70 g)', kcal:130, p:2.5, c:18, f:5.5, factors:[1], count:'scoop' }
};

const MEAL_SLOTS = [
  { id:'post', label:'12:00 PM · Post-workout meal', foods:['rice','palaya','dosa','chapati','egg','chicken','chickenCurry','fish','dal','sambar','veg','curd','greek','tea'] },
  { id:'snack', label:'3:00–3:30 PM · Protein mini-meal', foods:['egg','curd','greek','guava','apple','orange','papaya','banana','almonds','whey','chocolate','gulab','icecream'] },
  { id:'dinner', label:'5:30–6:00 PM · Final meal', foods:['rice','palaya','dosa','chapati','egg','chicken','chickenCurry','fish','dal','sambar','veg','curd','greek'] }
];

const CHEAT_PRESETS = {
  biryani: { name:'Chicken biryani · normal plate + raita', kcal:850, p:35, c:105, f:28 },
  biryaniLarge: { name:'Large biryani / richer restaurant meal', kcal:1050, p:40, c:125, f:40 },
  grilled: { name:'Grilled chicken + rice restaurant meal', kcal:650, p:50, c:65, f:18 }
};

const GYM_TEMPLATES = {
  'Upper A': [
    ['Machine chest press','8–12','2 min'],['Lat pulldown','8–12','2 min'],['Seated cable row','8–12','2 min'],
    ['Machine shoulder press','8–12','90 sec'],['Cable triceps pressdown','10–15','60–90 sec'],['Dumbbell curl','10–15','60–90 sec']
  ],
  'Lower A': [
    ['Leg press','8–12','2 min'],['Seated leg curl','10–15','90 sec'],['Leg extension','10–15','90 sec'],
    ['Glute bridge / hip thrust','8–12','2 min'],['Calf raise','10–15','60–90 sec'],['Cable / machine core','10–15','60–90 sec']
  ],
  'Upper B': [
    ['Incline machine / dumbbell press','8–12','2 min'],['Chest-supported row','8–12','2 min'],['Neutral-grip pulldown','8–12','2 min'],
    ['Cable lateral raise','12–15','60–90 sec'],['Triceps extension','10–15','60–90 sec'],['Cable curl','10–15','60–90 sec']
  ],
  'Lower B': [
    ['Goblet squat or hack squat','8–12','2 min'],['Romanian deadlift','8–12','2–3 min'],['Leg press','10–12','2 min'],
    ['Seated leg curl','10–15','90 sec'],['Calf raise','10–15','60–90 sec'],['Plank','30–60 sec','60 sec']
  ],
  'Conditioning': [['Incline treadmill / bike / elliptical','30–40 min','RPE 5–6/10'],['Core / arms / mobility','10–15 min','Easy–moderate']],
  'Rest': [['Recovery day','Easy walking / mobility','No hard training']]
};

const HOME_TEMPLATES = {
  'Upper A': [['DB floor press','8–15','90 sec'],['One-arm DB row','8–15/side','90 sec'],['Band pulldown','10–15','90 sec'],['DB shoulder press','8–12','90 sec'],['DB curl','10–15','60 sec'],['Band triceps extension','10–15','60 sec']],
  'Lower A': [['Goblet squat','8–15','2 min'],['DB Romanian deadlift','8–15','2 min'],['Bulgarian split squat','8–12/leg','90 sec'],['DB hip thrust','10–15','90 sec'],['Calf raise','12–20','60 sec']],
  'Upper B': [['Push-up','8–20','90 sec'],['DB row','10–15','90 sec'],['Band pulldown','10–15','90 sec'],['DB lateral raise','12–20','60 sec'],['DB curl','10–15','60 sec'],['Band triceps pressdown','10–15','60 sec']],
  'Lower B': [['DB squat','10–15','2 min'],['DB Romanian deadlift','8–15','2 min'],['Reverse lunge','8–12/leg','90 sec'],['DB hip thrust','10–15','90 sec'],['Calf raise','15–20','60 sec']],
  'Conditioning': [['Brisk walk / low-impact cardio','30–45 min','RPE 5–6/10'],['Optional skipping','5 × 20 sec','Only if pain-free']],
  'Rest': [['Recovery day','Easy walking / mobility','No hard training']]
};

let state = { user:null, activeTab:'today', selectedDay:1 };
const $ = s => document.querySelector(s);
const app = () => $('#app');

function esc(v='') { return String(v).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[s])); }
function round1(n){ return Math.round(n*10)/10; }
function uid(){ return `${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`; }

async function hash(text) {
  const bytes = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

function isStandaloneMode(){ return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone===true; }
function pwaInstallStatusText(){
  if(isStandaloneMode()) return 'Installed on this phone';
  if(deferredInstallPrompt) return 'Ready to install';
  return 'Open in Chrome over HTTPS, then use Install app / Add to Home screen.';
}
async function installPwa(){
  if(isStandaloneMode()) return toast('App is already installed');
  if(!deferredInstallPrompt) return alert('Chrome has not offered the install prompt. Use Chrome menu → Add to Home screen / Install app.');
  deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt=null; renderApp();
}
window.addEventListener('beforeinstallprompt', e=>{e.preventDefault();deferredInstallPrompt=e;if(state.user)renderApp();});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;toast('Cut Tracker installed ✓');if(state.user)renderApp();});
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{})); }

function userIndex(){ return JSON.parse(localStorage.getItem('cutTrackerUsers')||'{}'); }
function saveUserIndex(v){ localStorage.setItem('cutTrackerUsers',JSON.stringify(v)); }
function profileKey(username){ return `cutTrackerProfile:${username.toLowerCase()}`; }
function sessionKey(){ return 'cutTrackerSession'; }

function defaultProfile(username,startDate){
  return {
    version:APP_VERSION, username,startDate,createdAt:new Date().toISOString(), days:{},
    settings:{ calorieTarget:1900,proteinTarget:170,proteinMin:150,stepFloor:3000,waterTarget:2.5,waterReminders:false,waterReminderEvery:2,lastWaterReminderAt:null },
    customFoods:{},
    customSessionOrder:[...SESSION_ORDER]
  };
}

function migrateProfile(p){
  if(!p) return p;
  p.version=APP_VERSION;
  p.days ||= {};
  p.settings ||= {};
  p.settings.calorieTarget ||= 1900;
  p.settings.proteinTarget ||= 170;
  p.settings.proteinMin ||= 150;
  p.settings.stepFloor ||= 3000;
  p.settings.waterTarget ||= 2.5;
  if(typeof p.settings.waterReminders!=='boolean') p.settings.waterReminders=false;
  p.settings.waterReminderEvery ||= 2;
  p.settings.lastWaterReminderAt ||= null;
  p.customFoods ||= {};
  p.customSessionOrder ||= [...SESSION_ORDER];
  Object.values(p.days).forEach(d=>{
    d.checks ||= {};
    d.meals ||= [];
    if(!d.meals.length && (d.calories || d.protein)) {
      d.meals.push({id:uid(),slot:'legacy',legacy:true,name:'Previous manual total',qtyLabel:'Imported from the previous tracker version',kcal:+d.calories||0,p:+d.protein||0,c:0,f:0});
    }
    d.exercises ||= [];
    d.exerciseDone ||= {};
    d.session ||= 'Rest';
    d.cheatMeal = Boolean(d.cheatMeal ?? d.restaurantMeal);
    if(d.water===undefined) d.water='';
    if(d.steps===undefined) d.steps='';
  });
  return p;
}
function saveProfile(p){ localStorage.setItem(profileKey(p.username),JSON.stringify(p)); }
function loadProfile(username){ const raw=localStorage.getItem(profileKey(username)); return raw?migrateProfile(JSON.parse(raw)):null; }

function toISODateLocal(d){ const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`; }
function parseISODate(s){ const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d); }
function addDays(date,days){ const d=new Date(date);d.setDate(d.getDate()+days);return d; }
function dayDate(p,n){ return addDays(parseISODate(p.startDate),n-1); }
function currentDayNumber(p){ const a=parseISODate(p.startDate),b=new Date();a.setHours(0,0,0,0);b.setHours(0,0,0,0);return Math.max(1,Math.min(TOTAL_DAYS,Math.floor((b-a)/86400000)+1)); }
function weekOf(n){ return Math.ceil(n/7); }
function phaseFor(n){ const w=weekOf(n);if(w<=2)return{n:1,name:'Adaptation & habits',weeks:'Weeks 1–2'};if(w<=4)return{n:2,name:'Consistent fat loss',weeks:'Weeks 3–4'};if(w<=8)return{n:3,name:'Main gym phase',weeks:'Weeks 5–8'};return{n:4,name:'Home transition',weeks:'Weeks 9–13'}; }
function defaultSessionForDay(p,n){ return (p.customSessionOrder||SESSION_ORDER)[(n-1)%7]||'Rest'; }
function trainingMode(n){ return weekOf(n)<=8?'Gym':'Home'; }
function templatesForDay(n){ return trainingMode(n)==='Gym'?GYM_TEMPLATES:HOME_TEMPLATES; }
function effortFor(n){ const w=weekOf(n);if(w<=2)return{sets:2,rir:'RIR 3',note:'Technique first; leave about 3 clean reps in reserve.'};if(w<=4)return{sets:3,rir:'RIR 2',note:'Progress gradually with clean technique.'};return{sets:3,rir:'RIR 1–2',note:w<=8?'Hard but controlled; avoid technical failure on demanding compounds.':'Use tempo, pauses, unilateral work or bands if dumbbells become too light.'}; }

function getDay(p,n){
  if(!p.days[n]){
    p.days[n]={ date:toISODateLocal(dayDate(p,n)),session:defaultSessionForDay(p,n),checks:{},weight:'',waist:'',water:'',steps:'',meals:[],exercises:[],exerciseDone:{},cheatMeal:false,notes:'',closed:false,closedAt:null };
  }
  const d=p.days[n]; d.meals ||= [];d.exercises ||= [];d.exerciseDone ||= {};d.checks ||= {};return d;
}

function mealTotals(d){
  return d.meals.reduce((a,x)=>({kcal:a.kcal+(+x.kcal||0),p:a.p+(+x.p||0),c:a.c+(+x.c||0),f:a.f+(+x.f||0)}),{kcal:0,p:0,c:0,f:0});
}
function workoutComplete(d){
  if(d.session==='Rest') return true;
  if(!d.exercises.length) return false;
  return d.exercises.every(x=>d.exerciseDone[x.id]);
}
function checklistState(p,d){
  const t=mealTotals(d), cal=p.settings.calorieTarget, water=+d.water||0, steps=+d.steps||0;
  return [
    ['weight','Weight',Number.isFinite(parseFloat(d.weight))],
    ['calories','Calories',t.kcal>=cal-300 && t.kcal<=cal+150],
    ['protein','Protein',t.p>=p.settings.proteinMin],
    ['water','Water',water>=p.settings.waterTarget],
    ['steps','Steps',steps>=p.settings.stepFloor],
    ['workout','Workout',workoutComplete(d)],
    ['window','Eating window',Boolean(d.checks.window)],
    ['sleep','Sleep',Boolean(d.checks.sleep)]
  ];
}
function adherencePct(p,d){ const arr=checklistState(p,d);return Math.round(arr.filter(x=>x[2]).length/arr.length*100); }
function closedDays(p){ return Object.values(p.days).filter(d=>d.closed).length; }
function getWeights(p){ return Object.entries(p.days).map(([n,d])=>({day:+n,weight:parseFloat(d.weight)})).filter(x=>Number.isFinite(x.weight)).sort((a,b)=>a.day-b.day); }
function average(a){ return a.length?a.reduce((x,y)=>x+y,0)/a.length:null; }
function rolling7(p,through){ const vals=[];for(let n=Math.max(1,through-6);n<=through;n++){const v=parseFloat(p.days[n]?.weight);if(Number.isFinite(v))vals.push(v);}return average(vals); }
function weekAverage(p,w){ const vals=[];for(let n=(w-1)*7+1;n<=Math.min(TOTAL_DAYS,w*7);n++){const v=parseFloat(p.days[n]?.weight);if(Number.isFinite(v))vals.push(v);}return average(vals); }
function latestWeight(p){ const a=getWeights(p);return a.length?a[a.length-1].weight:null; }
function totalLoss(p){ const w=latestWeight(p);return w===null?null:PLAN.startWeight-w; }

function foodQuantityLabel(food,factor){
  if(food.count){ const rounded=Number.isInteger(factor)?factor:factor; const plural=factor===1?food.count:`${food.count}s`;return `${rounded} ${plural}`; }
  if(factor===1) return food.serving;
  return `${factor} × ${food.serving}`;
}
function getFood(p,id){ return FOOD[id] || p.customFoods?.[id] || null; }
function customFoodIds(p){ return Object.keys(p.customFoods||{}).sort((a,b)=>(p.customFoods[a].name||'').localeCompare(p.customFoods[b].name||'')); }
function foodOptionHtml(p,ids){
  const builtIn=ids.map(id=>`<option value="${id}">${esc(FOOD[id].name)}</option>`).join('');
  const custom=customFoodIds(p).map(id=>`<option value="${id}">★ ${esc(p.customFoods[id].name)}</option>`).join('');
  return `<optgroup label="Plan foods">${builtIn}</optgroup>${custom?`<optgroup label="Your saved foods">${custom}</optgroup>`:''}`;
}
function quantityOptions(p,foodId){ const f=getFood(p,foodId);if(!f)return '';return f.factors.map(x=>`<option value="${x}">${esc(foodQuantityLabel(f,x))}</option>`).join(''); }
function renderCustomFoodCreator(p){
  const custom=customFoodIds(p);
  return `<details class="custom-food-panel"><summary><span>＋ Add / manage custom foods</span><b>${custom.length} saved</b></summary>
    <div class="custom-food-grid">
      <div class="field wide-field"><label>Food name *</label><input class="glass-input" id="customFoodName" placeholder="e.g. Homemade chicken sandwich"></div>
      <div class="field wide-field"><label>Serving *</label><input class="glass-input" id="customFoodServing" placeholder="e.g. 1 sandwich / 1 bowl (~200 g)"></div>
      <div class="field"><label>Calories *</label><input class="glass-input" id="customFoodKcal" type="number" inputmode="numeric" min="1" placeholder="350"></div>
      <div class="field"><label>Protein g</label><input class="glass-input" id="customFoodProtein" type="number" inputmode="decimal" min="0" step="0.1" placeholder="25"></div>
      <div class="field"><label>Carbs g</label><input class="glass-input" id="customFoodCarbs" type="number" inputmode="decimal" min="0" step="0.1" placeholder="40"></div>
      <div class="field"><label>Fat g</label><input class="glass-input" id="customFoodFat" type="number" inputmode="decimal" min="0" step="0.1" placeholder="10"></div>
      <button class="glass-button primary custom-save" id="saveCustomFoodBtn">Save food to 90-day library</button>
    </div>
    <p class="section-note">Only name, serving and calories are required. Add protein when you know it so the protein target stays accurate. Saved foods appear in every meal dropdown for all 90 days.</p>
    <div class="custom-food-library">${custom.length?custom.map(id=>{const f=p.customFoods[id];return `<div class="custom-food-item"><div><strong>${esc(f.name)}</strong><span>${esc(f.serving)} · ${Math.round(f.kcal)} kcal${f.p?` · ${round1(f.p)}g P`:''}</span></div><button class="remove-x" data-delete-custom-food="${id}" aria-label="Delete saved food">×</button></div>`;}).join(''):'<span class="empty-line">No custom foods yet.</span>'}</div>
  </details>`;
}

function cheatConflict(p,dayNum){
  let conflict=null;
  Object.entries(p.days).forEach(([n,d])=>{ const other=+n;if(other!==dayNum && d.cheatMeal && Math.abs(other-dayNum)<7){ if(!conflict || Math.abs(other-dayNum)<Math.abs(conflict-dayNum)) conflict=other; } });
  return conflict;
}
function cheatStatus(p,dayNum){
  const d=getDay(p,dayNum);if(d.cheatMeal) return {allowed:false,usedToday:true,text:'Cheat meal used today. Another is locked for the next 6 program days.'};
  const c=cheatConflict(p,dayNum);if(c){ const diff=dayNum-c;return {allowed:false,usedToday:false,text:diff>0?`Locked — last cheat meal was Day ${c}. Next available: Day ${c+7}.`:`Locked — another cheat meal is already logged on Day ${c}.`}; }
  return {allowed:true,usedToday:false,text:'Available now. Once used, another one is disabled for 7 program days.'};
}

function toast(msg){ const el=document.createElement('div');el.className='toast glass-control';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2200); }
function formatDate(d){ return new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(d); }

function renderLogin(){
  const today=toISODateLocal(new Date());
  app().innerHTML=`<div class="liquid-bg"><i></i><i></i><i></i></div><div class="login-page"><div class="content-card login-card">
    <div class="brand-orb">90</div><div class="kicker">90-day system</div><h1>Cut Tracker</h1><p>Daily nutrition, training and progress—built for your Android phone.</p>
    <div class="field"><label>Profile name</label><input class="glass-input" id="loginName" autocomplete="username" placeholder="e.g. Abdul"></div>
    <div class="field"><label>4–8 digit PIN</label><input class="glass-input" id="loginPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••"></div>
    <div class="field"><label>Program start date</label><input class="glass-input" id="startDate" type="date" value="${today}"></div>
    <button class="glass-button primary wide" id="loginBtn">Open / create profile</button><div id="loginError" class="error"></div>
    <p class="privacy-note">Saved locally on this phone. Use Backup in Settings periodically.</p>
  </div></div>`;
  $('#loginBtn').addEventListener('click',handleLogin);$('#loginPin').addEventListener('keydown',e=>{if(e.key==='Enter')handleLogin();});
}
async function handleLogin(){
  const name=$('#loginName').value.trim(),pin=$('#loginPin').value.trim(),startDate=$('#startDate').value,err=$('#loginError');err.textContent='';
  if(name.length<2)return err.textContent='Enter a profile name.';if(!/^\d{4,8}$/.test(pin))return err.textContent='Use a 4–8 digit PIN.';if(!startDate)return err.textContent='Choose a start date.';
  const idx=userIndex(),key=name.toLowerCase(),pinHash=await hash(`${key}:${pin}`);
  if(idx[key]){if(idx[key].pinHash!==pinHash)return err.textContent='That PIN does not match this profile.';}else{idx[key]={name,pinHash};saveUserIndex(idx);saveProfile(defaultProfile(name,startDate));}
  localStorage.setItem(sessionKey(),key);state.user=loadProfile(name);state.selectedDay=currentDayNumber(state.user);saveProfile(state.user);scheduleWaterReminders();renderApp();
}

function renderApp(){
  const p=state.user;if(!p)return renderLogin();const current=currentDayNumber(p),n=state.selectedDay||current,d=getDay(p,n),phase=phaseFor(n),t=mealTotals(d),progress=Math.round(closedDays(p)/TOTAL_DAYS*100),rw=rolling7(p,current),loss=totalLoss(p);
  saveProfile(p);
  app().innerHTML=`<div class="liquid-bg"><i></i><i></i><i></i></div><div class="app-shell">
    <header class="glass-nav top-nav"><div class="brand"><div class="brand-orb small">90</div><div><h1>Cut Tracker</h1><p>${esc(p.username)} · ${phase.weeks}</p></div></div><div class="nav-actions"><button class="glass-icon" id="exportBtn" aria-label="Backup">⇩</button><button class="glass-icon" id="logoutBtn" aria-label="Logout">↪</button></div></header>
    <section class="hero content-card"><div><span class="phase-pill">Phase ${phase.n} · ${phase.name}</span><h2>Day ${n}<span>/90</span></h2><p>${formatDate(dayDate(p,n))} · ${trainingMode(n)} phase</p></div><div class="hero-progress"><strong>${progress}%</strong><span>${closedDays(p)} closed</span></div></section>
    <section class="quote-card content-card"><span>DAY ${n} MINDSET</span><p>“${esc(DAILY_QUOTES[n-1])}”</p></section>
    <section class="quick-metrics">
      <div><span>7-day avg</span><strong>${rw?rw.toFixed(1)+' kg':'—'}</strong></div><div><span>Calories</span><strong>${Math.round(t.kcal)} / ${p.settings.calorieTarget}</strong></div><div><span>Protein</span><strong>${Math.round(t.p)} g</strong></div><div><span>Scale change</span><strong>${loss===null?'—':(loss>=0?'−':' +')+Math.abs(loss).toFixed(1)+' kg'}</strong></div>
    </section>
    <main id="tabContent">${renderTabContent(p,n)}</main>
    <nav class="glass-nav bottom-tabs">
      ${tabButton('today','⌂','Today')}${tabButton('calendar','▦','90 Days')}${tabButton('progress','⌁','Progress')}${tabButton('plan','◎','Plan')}${tabButton('settings','⚙','Settings')}
    </nav>
  </div>`;
  bindAppEvents();
}
function tabButton(id,icon,label){return `<button class="tab ${state.activeTab===id?'active':''}" data-tab="${id}"><b>${icon}</b><span>${label}</span></button>`;}
function renderTabContent(p,n){ if(state.activeTab==='calendar')return renderCalendar(p);if(state.activeTab==='progress')return renderProgress(p);if(state.activeTab==='plan')return renderPlan(p,n);if(state.activeTab==='settings')return renderSettings(p);return renderToday(p,n); }

function renderToday(p,n){
  const d=getDay(p,n),t=mealTotals(d),eff=effortFor(n),check=checklistState(p,d),cheat=cheatStatus(p,n),current=currentDayNumber(p);
  return `<div class="stack">
    <section class="content-card section-card">
      <div class="section-head"><div><span class="eyebrow">Daily log</span><h3>Body & activity</h3></div><span class="save-dot">Autosaved</span></div>
      <div class="compact-fields">
        ${inputField('weight','Weight kg',d.weight,'0.1')}${inputField('waist','Waist',d.waist,'0.1')}${inputField('water','Water L',d.water,'0.1')}${inputField('steps','Steps',d.steps,'1')}
      </div>
      <div class="quick-water"><span>Quick water</span><button class="glass-button small" data-water-add="0.25">+250 ml</button><button class="glass-button small" data-water-add="0.5">+500 ml</button></div>
    </section>

    <section class="content-card section-card">
      <div class="section-head"><div><span class="eyebrow">Nutrition</span><h3>Log what you eat</h3></div><div class="macro-total"><strong>${Math.round(t.kcal)}</strong><span>kcal</span></div></div>
      <div class="macro-bar"><span><b>${Math.round(t.p)}g</b> protein</span><span><b>${Math.round(t.c)}g</b> carbs</span><span><b>${Math.round(t.f)}g</b> fat</span></div>
      ${renderCustomFoodCreator(p)}
      ${MEAL_SLOTS.map(slot=>renderMealSlot(p,d,slot)).join('')}
      ${renderCheatMeal(p,n,cheat)}
    </section>

    <section class="content-card section-card">
      <div class="section-head"><div><span class="eyebrow">Training · ${trainingMode(n)}</span><h3>Build today's workout</h3></div><span class="phase-pill">${eff.rir}</span></div>
      <p class="section-note">Suggested today: <strong>${esc(defaultSessionForDay(p,n))}</strong>. You can load any template or build your own from the exercise library. ${eff.note}</p>
      <div class="workout-controls"><select class="glass-input" id="templateSelect">${Object.keys(templatesForDay(n)).map(x=>`<option value="${esc(x)}" ${x===d.session?'selected':''}>${esc(x)}</option>`).join('')}</select><button class="glass-button" id="loadTemplateBtn">Load template</button></div>
      ${renderExerciseList(d,eff)}
      <div class="workout-controls"><select class="glass-input" id="exerciseSelect">${exerciseLibrary(n).map(x=>`<option value="${esc(x.name)}">${esc(x.name)} · ${esc(x.reps)}</option>`).join('')}</select><button class="glass-button" id="addExerciseBtn">+ Add exercise</button></div>
    </section>

    <section class="content-card section-card compact-check-card">
      <div class="section-head"><div><span class="eyebrow">Close the loop</span><h3>Daily checklist</h3></div><strong class="score">${adherencePct(p,d)}%</strong></div>
      <div class="mini-checks">${check.map(([key,label,done])=>{
        const manual=key==='window'||key==='sleep';return `<label class="mini-check ${done?'done':''}"><input type="checkbox" ${done?'checked':''} ${manual?`data-check="${key}"`:'disabled'}><span>${done?'✓':'○'} ${label}</span></label>`;
      }).join('')}</div>
      <div class="field note-field"><label>Notes</label><textarea class="glass-input" data-dayfield="notes" placeholder="Hunger, strength, cravings, soreness...">${esc(d.notes||'')}</textarea></div>
      <div class="day-actions"><button class="glass-button" id="prevDayBtn" ${n<=1?'disabled':''}>← Day ${Math.max(1,n-1)}</button><button class="glass-button ${d.closed?'secondary':'primary'}" id="closeDayBtn">${d.closed?'Reopen day':'Close Day ✓'}</button><button class="glass-button" id="nextDayBtn" ${n>=TOTAL_DAYS?'disabled':''}>Day ${Math.min(TOTAL_DAYS,n+1)} →</button></div>
      ${n!==current?`<p class="section-note centered">You are viewing Day ${n}; your current program day is Day ${current}.</p>`:''}
    </section>
  </div>`;
}

function inputField(key,label,value,step){ return `<div class="field"><label>${label}</label><input class="glass-input" data-dayfield="${key}" type="number" step="${step}" value="${esc(value)}"></div>`; }
function renderMealSlot(p,d,slot){
  const items=d.meals.filter(x=>x.slot===slot.id);
  const first=slot.foods[0];
  return `<div class="meal-block"><div class="meal-title"><strong>${slot.label}</strong><span>${Math.round(items.reduce((a,x)=>a+(+x.kcal||0),0))} kcal</span></div>
    <div class="meal-picker"><select class="glass-input food-select" data-slot="${slot.id}">${foodOptionHtml(p,slot.foods)}</select><select class="glass-input qty-select" data-slot="${slot.id}">${quantityOptions(p,first)}</select><button class="glass-button add-food" data-slot="${slot.id}">Add</button></div>
    <div class="food-list">${items.length?items.map(x=>`<div class="food-row"><div><strong>${esc(x.name)}</strong><span>${esc(x.qtyLabel)}</span></div><div class="food-macros"><b>${Math.round(x.kcal)} kcal</b><span>${Math.round(x.p)}g P</span><button class="remove-x" data-remove-food="${x.id}" aria-label="Remove">×</button></div></div>`).join(''):'<p class="empty-line">Nothing logged yet.</p>'}</div>
  </div>`;
}
function renderCheatMeal(p,n,status){
  const disabled=!status.allowed,d=getDay(p,n),logged=d.meals.find(x=>x.cheat);
  return `<div class="cheat-card ${disabled?'locked':''}"><div><span class="eyebrow">Restaurant / cheat meal</span><strong>${status.allowed?'1 available':status.usedToday?'Used today':'Locked'}</strong><p>${esc(status.text)}</p></div>
    ${logged?`<div class="food-row cheat-logged"><div><strong>${esc(logged.name)}</strong><span>Counts in today's calorie total</span></div><div class="food-macros"><b>${Math.round(logged.kcal)} kcal</b><button class="remove-x" data-remove-food="${logged.id}" aria-label="Remove">×</button></div></div>`:''}
    ${status.allowed?`<div class="cheat-controls"><select class="glass-input" id="cheatPreset">${Object.entries(CHEAT_PRESETS).map(([k,v])=>`<option value="${k}">${esc(v.name)} · ~${v.kcal} kcal</option>`).join('')}<option value="custom">Custom calorie estimate</option></select><input class="glass-input hidden" id="customCheatCalories" type="number" inputmode="numeric" placeholder="Calories"><button class="glass-button secondary" id="logCheatBtn">Use cheat meal</button></div>`:''}
  </div>`;
}

function exerciseLibrary(n){
  const seen=new Set(),out=[];Object.values(templatesForDay(n)).flat().forEach(x=>{if(!seen.has(x[0])){seen.add(x[0]);out.push({name:x[0],reps:x[1],rest:x[2]||'60–90 sec'});}});return out;
}
function renderExerciseList(d,eff){
  if(!d.exercises.length)return '<div class="empty-workout">No exercises loaded yet. Pick any template above or add exercises individually.</div>';
  return `<div class="exercise-list">${d.exercises.map(x=>`<div class="exercise-row ${d.exerciseDone[x.id]?'done':''}"><label><input type="checkbox" data-exercise-done="${x.id}" ${d.exerciseDone[x.id]?'checked':''}><span><strong>${esc(x.name)}</strong><small>${x.sets||eff.sets} sets · ${esc(x.reps)} · rest ${esc(x.rest)}</small></span></label><button class="remove-x" data-remove-exercise="${x.id}">×</button></div>`).join('')}</div>`;
}

function renderCalendar(p){
  const current=currentDayNumber(p);return `<section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Overview</span><h3>90 days</h3></div><span class="save-dot">Tap any day</span></div><div class="day-grid">${Array.from({length:90},(_,i)=>{const n=i+1,d=p.days[n],cls=d?.closed?'closed':d&&(d.weight||d.meals?.length||Object.keys(d.checks||{}).length)?'partial':n>current?'future':'';return `<button class="day-cell ${cls} ${n===current?'current':''}" data-open-day="${n}">${n}</button>`;}).join('')}</div></section>`;
}
function renderProgress(p){
  const current=currentDayNumber(p);return `<div class="stack"><section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Trend</span><h3>Weight progress</h3></div><span class="phase-pill">7-day average</span></div><div class="chart-wrap"><canvas id="weightChart"></canvas></div></section>
    <section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">13 weeks</span><h3>Weekly averages</h3></div></div><div class="week-table"><div class="week-row head"><span>Week</span><span>Avg</span><span>Change</span><span>Waist</span></div>${Array.from({length:13},(_,i)=>{const w=i+1,a=weekAverage(p,w),prev=w>1?weekAverage(p,w-1):null;let waist='—';for(let n=(w-1)*7+1;n<=Math.min(90,w*7);n++){if(p.days[n]?.waist)waist=p.days[n].waist+' cm';}return `<div class="week-row"><b>${w}</b><span>${a?a.toFixed(1)+' kg':'—'}</span><span>${a&&prev?(a-prev).toFixed(1)+' kg':'—'}</span><span>${waist}</span></div>`;}).join('')}</div></section>
    <section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Every 14 days</span><h3>Adjustment rule</h3></div></div><p class="section-note large">If average loss is about <strong>0.5–1.0%/week</strong>, change nothing. If it is below 0.5% for two weeks with genuinely high adherence, reduce ~100–150 kcal or add a little cardio. If it stays above ~1.25%/week after the initial water-loss period, add ~100–150 kcal. Never react to only a 5–7 day stall.</p></section>
  </div>`;
}
function renderPlan(p,n){
  return `<div class="stack"><section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Nutrition</span><h3>Your targets</h3></div></div><div class="plan-grid"><div><span>Calories</span><strong>${p.settings.calorieTarget}</strong></div><div><span>Protein</span><strong>${p.settings.proteinTarget} g</strong></div><div><span>Minimum protein</span><strong>${p.settings.proteinMin} g</strong></div><div><span>Water</span><strong>${p.settings.waterTarget} L+</strong></div><div><span>Steps</span><strong>${p.settings.stepFloor}+</strong></div><div><span>Eating</span><strong>12–6</strong></div></div></section>
    <section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">90-day structure</span><h3>Program phases</h3></div></div><div class="phase-list"><p><b>Weeks 1–2:</b> beginner adaptation, 2 working sets, RIR 3, short low-impact cardio.</p><p><b>Weeks 3–4:</b> 3 principal sets around RIR 2, ~20 min low-impact cardio.</p><p><b>Weeks 5–8:</b> main gym phase, RIR 1–2, progressive overload and 20–30 min cardio.</p><p><b>Weeks 9–13:</b> home dumbbell/band training with muscular effort preserved.</p></div><p class="section-note large"><strong>91 kg is the stretch goal, not a forced deadline.</strong> A very successful 90-day result remains around ${PLAN.realisticEnd} with a smaller waist and good strength retention.</p></section></div>`;
}
function renderSettings(p){
  const installed=isStandaloneMode(),notif=('Notification' in window)?Notification.permission:'unsupported';
  const sw=('serviceWorker' in navigator)?(navigator.serviceWorker.controller?'Active':'Starting / not controlling this page'):'Unsupported';
  const last=p.settings.lastWaterReminderAt?new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}).format(new Date(p.settings.lastWaterReminderAt)):'None yet';
  return `<div class="stack"><section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Android</span><h3>App & reminders</h3></div><span class="phase-pill">${installed?'Installed':'PWA ready'}</span></div><p class="section-note large">${esc(pwaInstallStatusText())}</p><button class="glass-button primary" id="installAppBtn" ${installed?'disabled':''}>${installed?'Installed ✓':'Install on this phone'}</button>
    <div class="setting-row"><div><strong>Water reminders</strong><span>11 AM to 11 PM, every ${p.settings.waterReminderEvery||2} hours</span></div><label class="switch"><input id="waterReminderToggle" type="checkbox" ${p.settings.waterReminders?'checked':''}><span></span></label></div>
    <div class="notification-diagnostics"><div><span>Permission</span><b>${esc(notif)}</b></div><div><span>Service worker</span><b>${esc(sw)}</b></div><div><span>Last sent</span><b>${esc(last)}</b></div><div><span>Next check</span><b>${esc(nextReminderLabel(p))}</b></div></div>
    <div class="reminder-actions"><button class="glass-button" id="testNotificationBtn">Send test notification</button><button class="glass-button" id="checkReminderBtn">Check reminder now</button></div>
    <p class="section-note">The previous version only checked during the first 2 minutes of each reminder hour. This version catches the latest due reminder whenever the PWA wakes or regains focus. For Android, persistent notifications are sent through the service worker. Exact alarms while Android has fully stopped the PWA still need a native app or a push backend. If the test does not appear even with permission shown as <b>granted</b>, long-press the Cut Tracker icon → App info → Notifications and make sure notifications are allowed.</p></section>
    <section class="content-card section-card"><div class="section-head"><div><span class="eyebrow">Targets</span><h3>Settings & backup</h3></div></div><div class="compact-fields">${settingField('settingStart','Program start date',p.startDate,'date')}${settingField('settingCalories','Calories',p.settings.calorieTarget,'number')}${settingField('settingProtein','Protein target',p.settings.proteinTarget,'number')}${settingField('settingSteps','Step floor',p.settings.stepFloor,'number')}</div><div class="day-actions settings-actions"><button class="glass-button primary" id="saveSettingsBtn">Save</button><button class="glass-button" id="importBtn">Import backup</button><button class="glass-button danger" id="resetBtn">Reset data</button><input type="file" id="importFile" accept="application/json" class="hidden"></div></section></div>`;
}
function settingField(id,label,value,type){ return `<div class="field"><label>${label}</label><input class="glass-input" id="${id}" type="${type}" value="${esc(value)}"></div>`; }

function bindAppEvents(){
  document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',()=>{state.activeTab=el.dataset.tab;renderApp();}));
  $('#logoutBtn')?.addEventListener('click',()=>{localStorage.removeItem(sessionKey());state.user=null;clearInterval(waterReminderTimer);renderLogin();});
  $('#exportBtn')?.addEventListener('click',exportBackup);
  document.querySelectorAll('[data-dayfield]').forEach(el=>el.addEventListener('change',saveDayField));
  document.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',saveCheck));
  document.querySelectorAll('[data-water-add]').forEach(el=>el.addEventListener('click',()=>addWater(+el.dataset.waterAdd)));
  document.querySelectorAll('.food-select').forEach(el=>el.addEventListener('change',updateQtySelect));
  document.querySelectorAll('.add-food').forEach(el=>el.addEventListener('click',addFood));
  document.querySelectorAll('[data-remove-food]').forEach(el=>el.addEventListener('click',removeFood));
  $('#saveCustomFoodBtn')?.addEventListener('click',saveCustomFood);
  document.querySelectorAll('[data-delete-custom-food]').forEach(el=>el.addEventListener('click',deleteCustomFood));
  $('#cheatPreset')?.addEventListener('change',e=>$('#customCheatCalories')?.classList.toggle('hidden',e.target.value!=='custom'));
  $('#logCheatBtn')?.addEventListener('click',logCheatMeal);
  $('#loadTemplateBtn')?.addEventListener('click',loadTemplate);
  $('#addExerciseBtn')?.addEventListener('click',addExercise);
  document.querySelectorAll('[data-exercise-done]').forEach(el=>el.addEventListener('change',toggleExerciseDone));
  document.querySelectorAll('[data-remove-exercise]').forEach(el=>el.addEventListener('click',removeExercise));
  $('#closeDayBtn')?.addEventListener('click',toggleCloseDay);
  $('#prevDayBtn')?.addEventListener('click',()=>{if(state.selectedDay>1){state.selectedDay--;renderApp();}});
  $('#nextDayBtn')?.addEventListener('click',()=>{if(state.selectedDay<TOTAL_DAYS){state.selectedDay++;renderApp();}});
  document.querySelectorAll('[data-open-day]').forEach(el=>el.addEventListener('click',()=>{state.selectedDay=+el.dataset.openDay;state.activeTab='today';renderApp();}));
  $('#installAppBtn')?.addEventListener('click',installPwa);
  $('#waterReminderToggle')?.addEventListener('change',toggleWaterReminders);
  $('#testNotificationBtn')?.addEventListener('click',sendTestNotification);
  $('#checkReminderBtn')?.addEventListener('click',async()=>{const sent=await checkWaterReminder(true);toast(sent?'Reminder sent':'No reminder was due; use Test notification to verify Android delivery.');});
  $('#saveSettingsBtn')?.addEventListener('click',saveSettings);
  $('#importBtn')?.addEventListener('click',()=>$('#importFile').click());$('#importFile')?.addEventListener('change',importBackup);$('#resetBtn')?.addEventListener('click',resetProfile);
  if(state.activeTab==='progress')requestAnimationFrame(()=>drawWeightChart(state.user));
}

function saveDayField(e){ const d=getDay(state.user,state.selectedDay);d[e.target.dataset.dayfield]=e.target.value;saveProfile(state.user);renderApp(); }
function saveCheck(e){ const d=getDay(state.user,state.selectedDay);d.checks[e.target.dataset.check]=e.target.checked;saveProfile(state.user);renderApp(); }
function addWater(v){ const d=getDay(state.user,state.selectedDay);d.water=round1((+d.water||0)+v);saveProfile(state.user);renderApp(); }
function updateQtySelect(e){ const slot=e.target.dataset.slot,qty=document.querySelector(`.qty-select[data-slot="${slot}"]`);if(qty)qty.innerHTML=quantityOptions(state.user,e.target.value); }
function addFood(e){
  const slot=e.currentTarget.dataset.slot,foodSel=document.querySelector(`.food-select[data-slot="${slot}"]`),qtySel=document.querySelector(`.qty-select[data-slot="${slot}"]`),food=getFood(state.user,foodSel.value),factor=+qtySel.value,d=getDay(state.user,state.selectedDay);
  if(!food)return toast('That food is no longer available.');
  if(foodSel.value==='tea' && d.meals.some(x=>x.foodId==='tea')) return toast('Your one daily milk tea is already logged.');
  d.meals.push({id:uid(),slot,foodId:foodSel.value,name:food.name,qtyLabel:foodQuantityLabel(food,factor),factor,kcal:round1(food.kcal*factor),p:round1(food.p*factor),c:round1(food.c*factor),f:round1(food.f*factor)});saveProfile(state.user);renderApp();
}
function saveCustomFood(){
  const p=state.user,name=$('#customFoodName')?.value.trim(),serving=$('#customFoodServing')?.value.trim()||'1 serving',kcal=parseFloat($('#customFoodKcal')?.value),protein=parseFloat($('#customFoodProtein')?.value)||0,carbs=parseFloat($('#customFoodCarbs')?.value)||0,fat=parseFloat($('#customFoodFat')?.value)||0;
  if(!name)return alert('Enter a food name.');
  if(!Number.isFinite(kcal)||kcal<=0)return alert('Enter calories for one serving.');
  const id=`custom-${uid()}`;
  p.customFoods[id]={name,serving,kcal:round1(kcal),p:round1(protein),c:round1(carbs),f:round1(fat),factors:[0.5,1,1.5,2],custom:true,createdAt:new Date().toISOString()};
  saveProfile(p);toast(`${name} saved to your food library`);renderApp();
}
function deleteCustomFood(e){
  const id=e.currentTarget.dataset.deleteCustomFood,f=state.user.customFoods?.[id];if(!f)return;
  if(!confirm(`Remove ${f.name} from your saved food library? Meals already logged with it will stay unchanged.`))return;
  delete state.user.customFoods[id];saveProfile(state.user);toast('Custom food removed');renderApp();
}
function removeFood(e){
  const d=getDay(state.user,state.selectedDay),id=e.currentTarget.dataset.removeFood,item=d.meals.find(x=>x.id===id);if(item?.cheat && d.closed)return toast('Reopen the day before changing the cheat meal.');
  d.meals=d.meals.filter(x=>x.id!==id);if(item?.cheat)d.cheatMeal=false;saveProfile(state.user);renderApp();
}
function logCheatMeal(){
  const p=state.user,n=state.selectedDay,d=getDay(p,n),status=cheatStatus(p,n);if(!status.allowed)return toast(status.text);const key=$('#cheatPreset').value;let item;
  if(key==='custom'){const kcal=parseInt($('#customCheatCalories').value);if(!kcal||kcal<200)return alert('Enter a reasonable calorie estimate for the restaurant meal.');item={name:'Custom restaurant / cheat meal',kcal,p:0,c:0,f:0};}else item=CHEAT_PRESETS[key];
  d.meals.push({id:uid(),slot:'cheat',cheat:true,name:item.name,qtyLabel:'1 restaurant meal',kcal:item.kcal,p:item.p,c:item.c,f:item.f});d.cheatMeal=true;saveProfile(p);toast('Cheat meal logged — 7-day lock active');renderApp();
}
function loadTemplate(){
  const d=getDay(state.user,state.selectedDay),name=$('#templateSelect').value,tpl=templatesForDay(state.selectedDay)[name],eff=effortFor(state.selectedDay);d.session=name;d.exercises=tpl.map(x=>({id:uid(),name:x[0],reps:x[1],rest:x[2]||'60–90 sec',sets:name==='Conditioning'||name==='Rest'?1:eff.sets}));d.exerciseDone={};saveProfile(state.user);renderApp();
}
function addExercise(){
  const d=getDay(state.user,state.selectedDay),name=$('#exerciseSelect').value,lib=exerciseLibrary(state.selectedDay).find(x=>x.name===name),eff=effortFor(state.selectedDay);if(!lib)return;d.session=d.session==='Rest'?'Custom':d.session;d.exercises.push({id:uid(),name:lib.name,reps:lib.reps,rest:lib.rest,sets:eff.sets});saveProfile(state.user);renderApp();
}
function toggleExerciseDone(e){ const d=getDay(state.user,state.selectedDay);d.exerciseDone[e.target.dataset.exerciseDone]=e.target.checked;saveProfile(state.user);renderApp(); }
function removeExercise(e){ const d=getDay(state.user,state.selectedDay),id=e.currentTarget.dataset.removeExercise;d.exercises=d.exercises.filter(x=>x.id!==id);delete d.exerciseDone[id];saveProfile(state.user);renderApp(); }
function toggleCloseDay(){
  const d=getDay(state.user,state.selectedDay);if(!d.closed && adherencePct(state.user,d)<60 && !confirm(`Only ${adherencePct(state.user,d)}% of your compact checklist is complete. Close this day anyway?`))return;d.closed=!d.closed;d.closedAt=d.closed?new Date().toISOString():null;saveProfile(state.user);toast(d.closed?'Day closed ✓':'Day reopened');renderApp();
}

async function toggleWaterReminders(e){
  const p=state.user;if(e.target.checked){
    if(!('Notification' in window)){e.target.checked=false;return alert('Notifications are not supported in this browser.');}
    const permission=await Notification.requestPermission();
    if(permission!=='granted'){e.target.checked=false;return alert('Notification permission was not granted. If you previously blocked it, open Android app/site notification settings and allow Cut Tracker.');}
    p.settings.waterReminders=true;saveProfile(p);scheduleWaterReminders(false);await showTrackerNotification('Water reminders are on 💧',`You should receive checks from 11 AM to 11 PM. Next: ${nextReminderLabel(p)}.`,`cut-water-enabled-${Date.now()}`);toast('Water reminders enabled — test notification sent');
  }else{p.settings.waterReminders=false;saveProfile(p);scheduleWaterReminders(false);toast('Water reminders off');}
  renderApp();
}
function reminderHours(p){ const step=Math.max(1,+p.settings.waterReminderEvery||2),out=[];for(let h=11;h<=23;h+=step)out.push(h);if(out[out.length-1]!==23)out.push(23);return out; }
function latestDueReminderHour(p,now=new Date()){ if(now.getHours()<11)return null;const due=reminderHours(p).filter(h=>h<=now.getHours());return due.length?due[due.length-1]:null; }
function nextReminderDate(p,now=new Date()){
  const hours=reminderHours(p);for(const h of hours){const d=new Date(now);d.setHours(h,0,0,0);if(d>now)return d;}const tomorrow=new Date(now);tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(hours[0],0,0,0);return tomorrow;
}
function nextReminderLabel(p){ if(!p.settings.waterReminders)return 'Reminders off';const d=nextReminderDate(p);return new Intl.DateTimeFormat('en-IN',{weekday:'short',hour:'numeric',minute:'2-digit'}).format(d); }
async function showTrackerNotification(title,body,tag){
  if(!('Notification' in window)||Notification.permission!=='granted')return false;
  try{
    const reg=await navigator.serviceWorker.ready;
    await reg.showNotification(title,{body,icon:'./icon-192.png',badge:'./notification-badge-96.png',tag,renotify:false,vibrate:[180,90,180],data:{url:'./'}});
    return true;
  }catch(err){console.warn('Notification failed',err);return false;}
}
async function sendTestNotification(){
  if(!('Notification' in window))return alert('Notifications are not supported in this browser.');
  let permission=Notification.permission;if(permission!=='granted')permission=await Notification.requestPermission();
  if(permission!=='granted')return alert('Notification permission is not granted. Open Android notification settings for Cut Tracker/Chrome and allow notifications, then try again.');
  const ok=await showTrackerNotification('Cut Tracker test 🔴','If you can see this, the app can deliver Android notifications.',`cut-test-${Date.now()}`);
  toast(ok?'Test notification sent':'The browser could not display the notification. Check Android notification settings.');
}
function scheduleWaterReminders(initialCheck=true){ clearInterval(waterReminderTimer);if(!state.user?.settings?.waterReminders)return;if(initialCheck)checkWaterReminder();waterReminderTimer=setInterval(()=>checkWaterReminder(),60000); }
async function checkWaterReminder(force=false){
  const p=state.user;if(!p?.settings?.waterReminders||!('Notification' in window)||Notification.permission!=='granted')return false;
  const now=new Date(),dueHour=latestDueReminderHour(p,now);if(dueHour===null)return false;
  const key=`cutWaterNotice:${toISODateLocal(now)}:${dueHour}`;if(localStorage.getItem(key)&&!force)return false;
  const d=getDay(p,currentDayNumber(p)),water=+d.water||0,body=`${water.toFixed(1)} L logged today. Have some water now if you are behind your ${p.settings.waterTarget} L target.`;
  const tag=force?`cut-water-force-${Date.now()}`:key;const ok=await showTrackerNotification('Water check 💧',body,tag);
  if(ok){if(!force)localStorage.setItem(key,'1');p.settings.lastWaterReminderAt=now.toISOString();saveProfile(p);}
  return ok;
}

function saveSettings(){ const p=state.user,date=$('#settingStart').value,cal=parseInt($('#settingCalories').value),pro=parseInt($('#settingProtein').value),st=parseInt($('#settingSteps').value);if(date)p.startDate=date;if(cal>1200)p.settings.calorieTarget=cal;if(pro>80)p.settings.proteinTarget=pro;if(st>=1000)p.settings.stepFloor=st;saveProfile(p);state.selectedDay=currentDayNumber(p);toast('Settings saved');renderApp(); }
function exportBackup(){ const p=state.user,blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`cut-tracker-${p.username}-${toISODateLocal(new Date())}.json`;a.click();URL.revokeObjectURL(url);toast('Backup downloaded'); }
function importBackup(e){ const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=migrateProfile(JSON.parse(r.result));if(!data.days)throw new Error();data.username=state.user.username;state.user=data;saveProfile(data);scheduleWaterReminders();toast('Backup imported');renderApp();}catch{alert('This file does not look like a valid Cut Tracker backup.');}};r.readAsText(f); }
function resetProfile(){ if(!confirm('Reset all day logs for this profile? Export a backup first if you may need the data.'))return;const fresh=defaultProfile(state.user.username,state.user.startDate);fresh.settings={...state.user.settings};fresh.customFoods={...(state.user.customFoods||{})};state.user=fresh;saveProfile(fresh);state.selectedDay=1;scheduleWaterReminders();toast('Profile reset');renderApp(); }

function drawWeightChart(p){
  const c=$('#weightChart');if(!c)return;const ctx=c.getContext('2d'),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.scale(dpr,dpr);const W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);const weights=getWeights(p);ctx.font='12px system-ui';ctx.fillStyle='#a8a8ad';if(weights.length<2){ctx.fillText('Add at least two morning weights to see your trend.',16,30);return;}const vals=weights.map(x=>x.weight),min=Math.floor(Math.min(...vals)-1),max=Math.ceil(Math.max(...vals)+1),pad={l:38,r:12,t:18,b:28};const x=d=>pad.l+((d-1)/(TOTAL_DAYS-1))*(W-pad.l-pad.r),y=v=>pad.t+(max-v)/(max-min)*(H-pad.t-pad.b);ctx.strokeStyle='rgba(255,255,255,.10)';for(let i=0;i<5;i++){const yy=pad.t+i*(H-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(W-pad.r,yy);ctx.stroke();ctx.fillStyle='#a8a8ad';ctx.fillText((max-i*(max-min)/4).toFixed(1),2,yy+4);}ctx.strokeStyle='#ff2b2b';ctx.lineWidth=2;ctx.beginPath();weights.forEach((pt,i)=>i?ctx.lineTo(x(pt.day),y(pt.weight)):ctx.moveTo(x(pt.day),y(pt.weight)));ctx.stroke();const trend=[];for(let d=1;d<=90;d++){const a=rolling7(p,d);if(a&&Array.from({length:7},(_,i)=>p.days[d-i]?.weight).filter(Boolean).length>=3)trend.push({day:d,weight:a});}if(trend.length>1){ctx.strokeStyle='#ff6b6b';ctx.lineWidth=3;ctx.beginPath();trend.forEach((pt,i)=>i?ctx.lineTo(x(pt.day),y(pt.weight)):ctx.moveTo(x(pt.day),y(pt.weight)));ctx.stroke();}}

window.addEventListener('focus',()=>{if(state.user?.settings?.waterReminders)checkWaterReminder();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.user?.settings?.waterReminders)checkWaterReminder();});

(function init(){
  const session=localStorage.getItem(sessionKey()),idx=userIndex();if(session&&idx[session]){state.user=loadProfile(idx[session].name);if(state.user){state.selectedDay=currentDayNumber(state.user);saveProfile(state.user);scheduleWaterReminders();renderApp();return;}}renderLogin();
})();

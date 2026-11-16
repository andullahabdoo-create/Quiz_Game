const QUESTIONS = [
  { q: "ما هي عاصمة المملكة العربية السعودية؟", a: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة"], c: 0 },
  { q: "أي من هذه الكلمات تعني «الفرح»؟", a: ["الحزن", "السعادة", "الغضب", "الخوف"], c: 1 },
  { q: "من هو مؤلف كتاب « Kalila wa Dimna » المعروف بالعربية؟", a: ["ابن المقفع", "الجاحظ", "أبو العلاء المعري", "الطبري"], c: 0 },
  { q: "كم عدد حروف الهجاء العربية؟", a: ["٢٨", "٢٦", "٣٠", "٣٢"], c: 0 },
  { q: "ما هي أطول سورة في القرآن الكريم؟", a: ["البقرة", "آل عمران", "النساء", "المائدة"], c: 0 },
  { q: "أي دولة عربية تُعرف ببرج الساعة الشهير «بيت الساعة»؟", a: ["مصر", "تونس", "المغرب", "الأردن"], c: 1 },
  { q: "ما معنى كلمة «الكرم» في العربية؟", a: ["البخل", "السخاء والجود", "الغضب", "الخوف"], c: 1 },
  { q: "من شاع الجاهلية المعروف بقصيدة «لامية العرب»؟", a: ["امرؤ القيس", "شانفرا", "الشنفرى", "زهير بن أبي سلمى"], c: 1 },
  { q: "أي من هذه الدول ليست عضوًا في جامعة الدول العربية؟", a: ["مصر", "السودان", "إيران", "المغرب"], c: 2 },
  { q: "ما هي الجملة الصحيحة نحويًا؟", a: ["أنا أذهب إلى المدرسة", "أنا يذهب إلى المدرسة", "أنا نذهب إلى المدرسة", "أنا ذهب إلى المدرسة"], c: 0 },
];

const TOTAL = QUESTIONS.length;
const TIME_PER_Q = 15;

const screens = {
  home: document.getElementById('screen-home'),
  quiz: document.getElementById('screen-quiz'),
  result: document.getElementById('screen-result'),
};

const els = {
  score: document.getElementById('score'),
  btnStart: document.getElementById('btn-start'),
  btnNext: document.getElementById('btn-next'),
  btnReplay: document.getElementById('btn-replay'),
  btnHome: document.getElementById('btn-home'),
  qCounter: document.getElementById('q-counter'),
  timer: document.getElementById('timer'),
  progressBar: document.getElementById('progress-bar'),
  timerBar: document.getElementById('timer-bar'),
  qText: document.getElementById('q-text'),
  answers: document.getElementById('answers'),
  feedback: document.getElementById('feedback'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  resultMsg: document.getElementById('result-msg'),
  resultScore: document.getElementById('result-score'),
  resultTotal: document.getElementById('result-total'),
};

let current = 0;
let score = 0;
let timeLeft = TIME_PER_Q;
let timerId = null;
let locked = false;

function show(name) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

function startQuiz() {
  current = 0;
  score = 0;
  els.score.textContent = '0';
  show('quiz');
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const q = QUESTIONS[current];
  els.qCounter.textContent = `السؤال ${current + 1} من ${TOTAL}`;
  els.progressBar.style.width = `${((current) / TOTAL) * 100}%`;
  els.qText.textContent = q.q;
  els.feedback.textContent = '';
  els.feedback.className = 'feedback';
  els.btnNext.classList.add('hidden');
  els.answers.innerHTML = '';

  q.a.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}</span><span>${text}</span>`;
    btn.addEventListener('click', () => pick(i, btn));
    els.answers.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_Q;
  els.timer.textContent = timeLeft;
  els.timerBar.style.width = '100%';
  els.timerBar.classList.remove('low');

  timerId = setInterval(() => {
    timeLeft--;
    els.timer.textContent = timeLeft;
    els.timerBar.style.width = `${(timeLeft / TIME_PER_Q) * 100}%`;
    if (timeLeft <= 5) els.timerBar.classList.add('low');

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function pick(index, btn) {
  if (locked) return;
  locked = true;
  clearInterval(timerId);

  const q = QUESTIONS[current];
  const buttons = els.answers.querySelectorAll('.answer');
  buttons.forEach(b => b.disabled = true);

  if (index === q.c) {
    score++;
    els.score.textContent = score;
    btn.classList.add('correct');
    els.feedback.textContent = 'إجابة صحيحة! 🎉';
    els.feedback.className = 'feedback ok';
  } else {
    btn.classList.add('wrong');
    buttons[q.c].classList.add('correct');
    els.feedback.textContent = 'إجابة خاطئة 😢 الإجابة الصحيحة: ' + q.a[q.c];
    els.feedback.className = 'feedback no';
  }

  els.btnNext.textContent = current === TOTAL - 1 ? 'عرض النتيجة' : 'السؤال التالي';
  els.btnNext.classList.remove('hidden');
}

function handleTimeout() {
  if (locked) return;
  locked = true;
  const q = QUESTIONS[current];
  const buttons = els.answers.querySelectorAll('.answer');
  buttons.forEach(b => b.disabled = true);
  buttons[q.c].classList.add('correct');
  els.feedback.textContent = 'انتهى الوقت! الإجابة الصحيحة: ' + q.a[q.c];
  els.feedback.className = 'feedback no';
  els.btnNext.textContent = current === TOTAL - 1 ? 'عرض النتيجة' : 'السؤال التالي';
  els.btnNext.classList.remove('hidden');
}

function nextQuestion() {
  current++;
  if (current >= TOTAL) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  clearInterval(timerId);
  els.progressBar.style.width = '100%';
  els.resultScore.textContent = score;
  els.resultTotal.textContent = TOTAL;

  let emoji = '🏆', title = 'ممتاز!', msg = 'أداء رائع ومذهل، أنت خبير باللغة العربية!';
  if (score <= 4) {
    emoji = '💪'; title = 'لا تستسلم!'; msg = 'استمر في التدريب وستتحسن بالتأكيد.';
  } else if (score <= 7) {
    emoji = '👏'; title = 'جيد جدًا!'; msg = 'أداء جيد، يمكنك التحسن أكثر مع الممارسة.';
  } else if (score <= 9) {
    emoji = '🌟'; title = 'رائع!'; msg = 'مستوى ممتاز، أنت على الطريق الصحيح.';
  }

  els.resultEmoji.textContent = emoji;
  els.resultTitle.textContent = title;
  els.resultMsg.textContent = msg;
  show('result');
}

els.btnStart.addEventListener('click', startQuiz);
els.btnNext.addEventListener('click', nextQuestion);
els.btnReplay.addEventListener('click', startQuiz);
els.btnHome.addEventListener('click', () => show('home'));

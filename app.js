// ── RANGE BINDINGS ───────────────────────────────────────────
function bindRangeValue(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  if (!input || !output) return;
  const sync = () => { output.textContent = input.value; };
  input.addEventListener('input', sync);
  sync();
}

['stuck', 'importance'].forEach(id => bindRangeValue(id, `${id}Value`));


// ── ASSESSMENT — option button selection ──────────────────────
let assessmentAnswers = {};

function selectOption(el) {
  const group = el.closest('.option-group');
  if (!group) return;

  group.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  el.classList.add('selected');

  const field = group.dataset.field;
  const value = el.dataset.value;
  assessmentAnswers[field] = Number(value);

  const hiddenInput = document.getElementById(field);
  if (hiddenInput) hiddenInput.value = value;

  updateAssessmentProgress();
}

function updateAssessmentProgress() {
  const fields = ['alignment', 'career', 'schooling', 'support', 'identity', 'urgency'];
  const answered = fields.filter(f => assessmentAnswers[f] !== undefined).length;
  const total = fields.length;
  const pct = (answered / total) * 100;

  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const btn = document.getElementById('submitBtn');
  const note = document.getElementById('submitNote');

  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${answered} of ${total}`;

  if (answered === total) {
    if (btn) btn.disabled = false;
    if (note) note.textContent = 'All questions answered — ready to see your summary';
  } else {
    if (btn) btn.disabled = true;
    if (note) note.textContent = `${total - answered} question${total - answered !== 1 ? 's' : ''} remaining`;
  }
}


// ── ASSESSMENT RESULT ─────────────────────────────────────────
function renderAssessmentResult(data) {
  const fields = ['alignment', 'career', 'schooling', 'support', 'identity', 'urgency'];
  const score = fields.reduce((sum, f) => sum + (data[f] || 0), 0);

  const tensionLabels = {
    alignment:  'Partner alignment',
    career:     'Career trade-off',
    schooling:  'Children / schooling',
    support:    'Family proximity',
    identity:   'Identity / belonging',
    urgency:    'Timing pressure'
  };

  const highTensions = fields
    .filter(f => data[f] >= 4)
    .map(f => tensionLabels[f]);

  let band, bandClass, headline, summary, ctaHeadline, ctaCopy;

  if (score >= 22) {
    band = 'High tension';
    bandClass = 'score-high';
    headline = 'This is a linked family, career, and identity decision.';
    summary = `You scored ${score}/30. Multiple dimensions are interacting at once.`;
    ctaHeadline = 'A structured sprint could help.';
    ctaCopy = 'The pilot is designed for exactly this kind of decision.';
  } else if (score >= 14) {
    band = 'Meaningful tension';
    bandClass = 'score-mid';
    headline = 'There are real trade-offs here that need to be mapped.';
    summary = `You scored ${score}/30. The tensions are genuine.`;
    ctaHeadline = 'This is the kind of decision the sprint was built for.';
    ctaCopy = 'If you have a real decision in the next 12 months, applying makes sense.';
  } else {
    band = 'Early exploration';
    bandClass = 'score-low';
    headline = 'You are in early exploration territory.';
    summary = `You scored ${score}/30. The tensions are relatively low.`;
    ctaHeadline = 'Still worth mapping clearly.';
    ctaCopy = 'Even lower-tension decisions benefit from structure.';
  }

  const insights = [];

  if (data.alignment >= 4) {
    insights.push({
      title: 'Partner alignment is the central challenge',
      text: 'You may be solving two different problems at once.'
    });
  }

  if (data.career >= 4) {
    insights.push({
      title: 'The career trade-off is genuinely hard',
      text: 'This needs explicit mapping, not intuition.'
    });
  }

  if (data.identity >= 4) {
    insights.push({
      title: 'Identity and belonging matter',
      text: 'This is deeper than logistics.'
    });
  }

  const resultScreen = document.getElementById('resultScreen');
  const formScreen = document.getElementById('formScreen');

  if (formScreen) formScreen.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('visible');
}


// ── PILOT APPLICATION FORM SUBMIT (FIX) ──────────────────────
const pilotForm = document.getElementById("pilotForm");

if (pilotForm) {
  pilotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(pilotForm);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      window.location.href = "/thank-you.html";
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  });
}

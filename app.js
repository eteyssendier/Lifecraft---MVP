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

  // Deselect siblings
  group.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  el.classList.add('selected');

  // Write to hidden input
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

  // Tension labels
  const tensionLabels = {
    alignment:  'Partner alignment',
    career:     'Career trade-off',
    schooling:  'Children / schooling',
    support:    'Family proximity',
    identity:   'Identity / belonging',
    urgency:    'Timing pressure'
  };

  // High tensions (score 4+)
  const highTensions = fields
    .filter(f => data[f] >= 4)
    .map(f => tensionLabels[f]);

  // Score band
  let band, bandClass, headline, summary, ctaHeadline, ctaCopy;

  if (score >= 22) {
    band = 'High tension';
    bandClass = 'score-high';
    headline = 'This is a linked family, career, and identity decision.';
    summary = `You scored ${score}/30. Multiple dimensions are interacting at once — partner alignment, career trade-offs, family proximity. This isn't a simple location choice and it won't resolve through more research or another conversation.`;
    ctaHeadline = 'A structured sprint could help.';
    ctaCopy = 'The pilot is designed for exactly this kind of decision — where the tensions are real, the stakes are high, and what you need is a clearer framework, not more opinions.';
  } else if (score >= 14) {
    band = 'Meaningful tension';
    bandClass = 'score-mid';
    headline = 'There are real trade-offs here that need to be mapped.';
    summary = `You scored ${score}/30. The tensions you're feeling are genuine, and the decision is more complex than it might appear on the surface. A structured comparison across stay, return, and redesign could surface what matters most.`;
    ctaHeadline = 'This is the kind of decision the sprint was built for.';
    ctaCopy = 'If you have a real decision to make in the next 12 months, applying makes sense — even if you\'re not certain yet which direction to go.';
  } else {
    band = 'Early exploration';
    bandClass = 'score-low';
    headline = 'You\'re in early exploration territory.';
    summary = `You scored ${score}/30. The tensions are relatively low right now, which suggests you may be in an early stage of this decision — or that one or two specific factors are driving the complexity. Worth naming those clearly before they compound.`;
    ctaHeadline = 'Still worth mapping clearly.';
    ctaCopy = 'Even lower-tension decisions benefit from structure. If you\'re likely to face this question in the next year, the pilot could help you get ahead of it.';
  }

  // Build insights based on highest-scoring dimensions
  const insights = [];

  if (data.alignment >= 4) {
    insights.push({
      title: 'Partner alignment is the central challenge',
      text: 'When partners are misaligned, the decision often stalls indefinitely — not because the answer isn\'t there, but because you\'re trying to solve two different problems at once. Mapping each person\'s actual priorities separately, before comparing, usually helps.'
    });
  }

  if (data.career >= 4) {
    insights.push({
      title: 'The career trade-off is genuinely hard',
      text: 'Career decisions in a dual-professional context rarely have clean answers. The sprint maps this explicitly — not to minimise the trade-off, but to make clear what each scenario actually costs and for whom.'
    });
  }

  if (data.identity >= 4) {
    insights.push({
      title: 'Identity and belonging are doing real work here',
      text: 'When identity is high in the decision, practical trade-offs often don\'t resolve it — because the question underneath is about who you are, not just where you live. The sprint includes a section specifically on this.'
    });
  }

  if (data.support >= 4 && insights.length < 2) {
    insights.push({
      title: 'Family proximity is weighing on the decision',
      text: 'Distance from family tends to compound over time — especially as parents age or children grow. Making this trade-off explicit, rather than leaving it as background pressure, usually clarifies things significantly.'
    });
  }

  if (!insights.length) {
    insights.push({
      title: 'Multiple moderate tensions',
      text: 'Your decision doesn\'t have a single dominant tension — several dimensions are weighing roughly equally. This is often harder to navigate than a single clear conflict, because there\'s no obvious place to start. Mapping all dimensions at once, as the sprint does, tends to surface the real priority.'
    });
  }

  // Render result
  const formScreen = document.getElementById('formScreen');
  const resultScreen = document.getElementById('resultScreen');

  if (formScreen) formScreen.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('visible');

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  setText('resultHeadline', headline);
  setText('resultSummary', summary);
  setText('ctaHeadline', ctaHeadline);
  setText('ctaCopy', ctaCopy);

  const bandEl = document.getElementById('scoreBand');
  if (bandEl) {
    bandEl.textContent = band;
    bandEl.className = `score-band ${bandClass}`;
  }

  // Tension tags
  const tagsEl = document.getElementById('tensionTags');
  if (tagsEl && highTensions.length) {
    tagsEl.innerHTML = `<p style="font-size:.82rem;color:var(--muted);margin-bottom:.5rem">Your highest tensions:</p>` +
      highTensions.map(t => `<span class="tension-tag">↑ ${t}</span>`).join('');
  }

  // Insight cards
  const insightsEl = document.getElementById('resultInsights');
  if (insightsEl) {
    insightsEl.innerHTML = insights.map(i => `
      <div class="result-insight">
        <h3>${i.title}</h3>
        <p>${i.text}</p>
      </div>
    `).join('');
  }

  // Scroll to result
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ── ASSESSMENT FORM SUBMIT ─────────────────────────────────────
const assessmentForm = document.getElementById('assessmentForm');
if (assessmentForm) {
  assessmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    renderAssessmentResult(assessmentAnswers);
  });
}


// ── FACTOR CHECKBOXES — no alert() ────────────────────────────
const factorCheckboxes = document.querySelectorAll('input[name="factors"]');
const factorLimitMsg = document.getElementById('factorLimitMsg');

if (factorCheckboxes.length) {
  factorCheckboxes.forEach(box => {
    box.addEventListener('change', () => {
      const checked = document.querySelectorAll('input[name="factors"]:checked');
      if (checked.length > 4) {
        box.checked = false;
        if (factorLimitMsg) factorLimitMsg.classList.add('visible');
        setTimeout(() => {
          if (factorLimitMsg) factorLimitMsg.classList.remove('visible');
        }, 3000);
      }
    });
  });
}


// ── PILOT APPLICATION FORM SUBMIT ────────────────────────────
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

function bindRangeValue(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  if (!input || !output) return;
  const sync = () => {
    output.textContent = input.value;
  };
  input.addEventListener('input', sync);
  sync();
}

['stuck', 'importance', 'alignment', 'schooling', 'career', 'support', 'identity', 'urgency'].forEach((id) => {
  bindRangeValue(id, `${id}Value`);
});

function renderAssessmentResult(score, tensions) {
  let fit = 'Moderate tension';
  let summary = 'There is some friction here, but it may still be manageable informally.';

  if (score >= 22) {
    fit = 'High tension';
    summary = 'This looks like a linked family-career-identity decision, not a simple location choice.';
  } else if (score >= 16) {
    fit = 'Meaningful tension';
    summary = 'Multiple dimensions are interacting. A structured comparison could help.';
  }

  document.body.innerHTML = `
    <main class="result-shell">
      <div class="container card result-card">
        <p class="section-label">Assessment summary</p>
        <h1>${fit}</h1>
        <p class="lead">Score: <strong>${score}/30</strong>. ${summary}</p>
        <div class="result-grid">
          <div class="result-box">
            <h3>Main tensions</h3>
            <ul>${tensions.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="result-box">
            <h3>Suggested next step</h3>
            <p>If this decision matters in the next 12 months, apply for the founder pilot and compare stay, return, and redesign paths in a structured way.</p>
          </div>
        </div>
        <div class="actions">
          <a class="btn" href="apply.html">Apply for the pilot</a>
          <a class="btn btn-secondary" href="assessment.html">Retake assessment</a>
        </div>
      </div>
    </main>
  `;
}

const assessmentForm = document.getElementById('assessmentForm');
if (assessmentForm) {
  assessmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(assessmentForm).entries());
    const mapping = {
      alignment: 'Partner alignment',
      schooling: 'Children / schooling',
      career: 'Career trade-off',
      support: 'Family proximity',
      identity: 'Identity / belonging',
      urgency: 'Timing pressure'
    };
    const tensions = Object.entries(data)
      .filter(([, value]) => Number(value) >= 4)
      .map(([key]) => mapping[key]);
    const score = Object.values(data).reduce((sum, value) => sum + Number(value), 0);
    renderAssessmentResult(score, tensions.length ? tensions : ['Mixed but moderate tensions']);
  });
}

const factorCheckboxes = document.querySelectorAll('input[name="factors"]');
if (factorCheckboxes.length) {
  factorCheckboxes.forEach((box) => {
    box.addEventListener('change', () => {
      const checked = document.querySelectorAll('input[name="factors"]:checked');
      if (checked.length > 4) {
        box.checked = false;
        alert('Please pick up to 4 factors only.');
      }
    });
  });
}

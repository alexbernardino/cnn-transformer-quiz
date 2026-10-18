import { questions } from "./questions.js";
import { escapeHtml, formatMathText } from "./math-text.js";

const root = document.querySelector("#quiz-root");
const sections = ["CNN foundations", "Image encoding", "Attention & classification"];
let answers = Array(questions.length).fill(null);
let current = 0;
let finished = false;

function score() {
  return answers.reduce((total, choice, index) => total + Number(choice === questions[index].answer), 0);
}

function visual(section) {
  if (section === "CNN foundations") {
    const grid = Array.from({ length: 25 }, (_, i) => `<rect x="${15 + (i % 5) * 19}" y="${30 + Math.floor(i / 5) * 19}" width="19" height="19" fill="${i % 4 === 0 ? "#dce5f8" : "#fffdf8"}" stroke="#b4b6bc"/>`).join("");
    return `<svg class="mini-visual" viewBox="0 0 240 170" role="img" aria-label="A local image window and the feature maps computed by convolution">
      <rect width="240" height="170" fill="#f4f1e8"/>
      <text x="39" y="19">Image</text>${grid}
      <rect x="15" y="30" width="57" height="57" fill="#315fc7" fill-opacity=".16" stroke="#315fc7" stroke-width="2"/>
      <path d="M120 77H144L137 72M144 77L137 82" fill="none" stroke="#315fc7" stroke-width="2"/>
      <rect x="163" y="46" width="53" height="62" fill="#e5f3ed" stroke="#178464"/>
      <rect x="156" y="52" width="53" height="62" fill="#dce5f8" stroke="#315fc7"/>
      <path d="M174 52V114M191 52V114M156 73H209M156 94H209" fill="none" stroke="#8ca6df"/>
      <text x="150" y="132">Feature maps</text>
      <text x="38" y="158" class="visual-caption">Local windows, shared learned filters</text>
    </svg>`;
  }
  if (section === "Image encoding") {
    const cells = Array.from({ length: 16 }, (_, i) => `<rect x="${16 + (i % 4) * 22}" y="${33 + Math.floor(i / 4) * 22}" width="22" height="22" fill="${["#dce5f8", "#e5f3ed", "#f5e6d1", "#e9def6"][Math.floor((i % 4) / 2) + 2 * Math.floor(i / 8)]}" stroke="#fffdf8"/>`).join("");
    const rows = ["#dce5f8", "#e5f3ed", "#f5e6d1", "#e9def6"].map((fill, i) => `<rect x="157" y="${34 + i * 23}" width="65" height="17" rx="3" fill="${fill}" stroke="#8ca6df"/>`).join("");
    return `<svg class="mini-visual" viewBox="0 0 240 170" role="img" aria-label="Image patches mapped to token feature vectors">
      <rect width="240" height="170" fill="#f4f1e8"/>
      <text x="33" y="20">Patches</text>${cells}
      <rect x="16" y="33" width="88" height="88" fill="none" stroke="#315fc7"/>
      <path d="M60 33V121M16 77H104" fill="none" stroke="#315fc7" stroke-width="2"/>
      <path d="M116 77H143L136 72M143 77L136 82" fill="none" stroke="#315fc7" stroke-width="2"/>
      <text x="170" y="20">Tokens</text>${rows}
      <text x="43" y="158" class="visual-caption">Image regions become feature vectors</text>
    </svg>`;
  }
  const sources = [31, 87, 143, 199];
  return `<svg class="mini-visual" viewBox="0 0 240 170" role="img" aria-label="A receiving token combines information from several source tokens">
    <rect width="240" height="170" fill="#f4f1e8"/>
    <text x="75" y="20">Source tokens</text>
    ${sources.map(x => `<path d="M${x} 48L115 111" fill="none" stroke="#8ca6df" stroke-width="1.5"/><circle cx="${x}" cy="48" r="10" fill="#dce5f8" stroke="#315fc7"/>`).join("")}
    <path d="M110 101L115 113L121 103" fill="none" stroke="#315fc7" stroke-width="1.5"/>
    <circle cx="115" cy="116" r="12" fill="#315fc7"/>
    <text x="68" y="143">Receiving token</text>
    <text x="29" y="160" class="visual-caption">Attention combines source information</text>
  </svg>`;
}

function renderQuestion() {
  const q = questions[current];
  const choice = answers[current];
  const answered = choice !== null;
  root.innerHTML = `<div class="quiz-layout">
    <aside class="lesson-rail" aria-label="Learning path">
      <p class="eyebrow">Learning path</p>
      <h2>From image features to class predictions</h2>
      <ol>${sections.map((section, index) => `<li class="${q.section === section ? "active" : ""}" ${q.section === section ? 'aria-current="step"' : ""}><span>0${index + 1}</span>${escapeHtml(section)}</li>`).join("")}</ol>
      <div class="rail-note"><p>Answer first, then read the explanation. Your responses stay in this browser tab; nothing is submitted.</p></div>
    </aside>
    <section class="question-stage" aria-label="Quiz question">
      <p class="setup-note"><strong>Chapter scope:</strong> CNN and Transformer image classification. Use the assumptions stated in each question. Choose one best answer, then check the explanation.</p>
      <div class="progress-row"><span>Question ${current + 1} of ${questions.length}</span><div class="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${current + 1}"><div style="width:${((current + 1) / questions.length) * 100}%"></div></div><strong>${score()} points</strong></div>
      <article class="question-card">
        <div class="question-top"><div><p class="question-label">${escapeHtml(q.category)}</p><h2 id="question-title" tabindex="-1">${formatMathText(q.prompt)}</h2></div>${visual(q.section)}</div>
        <div class="answers" role="group" aria-label="Answer choices">${q.options.map((option, index) => {
          const status = answered ? (index === q.answer ? "answer-correct" : index === choice ? "answer-wrong" : "") : "";
          const mark = answered && index === q.answer ? "✓" : answered && index === choice ? "×" : String.fromCharCode(65 + index);
          return `<button type="button" data-choice="${index}" ${answered ? "disabled" : ""} aria-pressed="${choice === index}" class="${status}"><span class="answer-mark" aria-hidden="true">${mark}</span><div class="answer-text">${formatMathText(option)}</div></button>`;
        }).join("")}</div>
        ${answered ? `<div class="feedback ${choice === q.answer ? "correct" : "incorrect"}" role="status" tabindex="-1"><strong>${choice === q.answer ? "Correct." : "Not quite."}</strong><p>${formatMathText(q.explanation)}</p><div class="try-it"><b>Check it:</b> ${formatMathText(q.activity)}</div></div>` : ""}
        <div class="card-actions"><button type="button" class="secondary" data-action="previous" ${current === 0 ? "disabled" : ""}>← Previous</button><button type="button" class="primary" data-action="next" ${!answered ? "disabled" : ""}>${current === questions.length - 1 ? "See results" : "Next question →"}</button></div>
      </article>
    </section>
  </div>`;
}

function renderResults() {
  const total = score();
  const summary = sections.map(section => {
    const indices = questions.map((question, index) => question.section === section ? index : -1).filter(index => index >= 0);
    const correct = indices.filter(index => answers[index] === questions[index].answer).length;
    return `<li><span>${escapeHtml(section)}</span><strong>${correct} / ${indices.length}</strong></li>`;
  }).join("");
  root.innerHTML = `<section class="results" aria-labelledby="results-title">
    <p class="eyebrow">Quiz complete</p>
    <div class="score-ring" style="--score:${(total / questions.length) * 360}deg"><span>${total}/${questions.length}</span></div>
    <h2 id="results-title" tabindex="-1">${total} out of ${questions.length} correct</h2>
    <p>Review the explanations and short calculations to connect image features, token representations and class predictions.</p>
    <ul class="section-results">${summary}</ul>
    <div class="result-actions"><button type="button" class="secondary" data-action="review">Review answers</button><button type="button" class="primary" data-action="restart">Restart quiz</button></div>
  </section>`;
}

function render(focusTarget) {
  if (finished) renderResults(); else renderQuestion();
  if (focusTarget) root.querySelector(focusTarget)?.focus();
}

root.addEventListener("click", event => {
  const choiceButton = event.target.closest("[data-choice]");
  if (choiceButton && answers[current] === null) {
    answers[current] = Number(choiceButton.dataset.choice);
    render(".feedback");
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "previous" && current > 0) {
    current -= 1;
    render("#question-title");
  } else if (action === "next" && answers[current] !== null) {
    if (current === questions.length - 1) {
      finished = true;
      render("#results-title");
    } else {
      current += 1;
      render("#question-title");
    }
  } else if (action === "review") {
    finished = false;
    current = 0;
    render("#question-title");
  } else if (action === "restart") {
    answers = Array(questions.length).fill(null);
    current = 0;
    finished = false;
    render("#question-title");
  }
});

render();


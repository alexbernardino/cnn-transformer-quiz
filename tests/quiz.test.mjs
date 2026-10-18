import { test } from "node:test";
import assert from "node:assert/strict";
import { questions } from "../questions.js";
import { formatMathText } from "../math-text.js";

const sections = ["CNN foundations", "Image encoding", "Attention & classification"];

test("the question bank has twenty distinct questions and balanced answer positions", () => {
  assert.equal(questions.length, 20);
  assert.deepEqual(sections.map(section => questions.filter(q => q.section === section).length), [8, 4, 8]);
  assert.equal(new Set(questions.map(q => q.prompt)).size, 20);
  assert.deepEqual([0, 1, 2, 3].map(answer => questions.filter(q => q.answer === answer).length), [5, 5, 5, 5]);
  for (const q of questions) {
    assert.equal(q.options.length, 4, q.prompt);
    assert.equal(new Set(q.options).size, 4, q.prompt);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.prompt);
    assert.ok(q.explanation.length > 90 && q.activity.length > 35, q.prompt);
    assert.ok(q.slides.length && q.slides.every(title => typeof title === "string" && title.length > 5));
    assert.ok(!/^check it:/i.test(q.activity), "The interface supplies the activity label");
  }
  assert.doesNotMatch(JSON.stringify(questions), /shifted windows|permutation.equivariant|Swin|CNN-to-token bridge/i);
});

test("math indices render completely, including adjoining variables and named subscripts", () => {
  assert.equal(formatMathText("Q = ZW_{Q}; q_{i}k_{j}ᵀ; a_{ij}; C_{in}"),
    "Q = ZW<sub>Q</sub>; q<sub>i</sub>k<sub>j</sub>ᵀ; a<sub>ij</sub>; C<sub>in</sub>");
  assert.equal(formatMathText("z_{i}^{(L)} and W_{cls}, O_{cat}"),
    "z<sub>i</sub><sup>(L)</sup> and W<sub>cls</sub>, O<sub>cat</sub>");
  assert.equal(formatMathText('<img src=x onerror="alert(1)"> W_{<b>}'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; W<sub>&lt;b&gt;</sub>');
  for (const q of questions) {
    for (const text of [q.prompt, ...q.options, q.explanation, q.activity]) {
      assert.doesNotMatch(formatMathText(text), /[_^]\{/, text);
    }
  }
});

test("answer locking, scoring, section results, review and restart work across all questions", async () => {
  const listeners = new Map();
  const root = { innerHTML: "", addEventListener: (name, fn) => listeners.set(name, fn), querySelector: () => ({ focus() {} }) };
  const original = globalThis.document;
  globalThis.document = { querySelector: () => root };
  try {
    await import("../quiz.js");
    const click = (kind, value) => listeners.get("click")({ target: { closest: selector => selector === `[data-${kind}]` ? { dataset: { [kind]: value } } : null } });
    assert.match(root.innerHTML, /Question 1 of 20/);
    assert.match(root.innerHTML, /data-action="next" disabled/);
    click("action", "next");
    assert.match(root.innerHTML, /Question 1 of 20/);
    click("choice", String((questions[0].answer + 1) % 4));
    assert.match(root.innerHTML, /Not quite\./);
    click("choice", String(questions[0].answer));
    assert.match(root.innerHTML, /0 points/, "Feedback locks the first choice");
    click("action", "next");
    click("action", "previous");
    assert.match(root.innerHTML, /Not quite\./, "Previous responses are retained");
    click("action", "next");
    for (let i = 1; i < questions.length; i++) {
      assert.match(root.innerHTML, new RegExp(`Question ${i + 1} of 20`));
      assert.doesNotMatch(root.innerHTML, /[_^]\{/);
      assert.equal((root.innerHTML.match(/class="answer-text"/g) || []).length, 4);
      click("choice", String(questions[i].answer));
      assert.match(root.innerHTML, /Correct\./);
      assert.doesNotMatch(root.innerHTML, /[_^]\{/);
      click("action", "next");
    }
    assert.match(root.innerHTML, /19 out of 20 correct/);
    for (const summary of ["7 / 8", "4 / 4", "8 / 8"]) assert.ok(root.innerHTML.includes(summary));
    click("action", "review");
    assert.match(root.innerHTML, /Question 1 of 20/);
    assert.match(root.innerHTML, /19 points/);
    for (const q of questions) click("action", "next");
    click("action", "restart");
    assert.match(root.innerHTML, /0 points/);
    assert.doesNotMatch(root.innerHTML, /class="feedback/);
  } finally {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  }
});

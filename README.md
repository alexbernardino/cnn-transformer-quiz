# CNN and Transformer concept check

A **20-question formative quiz** about CNNs and Transformers for image classification, based on the active material in `6_Neural_Networks.tex` read on **18 October 2026**.

The quiz follows the existing MLP quiz's visual style and interactions: a learning-path sidebar, four answer choices, immediate explanatory feedback, a short “Check it” activity, progress and score, section results, answer review and restart. Answers stay in the open browser tab; nothing is submitted. Refreshing resets the quiz.

## Coverage

| Section | Questions | Topics |
|---|---:|---|
| CNN foundations | 8 | Locality and sharing; stride/padding; convolution and ReLU; channels/shapes/parameters; pooling; flattening/GAP; end-to-end training; dense-head parameter counts |
| Image encoding | 4 | Tokens and the classifier pipeline; patch counts; shared patch projection; learned positions and CLS |
| Attention & classification | 8 | Q/K/V versus their learned projections; scaled scores and softmax; numerical attention; nonlinear/asymmetric attention; multi-head output projection; LayerNorm and token-wise MLPs; CLS classification; attention cost |

Commented-out slides were excluded: the separate CNN residual-block and CNN-to-token bridge slides, and the optional positional-invariance and Swin slides. The active ViT encoder block, including LayerNorm and its residual additions, remains in scope. Questions cite slide titles rather than page numbers so they remain useful when the chapter is reordered.

[QUESTION_GUIDE.md](QUESTION_GUIDE.md) contains a readable question bank, answer key, explanations and exact lecture-slide titles. `questions.js` is the editable bank used by the site. The options are fixed, with correct answers evenly distributed across A–D.

## Preview

From this folder:

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000/**. Use a local server because the quiz uses JavaScript modules.

The published site needs no build step, package installation, account, backend, external fonts or third-party runtime libraries. All asset paths are relative.

## GitHub Pages

The intended published URL is **https://alexbernardino.github.io/cnn-transformer-quiz/**.

### As a folder in the existing website repository

Copy this complete folder into `alexbernardino.github.io` as `cnn-transformer-quiz/`, then commit and push using that repository's existing Pages setup. The workflow inside the quiz folder is unnecessary in that arrangement.

### As a separate repository

Create a repository named `cnn-transformer-quiz` under `alexbernardino`. From this folder, upload the contents, including the hidden `.github` folder:

```sh
git init
git add .
git commit -m "Add CNN and Transformer image-classification quiz"
git branch -M main
git remote add origin https://github.com/alexbernardino/cnn-transformer-quiz.git
git push -u origin main
```

Under **Settings → Pages**, select **GitHub Actions**. The included workflow runs the checks and deploys the quiz when `main` is pushed. After configuring Pages, run **Actions → Deploy to GitHub Pages → Run workflow** if necessary.

Alternatively, select **Deploy from a branch**, using `main` and `/(root)`. The site is already static.

## QR code

- [PNG for lecture slides](cnn-transformer-quiz-qr.png)
- [SVG for scalable printing](cnn-transformer-quiz-qr.svg)

Both encode **https://alexbernardino.github.io/cnn-transformer-quiz/**. The destination becomes available once you publish the quiz. To change it, edit `QUIZ_URL` in `tools/generate_qr.py` and regenerate both assets with ReportLab and Pillow installed. Those packages are needed only for QR generation.

## Checks and editing

With Node.js 22 or later:

```sh
npm test
```

No installation is needed. Checks cover question structure, balanced answer positions, mathematical index rendering, HTML escaping, answer locking, navigation, scoring, section results, review and restart.

Each question in `questions.js` has a `section`, `category`, `prompt`, four `options`, a zero-based `answer`, `explanation`, `activity`, and `slides` containing exact lecture-slide titles. Activities should not repeat the interface's “Check it” label.

Use Unicode symbols such as `×`, `√`, `²`, and `ᵀ`. The small local renderer supports complete braced indices such as `a_{ij}`, `C_{in}`, `W_{Q}`, `W_{cls}` and `z_{i}^{(L)}`. It escapes HTML and is not a general LaTeX engine.

# 📚 RailPrep LDCE — Content Authoring Guide

This guide explains how to **add a new test paper** or **add a brand-new section** without touching any application code. The app discovers content at build time using Vite's `import.meta.glob`, so dropping a JSON file in the right place is enough.

---

## 📂 Where content lives

```
src/data/
├── sections.json                  # master list of all sections
├── mathematics/
│   ├── index.json                 # list of test papers in this section
│   └── time-and-work-1.json       # one test paper
├── science/
│   ├── index.json
│   ├── science-test-1.json
│   └── ...
├── english/
│   └── index.json
└── ... (one folder per section)
```

Two rules to remember:

1. **Every section folder must contain an `index.json`** — even an empty `[]` is fine if there are no tests yet.
2. **Every test paper needs an entry in its section's `index.json`** — the file alone is not enough; the index is what the Section page reads.

---

## ➕ Adding a new test paper to an existing section

### Step 1 — Create the test JSON file

Drop a new file under `src/data/<section-id>/`. The filename should be URL-safe (lowercase, hyphens, no spaces). Convention: `<topic-or-name>-<number>.json`.

Example: `src/data/mathematics/percentage-1.json`

```json
{
  "paperName": "Percentage Mock Test – 1",
  "questions": [
    {
      "id": 1,
      "question": {
        "en": "What is 25% of 200?",
        "hi": "200 का 25% कितना है?"
      },
      "options": [
        { "en": "25", "hi": "25" },
        { "en": "50", "hi": "50" },
        { "en": "75", "hi": "75" },
        { "en": "100", "hi": "100" }
      ],
      "correct": 1
    },
    {
      "id": 2,
      "question": {
        "en": "If 40% of a number is 80, the number is:",
        "hi": "यदि किसी संख्या का 40% 80 है, तो वह संख्या है:"
      },
      "options": [
        { "en": "150", "hi": "150" },
        { "en": "180", "hi": "180" },
        { "en": "200", "hi": "200" },
        { "en": "240", "hi": "240" }
      ],
      "correct": 2
    }
  ]
}
```

#### Field rules

| Field | Type | Notes |
|---|---|---|
| `paperName` | string | Shown on the Section card and Test/Result pages. Same in any language is fine. |
| `questions` | array | One or more question objects. |
| `questions[].id` | number | Must be unique within this paper. Used internally to track wrong/skipped. |
| `questions[].question` | `{ en, hi }` | Both keys required. Plain strings — no HTML. |
| `questions[].options` | array of `{ en, hi }` | Currently 4 options expected. The UI labels them A/B/C/D. |
| `questions[].correct` | number | **Zero-based** index of the correct option in the `options` array. Always set this against the **original** order; the app shuffles options at runtime and recalculates this automatically. |

### Step 2 — Register it in the section's `index.json`

Open `src/data/<section-id>/index.json` and add an entry:

```json
[
  { "id": "time-and-work-1", "file": "time-and-work-1.json", "paperName": "Time and Work Mock Test – 1" },
  { "id": "percentage-1",    "file": "percentage-1.json",    "paperName": "Percentage Mock Test – 1" }
]
```

| Field | Notes |
|---|---|
| `id` | URL slug used in the route (`/test/<section>/<id>`). Must be unique within the section and a valid URL segment. Convention: same as the filename without `.json`. |
| `file` | Filename of the test JSON (must exist in the same folder). |
| `paperName` | Shown on the Section page card. Should match the `paperName` inside the test JSON for consistency. |

### Step 3 — Verify

```bash
npm run dev
```

- Open the Section page for that section.
- The new paper should appear with its question count (the count is read from the JSON).
- Click into it, verify the questions render bilingually, options shuffle, and scoring works.

That's it — no code changes anywhere else.

---

## 🆕 Adding a brand-new section

### Step 1 — Pick a section id

Use a short URL-safe slug. Example: `electrical-engineering`.

### Step 2 — Add it to `src/data/sections.json`

```json
[
  { "id": "gk", "name": { "en": "General Knowledge", "hi": "सामान्य ज्ञान" }, "icon": "🌍" },
  { "id": "science", "name": { "en": "Science", "hi": "विज्ञान" }, "icon": "🔬" },
  { "id": "english", "name": { "en": "English", "hi": "अंग्रेज़ी" }, "icon": "📚" },
  { "id": "rajbhasha", "name": { "en": "Rajbhasha", "hi": "राजभाषा" }, "icon": "🇮🇳" },
  { "id": "heat-treatment", "name": { "en": "Heat Treatment", "hi": "ऊष्मा उपचार" }, "icon": "🔥" },
  { "id": "mathematics", "name": { "en": "Mathematics", "hi": "गणित" }, "icon": "🧮" },
  { "id": "electrical-engineering", "name": { "en": "Electrical Engineering", "hi": "विद्युत अभियांत्रिकी" }, "icon": "⚡" }
]
```

| Field | Notes |
|---|---|
| `id` | Folder name under `src/data/` and the route segment (`/section/<id>`). Lowercase, hyphens, no spaces. |
| `name.en` / `name.hi` | Both required — the home page card stacks them. |
| `icon` | A single emoji works best. Anything renderable in `<span>` is fine. |

### Step 3 — Create the section folder + empty index

Create the folder `src/data/electrical-engineering/` and inside it create `index.json`:

```json
[]
```

> ⚠️ The folder **must** contain an `index.json` (empty array is fine), otherwise the Section page will say "No tests available".

### Step 4 — Add tests to it

Follow the **Adding a new test paper** steps above. Each new paper:

1. JSON file in `src/data/electrical-engineering/`
2. Entry in `src/data/electrical-engineering/index.json`

### Step 5 — Verify

```bash
npm run dev
```

- The new section card appears on the Home page automatically.
- Empty section shows the "No tests available" hint until you add papers.

---

## 🧪 Quick sanity checklist before committing

- [ ] JSON files are valid (use an editor with JSON validation, or run `npx jsonlint <file>`).
- [ ] Every `correct` value is a valid index into its `options` array (0–3 for 4 options).
- [ ] No duplicate `id` values within a paper, and no duplicate `id` values within a section's `index.json`.
- [ ] Both `en` and `hi` keys exist on every question and every option.
- [ ] `paperName` in the test JSON matches the one in `index.json`.
- [ ] `npm run build` succeeds with no warnings.

---

## 📐 Schema summary (TypeScript shape)

For reference, the types the app uses (see `src/types/index.ts`):

```ts
interface Bilingual { en: string; hi: string; }

interface Section {
  id: string;
  name: Bilingual;
  icon: string;
}

interface TestIndexEntry {
  id: string;
  file: string;
  paperName: string;
}

interface RawQuestion {
  id: number;
  question: Bilingual;
  options: Bilingual[];
  correct: number; // zero-based index into options (original order)
}

interface RawTest {
  paperName: string;
  questions: RawQuestion[];
}
```

---

## 🚂 Tips for content authors

- Keep options short and parallel in structure — it makes shuffling read more naturally.
- Hindi numbers can be left in English digits (`200`) since both forms are common in railway material.
- For math expressions like `36/5 days`, write the same in Hindi: `36/5 दिन`. No LaTeX required.
- If a question is identical in both languages (numbers, formulas), repeat the same string in `en` and `hi` — the bilingual layout still renders cleanly.
- Aim for 20–25 questions per mock test to mirror real LDCE pace.

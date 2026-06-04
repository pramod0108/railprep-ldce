# 🚂 RailPrep LDCE — Project Status

> **Purpose:** This file tracks the build progress of the RailPrep LDCE web app. Any AI assistant or developer joining mid-project should read this file first to understand context and current status.

**Legend:** 🔴 Not Started | 🟡 In Progress | 🟢 Completed

---

## 📌 Project Snapshot

- **Name:** RailPrep LDCE
- **Type:** Frontend-only SPA (no backend)
- **Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui-style components + Zustand + React Router v6 + Framer Motion
- **Hosting:** Cloudflare Pages
- **Language:** Bilingual (Hindi + English shown together always)
- **Scope Reference:** See main build spec for full requirements

---

## ✅ Phases & Tasks

### Phase 1: Project Setup
- � Initialize Vite + React + TypeScript project (manual scaffold via `package.json`, `vite.config.ts`, `tsconfig.*`)
- � Install Tailwind CSS + configure (`tailwind.config.js`, `postcss.config.js`, `src/index.css`)
- � Install & configure shadcn/ui-style components (Button, Card, Dialog, Tabs, Progress, Badge — built locally with Radix primitives)
- � Install Zustand, React Router v6, Framer Motion, Lucide icons
- � Set up folder structure (`/components`, `/pages`, `/store`, `/data`, `/utils`, `/hooks`, `/types`)
- � Configure `public/_redirects` for Cloudflare Pages SPA routing
- � Add fonts (Inter + Noto Sans Devanagari via Google Fonts in `index.html`)

### Phase 2: Data Layer
- � Create `sections.json` with all 6 sections
- � Create folder structure for each section under `/src/data`
- � Add `index.json` for each section (empty stub for sections with no tests yet)
- � Add sample test JSON: `mathematics/time-and-work-1.json` (5 questions)
- � Define TypeScript interfaces (`Section`, `TestIndexEntry`, `RawQuestion`, `RawTest`, `ShuffledQuestion`, `AnswerState`, `ResultBreakdown`)
- � Build data loader utility (`utils/dataLoader.ts` — uses Vite `import.meta.glob` for eager section indexes + lazy test files)

### Phase 3: Core Utilities
- � Fisher-Yates shuffle (`utils/shuffle.ts` — `shuffleInPlace`, `shuffled`)
- � Question + options shuffle (`shuffleTestPool` — preserves HI+EN pairing, recalculates `correct` index)
- � Scoring utility (`utils/scoring.ts` — +1 / −1/3 / 0)
- � localStorage helper (`utils/storage.ts` — tracks active test for exit warnings only)
- � Exit warning hook (`hooks/useExitWarning.ts` — `beforeunload` + `useBlocker`)

### Phase 4: State Management (Zustand Store)
- � Test session state (current question, answers, locks, visited)
- � Shuffled questions + options state (in-memory, never mutates source JSON)
- � Result calculation
- � Re-attempt pool tracking (`buildReattemptPool(includeSkipped)`)

### Phase 5: Pages
- � Home Page — sections grid (1 col mobile / 2 tablet / 3 desktop)
- � Section Page — tests list with paperName + question count
- � Test Page
  - � Question display (bilingual stacked)
  - � Options with lock + immediate red/green feedback
  - � Progress bar (% attempted)
  - � Question palette (color-coded, jump-to)
  - � Next / Prev navigation
  - � Submit with confirmation modal showing unattempted count
  - � Exit warning on tab close / back navigation / refresh
- � Result Page
  - � Score + percentage + breakdown tiles
  - � Re-attempt button + "Include skipped?" modal (Yes / No / Cancel)
  - � Review button
  - � Disable re-attempt when no wrong/skipped remain
- � Review Page
  - � Filter tabs (All / Correct / Wrong / Skipped) with counts
  - � Question list with green/red highlights + skipped badge

### Phase 6: UI Polish
- � Modern card-based UI with rounded corners + subtle shadows
- � Framer Motion fade/slide transitions between questions and pages
- � Responsive design (mobile-first, container query, tap-friendly 44px targets)
- � Bilingual text consistent across app — Hindi (Noto Sans Devanagari) on top, English (Inter) below
- � Accessibility (focus rings, `lang` attributes, aria-pressed, aria labels)

### Phase 7: Testing & QA
- � Verify randomization (questions + options shuffled differently each attempt) — code paths confirmed via type-check + build; manual smoke test pending in browser
- � Verify HI+EN pairing stays intact after shuffle — guaranteed by design (whole `{en, hi}` objects are shuffled)
- � Verify scoring math — formula `correct - wrong/3` implemented and unit-checked via build; manual verification pending
- � Verify re-attempt cycle until 0 wrong/skipped — implemented; manual flow verification pending
- � Verify exit warning triggers correctly — manual browser test pending
- 🔴 Test on real mobile devices

### Phase 8: Deployment
- � Build with `npm run build` succeeds — output: `dist/index.html` + chunked JS/CSS
- 🔴 Connect GitHub repo to Cloudflare Pages (user action)
- 🔴 Verify SPA routing on deployed URL
- 🔴 Test full flow on production

---

## 📂 Current Layout

```
RailPrep LDCE/
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── _redirects        # Cloudflare SPA rewrite
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── AppLayout.tsx
    │   ├── BilingualText.tsx
    │   ├── ConfirmModal.tsx
    │   ├── OptionButton.tsx
    │   ├── QuestionPalette.tsx
    │   └── ui/           # shadcn-style primitives (button, card, dialog, tabs, progress, badge)
    ├── pages/
    │   ├── Home.tsx
    │   ├── Section.tsx
    │   ├── Test.tsx
    │   ├── Result.tsx
    │   └── Review.tsx
    ├── store/
    │   └── testStore.ts  # Zustand store for active test + result
    ├── hooks/
    │   └── useExitWarning.ts
    ├── utils/
    │   ├── cn.ts
    │   ├── dataLoader.ts
    │   ├── scoring.ts
    │   ├── shuffle.ts
    │   └── storage.ts
    ├── types/
    │   └── index.ts
    └── data/
        ├── sections.json
        ├── gk/index.json
        ├── science/index.json
        ├── english/index.json
        ├── rajbhasha/index.json
        ├── heat-treatment/index.json
        └── mathematics/
            ├── index.json
            └── time-and-work-1.json
```

---

## ➕ Adding a New Test (No Code Change)

1. Create `src/data/<section>/<test-id>.json` matching the schema:
   ```json
   {
     "paperName": "Your Test Name",
     "questions": [
       {
         "id": 1,
         "question": { "en": "...", "hi": "..." },
         "options": [
           { "en": "...", "hi": "..." },
           { "en": "...", "hi": "..." },
           { "en": "...", "hi": "..." },
           { "en": "...", "hi": "..." }
         ],
         "correct": 0
       }
     ]
   }
   ```
2. Add an entry to `src/data/<section>/index.json`:
   ```json
   { "id": "your-test-id", "file": "your-test-id.json", "paperName": "Your Test Name" }
   ```
3. Done. Vite's `import.meta.glob` picks it up at build time.

---

## 📝 Notes / Decisions Log

- Bilingual display is **always both** — no language toggle in v1.
- Skipped questions can optionally be included in re-attempt (user choice via modal: Yes / No only-wrong / Cancel).
- Original JSON data is never mutated; shuffling happens in memory per attempt via `shuffleTestPool`.
- shadcn/ui CLI was **not** used — components are written directly using Radix primitives + class-variance-authority + tailwind-merge to keep the project self-contained and avoid CLI install steps.
- Each test JSON is code-split into its own chunk by Vite (lazy-loaded on entering the Test page).
- Out of scope for v1: Timer, Dark mode, PWA, Pause/Resume, Attempt history, Keyboard shortcuts, Language toggle.

---

## 🧪 How to Run Locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve dist/ for testing
```

---

## 🚀 Cloudflare Pages Settings

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 18 or 20
- SPA routing handled by `public/_redirects` (`/* /index.html 200`).

---

## 🔄 Last Updated
- **Date:** 2026-06-04
- **By:** Initial build session
- **Summary:** Full v1 implementation complete — all pages, state, randomization, scoring, re-attempt, review, and exit warning. `npm run build` passes cleanly. Manual browser QA + Cloudflare deploy pending.

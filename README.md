# 🚂 RailPrep LDCE

A **bilingual (Hindi + English)** web application for **Railway LDCE (Limited Departmental Competitive Examination)** practice.

🌐 **Live Demo:** [Add your Cloudflare Pages URL here] - will add later once deployed.

---

## ✨ Features

- 📚 **Multiple sections** — GK, Science, English, Rajbhasha, Heat Treatment, Mathematics (easily scalable)
- 🌐 **Bilingual** — every question and option shown in both Hindi and English
- 🎲 **Randomized** — questions and options shuffled on every attempt
- ✅ **Instant feedback** — correct/wrong highlight on option selection
- 🔁 **Smart re-attempt** — practice only the questions you got wrong (optionally include skipped)
- 📊 **Detailed review** — filter by All / Correct / Wrong / Skipped
- 🧮 **Accurate scoring** — +1 correct, −1/3 wrong, 0 skipped
- 🗺️ **Question palette** — quick jump grid with color-coded status
- 📱 **Fully responsive** — works seamlessly on mobile, tablet, desktop
- ⚠️ **Exit warning** — prevents accidental tab close mid-test

---

## 🛠️ Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Zustand** (state management)
- **React Router v6**
- **Framer Motion**
- **Cloudflare Pages** (hosting)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/pramod0108/railprep-ldce.git
cd railprep-ldce
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

---

## ➕ Adding a New Test

1. Create a new JSON file in `/src/data/<section>/` (e.g., `time-and-work-2.json`)
2. Add an entry to that section's `index.json`
3. No code changes required — the app picks it up automatically

### Test JSON Format

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

---

## 📁 Project Structure

```
/src
  /components       # Reusable UI components
  /pages            # Home, Section, Test, Result, Review
  /store            # Zustand state
  /data             # Test JSON files (organized by section)
  /utils            # Shuffle, scoring, storage helpers
  /hooks            # Custom React hooks
  /types            # TypeScript interfaces
```

---

## 📋 Project Status

See [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for current build phase and progress.

---

## 📄 License

MIT © pramod0108

---

## 🙏 Acknowledgements

Built for railway employees preparing for departmental promotion exams. May this help you succeed! 🚂

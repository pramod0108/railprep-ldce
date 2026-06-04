import { create } from "zustand";
import type {
  AnswerState,
  ResultBreakdown,
  RawTest,
  ShuffledQuestion,
} from "@/types";
import { shuffleTestPool } from "@/utils/shuffle";
import { calculateResult } from "@/utils/scoring";
import { activeTestStorage } from "@/utils/storage";

interface StartArgs {
  sectionId: string;
  testId: string;
  paperName: string;
  questions: ShuffledQuestion[];
}

interface TestStore {
  // Identification
  sectionId: string | null;
  testId: string | null;
  paperName: string;

  // Active test data
  questions: ShuffledQuestion[];
  answers: AnswerState[];
  currentIndex: number;
  isActive: boolean; // true while user is taking the test
  isSubmitted: boolean; // true after final submit -> Result page available

  // Last result + last attempt's questions/answers, kept after submission for Review.
  lastResult: ResultBreakdown | null;

  // Actions
  startFromRaw: (args: {
    sectionId: string;
    testId: string;
    raw: RawTest;
  }) => void;
  startFromQuestions: (args: StartArgs) => void;
  visitIndex: (index: number) => void;
  selectOption: (index: number, optionIndex: number) => void;
  goNext: () => void;
  goPrev: () => void;
  jumpTo: (index: number) => void;
  submit: () => ResultBreakdown;
  resetActive: () => void;
  /** Build a re-attempt pool of the wrong (and optionally skipped) questions. */
  buildReattemptPool: (includeSkipped: boolean) => ShuffledQuestion[];
}

const emptyAnswer = (): AnswerState => ({
  selected: null,
  visited: false,
  locked: false,
});

export const useTestStore = create<TestStore>((set, get) => ({
  sectionId: null,
  testId: null,
  paperName: "",
  questions: [],
  answers: [],
  currentIndex: 0,
  isActive: false,
  isSubmitted: false,
  lastResult: null,

  startFromRaw: ({ sectionId, testId, raw }) => {
    const shuffled = shuffleTestPool(raw.questions);
    const answers = shuffled.map(() => emptyAnswer());
    if (answers.length > 0) answers[0].visited = true;
    activeTestStorage.set({ sectionId, testId });
    set({
      sectionId,
      testId,
      paperName: raw.paperName,
      questions: shuffled,
      answers,
      currentIndex: 0,
      isActive: true,
      isSubmitted: false,
      lastResult: null,
    });
  },

  startFromQuestions: ({ sectionId, testId, paperName, questions }) => {
    // Reshuffle order + options once more for variety on re-attempt.
    const reshuffled = questions
      .map((q) => {
        // shuffle options preserving correct mapping
        const correctOpt = q.options[q.correct];
        const opts = [...q.options];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return {
          originalId: q.originalId,
          question: q.question,
          options: opts,
          correct: opts.indexOf(correctOpt),
        };
      })
      // shuffle question order
      .sort(() => Math.random() - 0.5);

    const answers = reshuffled.map(() => emptyAnswer());
    if (answers.length > 0) answers[0].visited = true;
    activeTestStorage.set({ sectionId, testId });
    set({
      sectionId,
      testId,
      paperName,
      questions: reshuffled,
      answers,
      currentIndex: 0,
      isActive: true,
      isSubmitted: false,
      lastResult: null,
    });
  },

  visitIndex: (index) => {
    const { answers } = get();
    if (index < 0 || index >= answers.length) return;
    if (answers[index].visited) return;
    const next = answers.map((a, i) => (i === index ? { ...a, visited: true } : a));
    set({ answers: next });
  },

  selectOption: (index, optionIndex) => {
    const { answers } = get();
    const a = answers[index];
    if (!a || a.locked) return;
    const next = answers.map((ans, i) =>
      i === index
        ? { ...ans, selected: optionIndex, locked: true, visited: true }
        : ans
    );
    set({ answers: next });
  },

  goNext: () => {
    const { currentIndex, questions, answers } = get();
    const nextIdx = Math.min(currentIndex + 1, questions.length - 1);
    if (nextIdx === currentIndex) return;
    const newAnswers = answers.map((a, i) =>
      i === nextIdx && !a.visited ? { ...a, visited: true } : a
    );
    set({ currentIndex: nextIdx, answers: newAnswers });
  },

  goPrev: () => {
    const { currentIndex } = get();
    set({ currentIndex: Math.max(0, currentIndex - 1) });
  },

  jumpTo: (index) => {
    const { questions, answers } = get();
    if (index < 0 || index >= questions.length) return;
    const newAnswers = answers.map((a, i) =>
      i === index && !a.visited ? { ...a, visited: true } : a
    );
    set({ currentIndex: index, answers: newAnswers });
  },

  submit: () => {
    const { questions, answers } = get();
    const result = calculateResult(questions, answers);
    activeTestStorage.clear();
    set({ isActive: false, isSubmitted: true, lastResult: result });
    return result;
  },

  resetActive: () => {
    activeTestStorage.clear();
    set({ isActive: false });
  },

  buildReattemptPool: (includeSkipped) => {
    const { questions, answers } = get();
    return questions.filter((q, i) => {
      const a = answers[i];
      if (!a || a.selected === null) {
        return includeSkipped; // skipped
      }
      return a.selected !== q.correct; // wrong
    });
  },
}));

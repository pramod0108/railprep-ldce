export interface Bilingual {
  en: string;
  hi: string;
}

export interface Section {
  id: string;
  name: Bilingual;
  icon: string;
}

export interface TestIndexEntry {
  id: string;
  file: string;
  paperName: string;
}

export interface RawQuestion {
  id: number;
  question: Bilingual;
  options: Bilingual[];
  correct: number;
}

export interface RawTest {
  paperName: string;
  questions: RawQuestion[];
}

/** Question after shuffling — `correct` index is recalculated to match shuffled options. */
export interface ShuffledQuestion {
  /** Original numeric id from source JSON (used to track wrong/skipped pool across re-attempts). */
  originalId: number;
  question: Bilingual;
  options: Bilingual[];
  correct: number;
}

export type AnswerStatus = "unvisited" | "visited" | "correct" | "wrong";

export interface AnswerState {
  /** Index of the option the user selected, or null if skipped/not yet attempted. */
  selected: number | null;
  /** Whether the question has been visited at least once. */
  visited: boolean;
  /** Whether selection is locked (always true once selected, in v1). */
  locked: boolean;
}

export interface ResultBreakdown {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  rawScore: number;
  percentage: number;
}

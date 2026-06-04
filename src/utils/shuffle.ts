import type { RawQuestion, ShuffledQuestion } from "@/types";

/**
 * Fisher-Yates in-place shuffle. Returns the same array reference for chaining.
 */
export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a shuffled copy without mutating the input.
 */
export function shuffled<T>(arr: readonly T[]): T[] {
  return shuffleInPlace([...arr]);
}

/**
 * Shuffle an entire question pool: questions order randomized, options within
 * each question randomized. The bilingual {en, hi} option object stays paired
 * automatically because we shuffle whole objects. The `correct` index is
 * recomputed to match the new option position.
 */
export function shuffleTestPool(questions: RawQuestion[]): ShuffledQuestion[] {
  const shuffledQuestions = shuffled(questions);
  return shuffledQuestions.map((q) => {
    // Track original correct option object so we can find its new index.
    const correctOption = q.options[q.correct];
    const newOptions = shuffled(q.options);
    const newCorrect = newOptions.indexOf(correctOption);
    return {
      originalId: q.id,
      question: q.question,
      options: newOptions,
      correct: newCorrect,
    };
  });
}

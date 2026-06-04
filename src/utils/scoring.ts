import type { AnswerState, ResultBreakdown, ShuffledQuestion } from "@/types";

/**
 * +1 for each correct answer
 * -1/3 for each wrong answer
 *  0 for skipped
 */
export function calculateResult(
  questions: ShuffledQuestion[],
  answers: AnswerState[]
): ResultBreakdown {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (!ans || ans.selected === null) {
      skipped += 1;
    } else if (ans.selected === q.correct) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  const rawScore = correct - wrong / 3;
  const total = questions.length;
  const percentage = total === 0 ? 0 : (rawScore / total) * 100;

  return {
    total,
    correct,
    wrong,
    skipped,
    rawScore,
    percentage,
  };
}

export function formatScore(value: number): string {
  // Round to 2 decimals, trim trailing zeros for cleaner display when whole.
  const rounded = Math.round(value * 100) / 100;
  return rounded.toFixed(2);
}

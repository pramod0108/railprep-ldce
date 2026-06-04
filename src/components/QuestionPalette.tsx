import { cn } from "@/utils/cn";
import type { AnswerState, ShuffledQuestion } from "@/types";

interface Props {
  questions: ShuffledQuestion[];
  answers: AnswerState[];
  current: number;
  onJump: (index: number) => void;
}

function statusFor(
  q: ShuffledQuestion,
  a: AnswerState | undefined,
  isCurrent: boolean
): { label: string; className: string } {
  if (isCurrent) {
    return {
      label: "Current",
      className: "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300",
    };
  }
  if (!a || !a.visited) {
    return {
      label: "Not visited",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };
  }
  if (a.selected === null) {
    return {
      label: "Skipped",
      className: "bg-amber-100 text-amber-800 border-amber-300",
    };
  }
  if (a.selected === q.correct) {
    return {
      label: "Correct",
      className: "bg-emerald-500 text-white border-emerald-600",
    };
  }
  return {
    label: "Wrong",
    className: "bg-red-500 text-white border-red-600",
  };
}

export default function QuestionPalette({
  questions,
  answers,
  current,
  onJump,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Question Palette</h3>
        <span className="text-xs text-muted-foreground">
          {questions.length} total
        </span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const s = statusFor(q, answers[i], i === current);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              title={`Q${i + 1} • ${s.label}`}
              className={cn(
                "h-9 w-full rounded-md border text-xs font-semibold transition-colors",
                s.className
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <Legend />
    </div>
  );
}

function Legend() {
  const items: Array<{ color: string; label: string }> = [
    { color: "bg-emerald-500", label: "Correct" },
    { color: "bg-red-500", label: "Wrong" },
    { color: "bg-amber-300", label: "Skipped" },
    { color: "bg-blue-500", label: "Current" },
    { color: "bg-gray-200 border", label: "Not visited" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2">
          <span className={cn("inline-block h-3 w-3 rounded-sm", it.color)} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

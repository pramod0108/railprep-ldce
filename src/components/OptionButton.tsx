import { cn } from "@/utils/cn";
import type { Bilingual } from "@/types";
import BilingualText from "./BilingualText";
import { Check, X } from "lucide-react";

interface Props {
  index: number;
  option: Bilingual;
  selected: boolean;
  correct: boolean; // is this the correct option?
  locked: boolean;
  showFeedback: boolean; // true once any selection has been made
  userIsWrong: boolean; // user picked a wrong option overall
  onSelect: () => void;
}

const labels = ["A", "B", "C", "D", "E", "F"];

export default function OptionButton({
  index,
  option,
  selected,
  correct,
  locked,
  showFeedback,
  userIsWrong,
  onSelect,
}: Props) {
  // Decide visual state
  let stateClass =
    "border-border bg-card hover:bg-accent hover:border-primary/40";
  let iconEl: React.ReactNode = null;

  if (showFeedback) {
    if (correct) {
      stateClass =
        "border-emerald-500/70 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/40";
      iconEl = <Check className="h-5 w-5 text-emerald-600 shrink-0" />;
    } else if (selected && userIsWrong) {
      stateClass =
        "border-red-500/70 bg-red-50 text-red-900 ring-1 ring-red-500/40";
      iconEl = <X className="h-5 w-5 text-red-600 shrink-0" />;
    } else {
      stateClass = "border-border bg-card text-foreground/70";
    }
  } else if (selected) {
    stateClass = "border-primary bg-primary/5 ring-1 ring-primary/30";
  }

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={cn(
        "group w-full text-left rounded-xl border p-3 sm:p-4 transition-all tap-44 flex items-start gap-3",
        "disabled:cursor-not-allowed",
        stateClass
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
          showFeedback && correct
            ? "border-emerald-500 bg-emerald-500 text-white"
            : showFeedback && selected && userIsWrong
            ? "border-red-500 bg-red-500 text-white"
            : selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-muted-foreground"
        )}
        aria-hidden
      >
        {labels[index]}
      </span>
      <BilingualText
        value={option}
        className="flex-1 text-sm sm:text-base"
      />
      {iconEl}
    </button>
  );
}

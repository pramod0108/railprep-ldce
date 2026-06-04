import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import BilingualText from "@/components/BilingualText";
import { useTestStore } from "@/store/testStore";
import { cn } from "@/utils/cn";

type Filter = "all" | "correct" | "wrong" | "skipped";
const labels = ["A", "B", "C", "D", "E", "F"];

export default function ReviewPage() {
  const navigate = useNavigate();
  const { questions, answers, paperName, isSubmitted } = useTestStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [pos, setPos] = useState(0); // index into the filtered list

  const items = useMemo(
    () =>
      questions.map((q, i) => {
        const a = answers[i];
        const status: "correct" | "wrong" | "skipped" =
          !a || a.selected === null
            ? "skipped"
            : a.selected === q.correct
            ? "correct"
            : "wrong";
        return { q, a, status, originalIndex: i };
      }),
    [questions, answers]
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      correct: items.filter((it) => it.status === "correct").length,
      wrong: items.filter((it) => it.status === "wrong").length,
      skipped: items.filter((it) => it.status === "skipped").length,
    }),
    [items]
  );

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.status === filter)),
    [filter, items]
  );

  // Reset position whenever the filter changes (or the filtered set shrinks).
  useEffect(() => {
    setPos(0);
  }, [filter]);

  if (!isSubmitted || questions.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No attempt to review.</p>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const total = filtered.length;
  const current = filtered[pos];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid lg:grid-cols-[1fr_280px] gap-6"
    >
      <div className="space-y-4 min-w-0">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Review</h1>
          <p className="text-sm text-muted-foreground">{paperName}</p>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="correct" disabled={counts.correct === 0}>
              Correct ({counts.correct})
            </TabsTrigger>
            <TabsTrigger value="wrong" disabled={counts.wrong === 0}>
              Wrong ({counts.wrong})
            </TabsTrigger>
            <TabsTrigger value="skipped" disabled={counts.skipped === 0}>
              Skipped ({counts.skipped})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {total === 0 || !current ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nothing here.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                Showing <strong>{pos + 1}</strong> of {total}
                <span className="text-xs ml-2 text-muted-foreground/80">
                  (Q{current.originalIndex + 1} in original order)
                </span>
              </span>
              <StatusBadge status={current.status} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${pos}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <Card>
                  <CardContent className="p-5 sm:p-6 space-y-5">
                    <BilingualText
                      value={current.q.question}
                      hiClassName="text-base sm:text-lg font-medium"
                      enClassName="text-sm sm:text-base text-foreground/80"
                    />
                    <ul className="space-y-2">
                      {current.q.options.map((opt, i) => {
                        const isCorrect = i === current.q.correct;
                        const isUserPicked = current.a?.selected === i;
                        const isUserWrong =
                          isUserPicked && current.status === "wrong";
                        return (
                          <li
                            key={i}
                            className={cn(
                              "rounded-lg border p-3 flex items-start gap-3",
                              isCorrect &&
                                "border-emerald-500/60 bg-emerald-50",
                              isUserWrong &&
                                "border-red-500/60 bg-red-50",
                              !isCorrect && !isUserWrong && "bg-card"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : isUserWrong
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "border-border bg-background text-muted-foreground"
                              )}
                            >
                              {labels[i]}
                            </span>
                            <BilingualText
                              value={opt}
                              className="flex-1 text-sm"
                            />
                            {isCorrect && (
                              <span className="text-xs font-semibold text-emerald-700 shrink-0">
                                Correct
                              </span>
                            )}
                            {isUserWrong && (
                              <span className="text-xs font-semibold text-red-700 shrink-0">
                                Your pick
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between gap-2 sticky bottom-0 bg-background/90 backdrop-blur py-3 -mx-2 px-2">
              <Button
                variant="outline"
                onClick={() => setPos((p) => Math.max(0, p - 1))}
                disabled={pos === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                {pos + 1} / {total}
              </span>
              <Button
                variant="outline"
                onClick={() => setPos((p) => Math.min(total - 1, p + 1))}
                disabled={pos >= total - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Sidebar palette — jump to any question in the filtered set */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Question Palette</h3>
              <span className="text-xs text-muted-foreground">
                {total} shown
              </span>
            </div>
            {total === 0 ? (
              <p className="text-xs text-muted-foreground">No matching questions.</p>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-5 gap-2">
                {filtered.map((it, i) => {
                  const isCurrent = i === pos;
                  const cls =
                    it.status === "correct"
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : it.status === "wrong"
                      ? "bg-red-500 text-white border-red-600"
                      : "bg-amber-100 text-amber-800 border-amber-300";
                  return (
                    <button
                      key={`${it.originalIndex}-${i}`}
                      type="button"
                      onClick={() => setPos(i)}
                      title={`Q${it.originalIndex + 1} • ${it.status}`}
                      className={cn(
                        "h-9 w-full rounded-md border text-xs font-semibold transition-colors",
                        cls,
                        isCurrent && "ring-2 ring-blue-400 ring-offset-1"
                      )}
                    >
                      {it.originalIndex + 1}
                    </button>
                  );
                })}
              </div>
            )}
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground pt-1">
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
                Correct
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
                Wrong
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-300" />
                Skipped
              </li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </motion.div>
  );
}

function StatusBadge({
  status,
}: {
  status: "correct" | "wrong" | "skipped";
}) {
  if (status === "correct") return <Badge variant="success">Correct</Badge>;
  if (status === "wrong") return <Badge variant="destructive">Wrong</Badge>;
  return <Badge variant="warning">Skipped</Badge>;
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BilingualText from "@/components/BilingualText";
import OptionButton from "@/components/OptionButton";
import QuestionPalette from "@/components/QuestionPalette";
import ConfirmModal from "@/components/ConfirmModal";
import { useTestStore } from "@/store/testStore";
import { loadTest, getSectionById, getTestsForSection } from "@/utils/dataLoader";
import { useExitWarning } from "@/hooks/useExitWarning";

export default function TestPage() {
  const { sectionId, testId } = useParams<{
    sectionId: string;
    testId: string;
  }>();
  const navigate = useNavigate();

  const {
    questions,
    answers,
    currentIndex,
    paperName,
    sectionId: storeSectionId,
    testId: storeTestId,
    isActive,
    startFromRaw,
    selectOption,
    goNext,
    goPrev,
    jumpTo,
    submit,
  } = useTestStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Match exit-warning lifecycle to the active test. We pass a getter so the
  // handlers always read the latest store value (avoids stale-closure firing
  // when we submit and navigate in the same tick).
  useExitWarning(() => useTestStore.getState().isActive);

  // Load + initialize the test if needed.
  useEffect(() => {
    if (!sectionId || !testId) return;
    const sameAsStore =
      storeSectionId === sectionId && storeTestId === testId && isActive;
    if (sameAsStore && questions.length > 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      // Look up file name from index.
      const section = getSectionById(sectionId);
      if (!section) {
        setError("Section not found");
        setLoading(false);
        return;
      }
      const idx = getTestsForSection(sectionId);
      const entry = idx.find((t) => t.id === testId);
      if (!entry) {
        setError("Test not found");
        setLoading(false);
        return;
      }
      const raw = await loadTest(sectionId, entry.file);
      if (cancelled) return;
      if (!raw) {
        setError("Test data missing");
        setLoading(false);
        return;
      }
      startFromRaw({ sectionId, testId, raw });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, testId]);

  const total = questions.length;
  const current = questions[currentIndex];
  const currentAns = answers[currentIndex];

  const attemptedCount = useMemo(
    () => answers.filter((a) => a.selected !== null).length,
    [answers]
  );
  const visitedCount = useMemo(
    () => answers.filter((a) => a.visited).length,
    [answers]
  );
  const unattempted = total - attemptedCount;
  const progressPct = total === 0 ? 0 : (attemptedCount / total) * 100;
  const allVisited = visitedCount === total && total > 0;

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Loading test…</div>;
  }
  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-destructive">{error}</p>
        <Button asChild className="mt-4">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    );
  }
  if (!current || !currentAns) {
    return null;
  }

  const showFeedback = currentAns.selected !== null;
  const userIsWrong =
    currentAns.selected !== null && currentAns.selected !== current.correct;

  const onSubmit = () => {
    submit();
    navigate("/result");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="grid lg:grid-cols-[1fr_280px] gap-6"
    >
      {/* Main column */}
      <div className="space-y-4">
        {/* Top header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-semibold leading-tight">
                {paperName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Question {currentIndex + 1} of {total}
              </p>
            </div>
            <Badge variant="info">
              {attemptedCount} / {total} attempted
            </Badge>
          </div>
          <Progress value={progressPct} aria-label="Test progress" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            <Card>
              <CardContent className="p-5 sm:p-6 space-y-5">
                <BilingualText
                  value={current.question}
                  hiClassName="text-base sm:text-lg font-medium"
                  enClassName="text-sm sm:text-base text-foreground/80"
                />
                <div className="grid grid-cols-1 gap-3">
                  {current.options.map((opt, i) => (
                    <OptionButton
                      key={i}
                      index={i}
                      option={opt}
                      selected={currentAns.selected === i}
                      correct={i === current.correct}
                      locked={currentAns.locked}
                      showFeedback={showFeedback}
                      userIsWrong={userIsWrong}
                      onSelect={() => selectOption(currentIndex, i)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 sticky bottom-0 bg-background/90 backdrop-blur py-3 -mx-2 px-2">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant={allVisited ? "success" : "default"}
            onClick={() => setConfirmOpen(true)}
            className="px-6"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
          <Button
            onClick={goNext}
            disabled={currentIndex === total - 1}
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar / palette */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="p-4">
            <QuestionPalette
              questions={questions}
              answers={answers}
              current={currentIndex}
              onJump={jumpTo}
            />
          </CardContent>
        </Card>
      </aside>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit test?"
        description={
          unattempted > 0
            ? `Are you sure? You have ${unattempted} unattempted question${
                unattempted === 1 ? "" : "s"
              }.`
            : "Are you sure you want to submit?"
        }
        confirmLabel="Submit"
        onConfirm={onSubmit}
      />
    </motion.div>
  );
}

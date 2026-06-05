import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  SkipForward,
  Home,
  RotateCcw,
  ListChecks,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTestStore } from "@/store/testStore";
import { formatScore } from "@/utils/scoring";

export default function ResultPage() {
  const navigate = useNavigate();
  const {
    lastResult,
    sectionId,
    testId,
    paperName,
    questions,
    answers,
    buildReattemptPool,
    startFromQuestions,
  } = useTestStore();

  const [reattemptOpen, setReattemptOpen] = useState(false);

  if (!lastResult) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No result to show.</p>
        <Button asChild className="mt-4">
          <Link to="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    );
  }

  const { total, correct, wrong, skipped, rawScore, percentage } = lastResult;
  const reattemptPool = buildReattemptPool(true);
  const noWrongOrSkipped = reattemptPool.length === 0;

  const handleReattempt = (includeSkipped: boolean) => {
    if (!sectionId || !testId) return;
    const pool = buildReattemptPool(includeSkipped);
    if (pool.length === 0) return;
    startFromQuestions({
      sectionId,
      testId,
      paperName: `${paperName} • Re-attempt`,
      questions: pool,
    });
    setReattemptOpen(false);
    navigate(`/test/${sectionId}/${testId}`);
  };

  // If there's no real choice to make (only wrong OR only skipped remain),
  // skip the modal and start the re-attempt directly. The modal exists only
  // for the genuine fork: both wrong and skipped are non-zero.
  const onReattemptClick = () => {
    if (wrong === 0 && skipped === 0) return; // button is already disabled
    if (wrong > 0 && skipped > 0) {
      setReattemptOpen(true);
      return;
    }
    // exactly one of them is > 0 — no fork needed
    handleReattempt(skipped > 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto space-y-5"
    >
      <div className="text-center space-y-1">
        <Badge variant="info" className="mb-2">
          Result
        </Badge>
        <h1 className="text-xl sm:text-2xl font-bold">{paperName}</h1>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Final Score</p>
          <div className="text-4xl sm:text-5xl font-bold tracking-tight">
            {formatScore(rawScore)}{" "}
            <span className="text-2xl text-muted-foreground">/ {total}</span>
          </div>
          <p className="text-lg font-medium text-primary">
            {formatScore(percentage)}%
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          label="Correct"
          value={correct}
          tone="bg-emerald-50 border-emerald-200"
        />
        <StatTile
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          label="Wrong"
          value={wrong}
          tone="bg-red-50 border-red-200"
        />
        <StatTile
          icon={<SkipForward className="h-5 w-5 text-amber-600" />}
          label="Skipped"
          value={skipped}
          tone="bg-amber-50 border-amber-200"
        />
      </div>

      <Card>
        <CardContent className="p-4 text-xs sm:text-sm text-muted-foreground">
          <strong className="text-foreground">Scoring:</strong> +1 for each
          correct, −1/3 for each wrong, 0 for skipped.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="default"
          disabled={noWrongOrSkipped}
          onClick={onReattemptClick}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4" />
          Re-attempt
          {!noWrongOrSkipped && (
            <span className="ml-1 text-xs opacity-90">
              ({wrong + skipped})
            </span>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/review")}
          disabled={questions.length === 0 || answers.length === 0}
          className="w-full"
        >
          <ListChecks className="h-4 w-4" />
          Review
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link to={sectionId ? `/section/${sectionId}` : "/"}>
            <Home className="h-4 w-4" />
            Back to Section
          </Link>
        </Button>
      </div>

      {noWrongOrSkipped && (
        <p className="text-center text-xs text-muted-foreground">
          🎉 No wrong or skipped questions remain. You're done with this test!
        </p>
      )}

      {/* Re-attempt fork dialog — only shown when BOTH wrong and skipped > 0 */}
      <Dialog open={reattemptOpen} onOpenChange={setReattemptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Include skipped questions too?</DialogTitle>
            <DialogDescription>
              You have <strong>{wrong}</strong> wrong and{" "}
              <strong>{skipped}</strong> skipped question
              {skipped === 1 ? "" : "s"}. Pick what to re-attempt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReattemptOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReattempt(false)}
            >
              No, only wrong ({wrong})
            </Button>
            <Button onClick={() => handleReattempt(true)}>
              Yes, include skipped ({wrong + skipped})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 flex flex-col items-center gap-1 ${tone}`}
    >
      {icon}
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

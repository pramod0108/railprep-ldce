import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, FileText } from "lucide-react";
import { getSectionById, getTestsForSection } from "@/utils/dataLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BilingualText from "@/components/BilingualText";
import { useEffect, useState } from "react";
import type { RawTest } from "@/types";
import { loadTest } from "@/utils/dataLoader";

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? getSectionById(sectionId) : undefined;
  const tests = sectionId ? getTestsForSection(sectionId) : [];

  // We pre-load just the count for each test (one fetch per test). Since these
  // are static JSON in the bundle, this is cheap.
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!sectionId) return;
    let cancelled = false;
    (async () => {
      const entries: Array<[string, number]> = [];
      for (const t of tests) {
        const data: RawTest | null = await loadTest(sectionId, t.file);
        if (data) entries.push([t.id, data.questions.length]);
      }
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  if (!section) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Section not found.</p>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              All Sections
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl" aria-hidden>
              {section.icon}
            </span>
            <BilingualText
              value={section.name}
              hiClassName="text-xl sm:text-2xl font-bold"
              enClassName="text-sm text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No tests available yet for this section.
            <br />
            <span className="text-xs">
              Add a JSON file to <code>/data/{section.id}/</code> and an entry
              to <code>index.json</code>.
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tests.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/test/${section.id}/${t.id}`}
                className="block group"
              >
                <Card className="h-full transition-all group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:border-primary/40">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold leading-tight">
                        {t.paperName}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {counts[t.id] !== undefined
                          ? `${counts[t.id]} questions`
                          : "Loading…"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

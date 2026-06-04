import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getSections } from "@/utils/dataLoader";
import { Card, CardContent } from "@/components/ui/card";
import BilingualText from "@/components/BilingualText";

export default function HomePage() {
  const sections = getSections();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Choose a Section
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          अपना विषय चुनें • Pick a subject to start practicing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link to={`/section/${s.id}`} className="block group">
              <Card className="transition-all group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:border-primary/40 h-full">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="text-3xl sm:text-4xl shrink-0" aria-hidden>
                    {s.icon}
                  </div>
                  <BilingualText
                    value={s.name}
                    className="flex-1"
                    hiClassName="text-base font-semibold"
                    enClassName="text-sm text-muted-foreground"
                  />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { Link } from "react-router-dom";
import type { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img
              src="/logo.ico"
              alt=""
              aria-hidden
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-base">RailPrep LDCE</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Bilingual practice • हिंदी + English
          </span>
        </div>
      </header>
      <main className="container flex-1 py-6 sm:py-8">{children}</main>
      <footer className="border-t py-4 safe-bottom">
        <div className="container text-center text-xs text-muted-foreground">
          RailPrep LDCE • Practice for Railway Limited Departmental
          Competitive Exams
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

/**
 * Warn the user before leaving an active test.
 *
 * `getActive` is a getter (not a static boolean) so the handlers always see
 * the latest value. This matters because when the user clicks Submit we mark
 * the test inactive and then immediately navigate to /result in the same
 * event tick — before React re-renders. A static boolean would still read
 * `true` at that moment and the blocker would fire spuriously.
 */
export function useExitWarning(getActive: () => boolean) {
  const getActiveRef = useRef(getActive);
  getActiveRef.current = getActive;

  // Browser-level: tab close / refresh / hard back.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!getActiveRef.current()) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // In-app route changes.
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!getActiveRef.current()) return false;
    return currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const ok = window.confirm(
        "Your test progress will be lost. Are you sure you want to leave?"
      );
      if (ok) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
}

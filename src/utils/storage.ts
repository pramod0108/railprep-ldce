const ACTIVE_TEST_KEY = "railprep:active-test";

/** Mark/unmark a test session as active, used by the exit-warning hook. */
export const activeTestStorage = {
  set(meta: { sectionId: string; testId: string }) {
    try {
      localStorage.setItem(ACTIVE_TEST_KEY, JSON.stringify(meta));
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(ACTIVE_TEST_KEY);
    } catch {
      /* ignore */
    }
  },
  get() {
    try {
      const raw = localStorage.getItem(ACTIVE_TEST_KEY);
      return raw ? (JSON.parse(raw) as { sectionId: string; testId: string }) : null;
    } catch {
      return null;
    }
  },
};

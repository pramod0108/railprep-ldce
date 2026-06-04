import type { RawTest, Section, TestIndexEntry } from "@/types";
import sectionsData from "@/data/sections.json";

// Eagerly resolve all section index files at build time.
const sectionIndexFiles = import.meta.glob<{ default: TestIndexEntry[] }>(
  "../data/*/index.json",
  { eager: true }
);

// Lazy-load individual test JSON files so each test is its own chunk.
// We exclude `index.json` because those are the section listings, eagerly
// imported above.
const testFiles = import.meta.glob<{ default: RawTest }>(
  ["../data/*/*.json", "!../data/*/index.json"]
);

export function getSections(): Section[] {
  return sectionsData as Section[];
}

export function getSectionById(sectionId: string): Section | undefined {
  return getSections().find((s) => s.id === sectionId);
}

export function getTestsForSection(sectionId: string): TestIndexEntry[] {
  const key = `../data/${sectionId}/index.json`;
  const mod = sectionIndexFiles[key];
  if (!mod) return [];
  return mod.default;
}

export async function loadTest(
  sectionId: string,
  fileName: string
): Promise<RawTest | null> {
  const key = `../data/${sectionId}/${fileName}`;
  const loader = testFiles[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

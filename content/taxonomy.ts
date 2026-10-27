/**
 * Categories used for filtering. The `id` is what you type inside your
 * project / note / video files. The `label` is what visitors see.
 */

export const projectCategories = [
  { id: "microeconomics", label: "Microeconomics" },
  { id: "econometrics", label: "Econometrics & applied economics" },
  { id: "quant-finance", label: "Quantitative finance" },
  { id: "python-data", label: "Python & data science" },
  { id: "math-optimization", label: "Mathematics & optimization" },
  { id: "macro-development", label: "Macroeconomics & development" },
] as const;

export const projectStatuses = [
  { id: "concept", label: "Concept" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
] as const;

export const noteSubjects = [
  { id: "microeconomics", label: "Microeconomics" },
  { id: "econometrics", label: "Econometrics" },
  { id: "lpor", label: "Linear Programming & Operations Research" },
  { id: "math-economics", label: "Mathematics for Economics" },
  { id: "statistics", label: "Statistics & Probability" },
  { id: "macroeconomics", label: "Macroeconomics" },
  { id: "development", label: "Development Economics" },
  { id: "quant-finance", label: "Quantitative Finance" },
  { id: "python", label: "Python for Economics & Research" },
] as const;

export const noteTypes = [
  { id: "notes", label: "Notes" },
  { id: "formula-sheet", label: "Formula sheet" },
  { id: "solved-numericals", label: "Solved numericals" },
  { id: "revision-sheet", label: "Revision sheet" },
  { id: "reading-guide", label: "Reading guide" },
] as const;

export const videoCategories = [
  { id: "microeconomics", label: "Microeconomics" },
  { id: "econometrics", label: "Econometrics" },
  { id: "mathematics", label: "Mathematics" },
  { id: "quant-research", label: "Quant research" },
  { id: "python", label: "Python" },
  { id: "finance", label: "Finance" },
  { id: "cpp", label: "C++" },
] as const;

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];
export type ProjectStatusId = (typeof projectStatuses)[number]["id"];
export type NoteSubjectId = (typeof noteSubjects)[number]["id"];
export type NoteTypeId = (typeof noteTypes)[number]["id"];
export type VideoCategoryId = (typeof videoCategories)[number]["id"];

export const labelFor = (
  list: readonly { id: string; label: string }[],
  id: string,
): string => list.find((x) => x.id === id)?.label ?? id;

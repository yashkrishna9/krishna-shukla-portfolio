/**
 * ABOUT-PAGE CONTENT — edit this file to update the About and Research pages.
 * Entries marked PLACEHOLDER are not real yet. Replace them, or delete the line.
 * Interests and skills are shown as learning areas, not as proof of expertise.
 */

export type JourneyStatus = "planned" | "in-progress" | "completed";

export type TimelineItem = {
  title: string;
  detail: string;
  when: string; // free text, e.g. "2026 – 2028" or "PLACEHOLDER: add date"
  status: JourneyStatus;
};

export const education: TimelineItem[] = [
  {
    title: "MSc Economics, IIT Roorkee",
    detail: "Current programme.",
    when: "PLACEHOLDER: add start and expected end year",
    status: "in-progress",
  },
  {
    title: "BSc, majors in Mathematics and Physics, minor in Statistics",
    detail: "Previous degree. PLACEHOLDER: add institution.",
    when: "PLACEHOLDER: add years",
    status: "completed",
  },
];

/** Add the real course names here. The About page hides the placeholder once this list has entries. */
export const coursework: string[] = [];

export const academicInterests = [
  "Microeconomic theory and consumer choice",
  "Econometrics and causal inference",
  "Development economics",
  "Mathematical economics and optimisation",
  "Statistics and probability",
];

/** The research journey. Change `status` as things move from Planned to In Progress to Completed. */
export const journey: TimelineItem[] = [
  {
    title: "Study for the MSc Economics degree",
    detail: "Core coursework in microeconomics, econometrics, mathematics and statistics.",
    when: "PLACEHOLDER: add dates",
    status: "in-progress",
  },
  {
    title: "Build this personal research website",
    detail: "Projects, notes, videos and interactive models in one place.",
    when: "October 2026",
    status: "in-progress",
  },
  {
    title: "Replicate a published applied-econometrics table",
    detail: "Choose a paper with public data and reproduce one table in Python.",
    when: "PLACEHOLDER: add target date",
    status: "planned",
  },
  {
    title: "Backtest a simple strategy on a toy series",
    detail: "Practise a clean backtesting workflow and honest statistical evaluation.",
    when: "PLACEHOLDER: add target date",
    status: "planned",
  },
  {
    title: "Publish the first educational video",
    detail: "A short explainer on a topic from the notes library.",
    when: "PLACEHOLDER: add target date",
    status: "planned",
  },
  {
    title: "Write a first short research report",
    detail: "A few pages with a question, data, method, results and limitations.",
    when: "PLACEHOLDER: add target date",
    status: "planned",
  },
];

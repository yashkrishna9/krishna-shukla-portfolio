import type { VideoCategoryId } from "./taxonomy";

/**
 * VIDEO LIBRARY — add one block per video.
 *
 * To add a real video, copy a block and fill in:
 *   id          a short unique name with dashes (no spaces)
 *   title       the video title
 *   url         the normal YouTube link, e.g. "https://www.youtube.com/watch?v=XXXXXXXXXXX"
 *   category    one of: microeconomics, econometrics, mathematics, quant-research, python, finance
 *   playlist    a playlist name (videos with the same name are grouped together)
 *   description one or two sentences
 *   relatedNotes / relatedProjects   slugs (the file names without .md) of notes / projects
 *   featured    true to show it in the "Featured video" area
 *
 * While `url` is empty ("") the card is shown as a clearly labelled PLACEHOLDER.
 */
export type VideoEntry = {
  id: string;
  title: string;
  url: string;
  category: VideoCategoryId;
  playlist: string;
  description: string;
  relatedNotes?: string[];
  relatedProjects?: string[];
  featured?: boolean;
};

export const videos: VideoEntry[] = [
  {
  id: "cpp-01-hello-world",
  title: "C++ Lecture 1: Hello World",
  url: "https://youtu.be/KJmYMLRnj9Q?si=FsStS3BW32Be628a",
  category: "cpp",
  playlist: "C++ Course",
  description: "Lecture 1 of my C++ series.",
},
{
  id: "cpp-02-variables",
  title: "C++ Lecture 2: Variables",
  url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
  category: "cpp",
  playlist: "C++ Course",
  description: "Lecture 2 of my C++ series.",
},
  {
    id: "placeholder-consumer-choice",
    title: "Placeholder: Consumer choice and the budget line",
    url: "",
    category: "microeconomics",
    playlist: "Microeconomics foundations",
    description: "Sample entry. Replace the title and add a real YouTube URL when the video exists.",
    relatedNotes: ["consumer-theory-utility-maximisation"],
    relatedProjects: ["consumer-choice-simulator"],
    featured: true,
  },
  {
    id: "placeholder-ols-intuition",
    title: "Placeholder: Intuition behind ordinary least squares",
    url: "",
    category: "econometrics",
    playlist: "Econometrics foundations",
    description: "Sample entry. Replace with a real video about regression.",
    relatedNotes: ["ols-estimator-derivation"],
    relatedProjects: ["rural-credit-household-outcomes"],
  },
  {
    id: "placeholder-python-first-plot",
    title: "Placeholder: Python for economists, your first plot",
    url: "",
    category: "python",
    playlist: "Python for research",
    description: "Sample entry. Replace with a real tutorial.",
    relatedProjects: ["economic-data-visualization"],
  },
];

/** Public channel link comes from content/site.ts (links.youtube). */

/**
 * SITE SETTINGS — edit this one file to personalise the whole website.
 * Anything marked PLACEHOLDER is not real yet. Replace it when you are ready.
 * Leave a link as "" (empty) and the website will hide it automatically.
 */
export const site = {
  // PLACEHOLDER: replace with your full name
  name: "Krishna Shukla",
  title: "The Quantitative Economist",
  tagline: "Exploring Economics, Mathematics, Data & Markets.",
  description:
    "An evolving portfolio of economic research, quantitative experiments, mathematical models, and learning resources.",
  program: "MSc Economics, IIT Roorkee",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  links: {
    github: "", // e.g. "https://github.com/yashkrishna9"
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-id"
    youtube: "https://www.youtube.com/@QuantEconomist", // e.g. "https://www.youtube.com/@your-channel"
    email: "", // e.g. "archimedessolve@gmail.com"
    cv: "", // Put your CV at public/cv/cv.pdf, then set this to "/cv/cv.pdf"
  },

  /** Slugs of the projects shown in the 3D carousel and "Featured" areas, in order. */
  featuredProjects: [
    "rural-credit-household-outcomes",
    "quantitative-strategy-research",
    "consumer-choice-simulator",
    "monopoly-market-structure-explorer",
    "economic-data-visualization",
  ],

  /** Small indicators on the homepage. These are learning areas, not claims of expertise. */
  skills: ["Python", "Econometrics", "Mathematics", "Statistical modelling", "Optimisation", "Quantitative finance"],
  interests: [
    "Applied econometrics",
    "Development economics",
    "Quantitative research",
    "Mathematical economics",
    "Financial markets",
    "Statistical modelling",
  ],

  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/research", label: "Research" },
    { href: "/notes", label: "Notes" },
    { href: "/videos", label: "Videos" },
    { href: "/lab", label: "Economics Lab" },
    { href: "/about", label: "About" },
  ],

  /** Shown in "Recent updates". Newest first. Add a line whenever you add something. */
  updates: [
    { date: "2026-10-25", text: "Website created. Projects shown are concepts, not completed work." },
  ],
};

export type Site = typeof site;

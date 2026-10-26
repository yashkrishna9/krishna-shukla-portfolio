# The Quantitative Economist — personal research website

A portfolio, notes library, video library and interactive Economics Lab, built with Next.js, TypeScript, Tailwind CSS, React Three Fiber (the 3D hero), Motion (the 3D project carousel), Recharts (charts) and KaTeX (equations).

**Honesty rule built into the site:** every project is labelled *Concept* until you change its status, video entries are labelled *Placeholder* until you add a real YouTube link, dashboard numbers are labelled *illustrative sample data*, and a download button only appears if the file really exists. Nothing on the site claims results, awards or experience you have not added yourself.

---

## 1. First-time setup (one time only)

1. Install **Node.js** (the "LTS" version) from <https://nodejs.org>. Restart your computer's terminal afterwards.
2. Open a terminal in this folder.
   - Windows: open the folder in File Explorer, click the address bar, type `cmd`, press Enter.
   - Mac: right-click the folder → "New Terminal at Folder".
3. Type these commands, pressing Enter after each:

```bash
node -v          # should print a version number such as v22.x
npm install      # downloads the libraries (takes a few minutes)
npm run dev      # starts the website
```

4. Open <http://localhost:3000> in your browser. The site updates automatically when you save a file. Press `Ctrl + C` in the terminal to stop it.

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the real production site. Run this before publishing to catch mistakes. |
| `npm run typecheck` | Checks the TypeScript code for errors. |
| `npm run lint` | Checks code style. |
| `npm test` | Runs the tests that check the economics formulas. |

---

## 2. Folder map

```
content/
  site.ts          ← YOUR NAME, social links, CV path, featured projects, "recent updates"
  profile.ts       ← About page: education, coursework, interests, research journey
  videos.ts        ← the video library (one block per video)
  taxonomy.ts      ← the category lists (subjects, project categories, statuses)
  projects/        ← one .md file per project
  notes/           ← one .md file per note
  data/sample.ts   ← the labelled sample data used by the Data page
public/
  pdfs/            ← put note PDFs here
  reports/         ← put project report PDFs here
  cv/              ← put your CV here (cv.pdf)
src/
  app/             ← the pages (home, projects, notes, videos, lab, data, about)
  components/      ← reusable parts; three/ holds the 3D scene, lab/ the four simulators
  lib/             ← content loader and the economics maths (lib/econ, with tests)
```

You normally only edit files in `content/` and `public/`.

---

## 3. Make it yours

Open `content/site.ts` and change:

- `name` — replace `"Your Name"` with your name.
- `links` — paste your GitHub, LinkedIn, YouTube and email. **A link left as `""` is hidden automatically.**
- `cv` — put your CV at `public/cv/cv.pdf` and set `cv: "/cv/cv.pdf"`. The Download CV button appears only once the file exists.
- `featuredProjects` — the list of project file names (without `.md`) shown in the 3D carousel, in order.
- `updates` — add a line to "Recent updates" whenever you add something.

Open `content/profile.ts` to fill in the About page (institution and years for your degrees, real course names, your research journey). Lines starting with `PLACEHOLDER` are reminders; replace or delete them.

To change the browser-tab title and sharing text, edit `title`, `tagline` and `description` in `content/site.ts`.

---

## 4. Add a project

1. In `content/projects/`, copy `_TEMPLATE-project.md` and rename it, for example `inflation-and-growth.md`. The file name becomes the page address (`/projects/inflation-and-growth`).
2. Edit the block at the top (between the `---` lines):

```yaml
---
title: Inflation and Growth in India
status: in-progress          # concept | in-progress | completed
category: macro-development # see content/taxonomy.ts for the allowed ids
featured: true
hue: 215                     # card colour, 0–360
tags: [inflation, GDP]
summary: One or two sentences.
researchQuestion: The question you are answering.
github: "https://github.com/you/repo"
report: "inflation-report.pdf"   # file placed in public/reports/ (leave "" if none)
tools: [Python, pandas]
relatedNotes: [ols-estimator-derivation]   # note file names without .md
relatedVideos: []                          # video ids from content/videos.ts
---
```

3. Write the sections below using the `##` headings from the template. Equations go between dollar signs: `$y = \beta_0 + \beta_1 x$`.
4. To show it in the carousel, add its file name to `featuredProjects` in `content/site.ts`.

Files whose names start with `_` are ignored by the website.

## 5. Add a note

1. Copy `content/notes/_TEMPLATE-note.md` to a new name such as `lagrange-multipliers.md`.
2. Fill in the top block: `semester`, `subject` (an id from `taxonomy.ts`, such as `microeconomics`, `econometrics`, `lpor`, `math-economics`, `statistics`, `macroeconomics`, `development`, `quant-finance`, `python`), `chapter`, `topic`, `type` (`notes`, `formula-sheet`, `solved-numericals`, `revision-sheet` or `reading-guide`), `tags`.
3. Write the note in Markdown. Inline maths: `$x^2$`. Display maths on its own lines: `$$ \int_0^1 x^2\,dx = \tfrac13 $$`.
4. **Add a PDF:** put the file in `public/pdfs/` (for example `lagrange.pdf`) and write `pdf: "lagrange.pdf"` in the note. If the file is missing, no download button is shown, so there are never broken links.

## 6. Add a video

Open `content/videos.ts` and copy one block. Fill in `id`, `title`, `url` (the normal YouTube link), `category`, `playlist`, `description`, and optionally `relatedNotes`, `relatedProjects` and `featured: true`. While `url` is `""` the card is shown as a clearly labelled placeholder. Delete the three sample placeholders when you add real videos.

## 7. Connect real data to the Data page

The Data page currently shows **synthetic, clearly labelled sample data**. To use real official data later, edit `src/lib/data-source.ts` (it runs on the server). Store any API key in a server-only environment variable such as `DATA_API_KEY` — never start the name with `NEXT_PUBLIC_`, or it would be visible to every visitor. Set `retrievedAt` to the time you fetched the data and `isSample: false`.

---

## 8. Put it on GitHub

1. Create a free account at <https://github.com> and click **New repository**. Name it (for example `my-website`), keep it empty (no README), and create it.
2. In your terminal, in this folder:

```bash
git init
git add .
git commit -m "First version of my website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-website.git
git push -u origin main
```

Later, to save changes: `git add .`, then `git commit -m "Added a note"`, then `git push`.

## 9. Publish on Vercel (free)

1. Sign in at <https://vercel.com> with your GitHub account.
2. Click **Add New → Project**, choose your repository, and click **Deploy**. Leave the default settings.
3. After a minute you get an address like `your-site.vercel.app`.
4. Optional: in the project's **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` with your final address so social-sharing previews use the right link, then redeploy.

**Updating the live site:** notes, projects and videos are read when the site is built, so after you edit a file, run `git push` and Vercel rebuilds and publishes automatically within about a minute. You do not need to touch any code.

### Environment variables

None are required. Optional: `NEXT_PUBLIC_SITE_URL` (your public address). See `.env.example`.

---

## 10. Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm: command not found` | Node.js is not installed, or the terminal was not restarted after installing it. |
| `npm install` fails with permission errors | Run it in a folder you own (for example inside Documents), not in a system folder. |
| "Port 3000 is already in use" | Another copy is running. Close it, or run `npm run dev -- -p 3001`. |
| A new note, project or video does not appear | Check the file ends in `.md`, does not start with `_`, and that the block at the top starts and ends with `---`. Stop and restart `npm run dev`. |
| Build error mentioning a category or subject | The `category`, `subject`, `type` or `status` value must be one of the ids in `content/taxonomy.ts`. |
| PDF button missing | The file must be in `public/pdfs/` (notes) or `public/reports/` (projects) and the name must match exactly, including capitals. |
| Equation shows as red text | A typo in the LaTeX. Check braces `{}` and backslashes. |
| 3D scene is blank | The browser or device has WebGL disabled. A static picture is shown instead and all content still works. |

---

## 11. Accessibility and performance notes

- The 3D hero is loaded on demand and pauses when scrolled off screen. If WebGL is unavailable, a static illustration is used.
- The project carousel works with the Previous/Next buttons, left and right arrow keys, dragging or swiping, and clicking the centre card.
- With "reduce motion" turned on in your system settings, the carousel moves without animation and the 3D scene stops rotating.
- `Ctrl + K` (or `Cmd + K` on Mac) opens search across pages, projects, notes and videos.
- The site is educational. It gives no financial or trading advice, and sample charts are never presented as real data.

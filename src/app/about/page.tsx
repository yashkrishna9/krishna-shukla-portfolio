import type { Metadata } from "next";
import { Download } from "lucide-react";
import { site } from "@content/site";
import { academicInterests, coursework, education, journey } from "@content/profile";
import { cvUrl } from "@/lib/content";
import { Container, PageHeader } from "@/components/ui";
import { SocialLinks } from "@/components/SocialLinks";
import { Timeline } from "@/components/Timeline";

export const metadata: Metadata = {
  title: "About",
  description: "Academic background, interests, technical skills and contact details.",
};

export default function AboutPage() {
  const cv = cvUrl();
  const isPlaceholderName = site.name === "Your Name";

  return (
    <>
      <PageHeader title="About" intro={`${site.name} · ${site.program}`}>
        {isPlaceholderName && (
          <p className="mt-4 max-w-xl rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">
            Placeholder name. Replace <code>name</code> in <code>content/site.ts</code> with your own.
          </p>
        )}
      </PageHeader>

      <Container className="grid gap-16 lg:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-14">
          <section aria-labelledby="a-edu">
            <h2 id="a-edu" className="display text-4xl">
              Education
            </h2>
            <div className="mt-6">
              <Timeline items={education} />
            </div>
          </section>

          <section aria-labelledby="a-int">
            <h2 id="a-int" className="display text-4xl">
              Interests
            </h2>
            <h3 className="mt-5 text-sm text-muted">Academic interests</h3>
            <ul className="mt-2 grid gap-1.5">
              {academicInterests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm text-muted">Research interests</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {site.interests.map((i) => (
                <li key={i} className="rounded-full bg-line px-3 py-1 text-sm text-muted">
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="a-skills">
            <h2 id="a-skills" className="display text-4xl">
              Technical skills
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted">Tools and areas I am working with and learning. This is a list of focus, not a claim of mastery.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.skills.map((s) => (
                <li key={s} className="rounded-full border border-line px-4 py-2 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="a-course">
            <h2 id="a-course" className="display text-4xl">
              Relevant coursework
            </h2>
            {coursework.length ? (
              <ul className="mt-4 grid gap-1.5">
                {coursework.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">
                Placeholder: add your course names to <code>coursework</code> in <code>content/profile.ts</code>.
              </p>
            )}
          </section>
        </div>

        <div className="grid content-start gap-14">
          <section aria-labelledby="a-time">
            <h2 id="a-time" className="display text-4xl">
              Project and research timeline
            </h2>
            <div className="mt-6">
              <Timeline items={journey} />
            </div>
          </section>

          <section aria-labelledby="a-cv">
            <h2 id="a-cv" className="display text-4xl">
              CV and links
            </h2>
            <div className="mt-5 grid gap-4">
              {cv ? (
                <a href={cv} download className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink hover:brightness-110">
                  <Download size={16} aria-hidden /> Download CV (PDF)
                </a>
              ) : (
                <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">
                  CV: not added yet. Put a PDF at <code>public/cv/cv.pdf</code> and set <code>cv</code> to <code>&quot;/cv/cv.pdf&quot;</code> in <code>content/site.ts</code>.
                </p>
              )}
              <SocialLinks showEmptyHint />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

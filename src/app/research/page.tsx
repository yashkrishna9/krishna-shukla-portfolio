import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@content/site";
import { journey } from "@content/profile";
import { labelFor, projectCategories } from "@content/taxonomy";
import { getProjects } from "@/lib/content";
import { Container, PageHeader, StatusBadge } from "@/components/ui";
import { Timeline } from "@/components/Timeline";

export const metadata: Metadata = {
  title: "Research",
  description: "Research interests, open questions and a journey timeline from planned to completed work.",
};

export default function ResearchPage() {
  const questions = getProjects().filter((p) => p.researchQuestion);

  return (
    <>
      <PageHeader
        title="Research"
        intro="What I am curious about, the questions I want to answer, and an honest timeline. No publications or results are claimed here; the status of everything is shown."
      />
      <Container className="grid gap-16 lg:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-16">
          <section aria-labelledby="interests">
            <h2 id="interests" className="display text-4xl">
              Research interests
            </h2>
            <p className="mt-3 max-w-lg text-muted">Areas I am learning about. They describe direction, not expertise.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.interests.map((i) => (
                <li key={i} className="rounded-full border border-line px-4 py-2 text-sm">
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="questions">
            <h2 id="questions" className="display text-4xl">
              Open questions
            </h2>
            <p className="mt-3 max-w-lg text-muted">Each question comes from a project page, along with that project&apos;s current status.</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {questions.map((p) => (
                <li key={p.slug} className="py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={p.status} />
                    <span className="text-sm text-muted">{labelFor(projectCategories, p.category)}</span>
                  </div>
                  <p className="display mt-2 text-2xl leading-snug">{p.researchQuestion}</p>
                  <Link href={`/projects/${p.slug}`} className="mt-2 inline-block text-sm text-cyan underline-offset-4 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="journey">
          <h2 id="journey" className="display text-4xl">
            Research journey
          </h2>
          <p className="mb-8 mt-3 max-w-lg text-muted">
            Edit <code>content/profile.ts</code> to change an item&apos;s status as it moves from planned to completed.
          </p>
          <Timeline items={journey} />
        </section>
      </Container>
    </>
  );
}

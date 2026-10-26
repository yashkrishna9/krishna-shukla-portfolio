import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { site } from "@content/site";
import { labelFor, projectCategories } from "@content/taxonomy";
import { getFeaturedProjects, getNotes, getProjects, getVideos } from "@/lib/content";
import { HeroVisual } from "@/components/HeroVisual";
import { Carousel3D, type CarouselProject } from "@/components/Carousel3D";
import { ButtonLink, Container } from "@/components/ui";
import { SocialLinks } from "@/components/SocialLinks";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const carousel: CarouselProject[] = featured.map((p) => ({
    slug: p.slug,
    title: p.title,
    status: p.status,
    category: p.category,
    categoryLabel: labelFor(projectCategories, p.category),
    summary: p.summary,
    hue: p.hue,
  }));

  const counts = {
    projects: getProjects().length,
    notes: getNotes().length,
    videos: getVideos().length,
  };

  const sections = [
    { href: "/projects", name: "Projects", text: `Filterable portfolio of research and quantitative work. ${counts.projects} entries so far, all labelled by status.` },
    { href: "/research", name: "Research", text: "Research interests, open questions and a journey timeline from planned to completed." },
    { href: "/notes", name: "Notes", text: `MSc study notes and formula sheets with rendered equations. ${counts.notes} sample notes to replace with your own.` },
    { href: "/videos", name: "Videos", text: "Educational videos grouped into playlists. Placeholders until real links are added." },
    { href: "/lab", name: "Economics Lab", text: "Four working models: consumer choice, monopoly, supply and demand, and regression." },
    { href: "/about", name: "About", text: "Academic background, interests, coursework and how to get in touch." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]" aria-hidden />
        <div
          className="pointer-events-none absolute -right-40 -top-32 -z-10 size-[620px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 38%, transparent), transparent)" }}
          aria-hidden
        />
        <Container className="grid items-center gap-6 pb-10 pt-10 lg:grid-cols-[1.02fr_1fr] lg:pb-16 lg:pt-16">
          <div>
            <h1 className="display text-[3.4rem] sm:text-7xl xl:text-[6.4rem]">
              The Quantitative
              <br />
              Economist
            </h1>
            <p className="mt-6 text-xl text-text sm:text-2xl">{site.tagline}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{site.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">
                Explore My Work <ArrowRight size={16} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/notes" variant="ghost">
                Browse Notes
              </ButtonLink>
            </div>

            <dl className="mt-10 grid max-w-xl gap-4 text-sm">
              <div>
                <dt className="text-muted">Working with</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {site.skills.map((s) => (
                    <span key={s} className="rounded-full border border-line px-3 py-1">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Interested in</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {site.interests.map((s) => (
                    <span key={s} className="rounded-full bg-line px-3 py-1 text-muted">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[460px] lg:h-[580px]">
            <HeroVisual />
            <p className="absolute bottom-1 left-1/2 w-full -translate-x-1/2 text-center text-xs text-muted">
              Utility surface √(x·y) with its indifference curves and a budget plane. Move the pointer over it.
            </p>
          </div>
        </Container>
      </section>

      {/* 3D CAROUSEL */}
      <section className="py-16" aria-labelledby="carousel-title">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="carousel-title" className="display text-4xl sm:text-5xl">
                Project concepts
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Starting ideas, not finished studies. Each card is labelled with its real status and opens a project page that
                states what has and has not been done.
              </p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
              All projects <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </Container>
        <div className="mx-auto max-w-6xl overflow-hidden px-2 sm:px-8">
          <Carousel3D projects={carousel} />
        </div>
      </section>

      {/* SECTION INDEX */}
      <section className="py-16" aria-labelledby="index-title">
        <Container>
          <h2 id="index-title" className="display text-4xl sm:text-5xl">
            Where to look
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group grid items-baseline gap-2 py-6 transition-colors hover:bg-line/40 sm:grid-cols-[240px_1fr_auto] sm:gap-8 sm:px-3"
                >
                  <span className="display text-3xl">{s.name}</span>
                  <span className="max-w-xl text-muted">{s.text}</span>
                  <ArrowUpRight size={18} className="hidden text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* UPDATES + CONTACT */}
      <section className="py-16">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div aria-labelledby="updates-title">
            <h2 id="updates-title" className="display text-4xl">
              Recent updates
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {site.updates.map((u) => (
                <li key={u.date + u.text} className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-6">
                  <time dateTime={u.date} className="text-sm text-muted">
                    {u.date}
                  </time>
                  <span>{u.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div aria-labelledby="contact-title">
            <h2 id="contact-title" className="display text-4xl">
              Contact
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              For research collaboration, internship conversations or feedback on a note or model.
            </p>
            <div className="mt-5">
              {site.links.email ? (
                <ButtonLink href={`mailto:${site.links.email}`} external>
                  Email {site.links.email}
                </ButtonLink>
              ) : (
                <p className="rounded-xl border border-dashed border-line-strong p-4 text-sm text-muted">
                  Placeholder: add your email address in <code>content/site.ts</code> and a contact button appears here.
                </p>
              )}
            </div>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

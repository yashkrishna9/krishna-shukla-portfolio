import { ButtonLink, Container } from "@/components/ui";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-24">
      <div className="max-w-xl text-center">
        <p className="display text-8xl text-accent" aria-hidden>
          404
        </p>
        <h1 className="display mt-4 text-4xl">This page is not on the map</h1>
        <p className="mt-4 leading-relaxed text-muted">
          The address may have a typo, or the project or note it pointed to has been renamed. Try the search with Ctrl K,
          or go back to a main section.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/projects" variant="ghost">
            Browse projects
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { labelFor, projectCategories } from "@content/taxonomy";
import { getProjects } from "@/lib/content";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { ProjectExplorer } from "@/components/ProjectExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Research and quantitative projects across microeconomics, econometrics, finance, data science and optimisation.",
};

export default function ProjectsPage() {
  const projects = getProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    status: p.status,
    category: p.category,
    categoryLabel: labelFor(projectCategories, p.category),
    tags: p.tags,
    featured: p.featured,
    hue: p.hue,
  }));

  return (
    <>
      <PageHeader
        title="Projects"
        intro="Every project shows its true status. A concept is an idea I plan to pursue; nothing is presented as a finished result until it is."
      />
      <Container>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet">
            Add a Markdown file to <code>content/projects</code> and it will appear here. See the README for the template.
          </EmptyState>
        ) : (
          <ProjectExplorer projects={projects} />
        )}
      </Container>
    </>
  );
}

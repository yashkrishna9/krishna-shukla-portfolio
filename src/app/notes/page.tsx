import type { Metadata } from "next";
import { labelFor, noteSubjects, noteTypes } from "@content/taxonomy";
import { getNotes } from "@/lib/content";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { NoteExplorer } from "@/components/NoteExplorer";

export const metadata: Metadata = {
  title: "Notes",
  description: "MSc Economics study notes, formula sheets and revision material with rendered equations.",
};

export default function NotesPage() {
  const notes = getNotes().map((n) => ({
    slug: n.slug,
    title: n.title,
    description: n.description,
    semester: n.semester,
    subject: n.subject,
    subjectLabel: labelFor(noteSubjects, n.subject),
    chapter: n.chapter,
    topic: n.topic,
    type: n.type,
    typeLabel: labelFor(noteTypes, n.type),
    tags: n.tags,
    hasPdf: Boolean(n.pdf),
  }));

  return (
    <>
      <PageHeader
        title="Notes"
        intro="Study notes organised by semester, subject, chapter and topic. The two notes here are short samples; PDF downloads appear only when a real file exists."
      />
      <Container>
        {notes.length === 0 ? (
          <EmptyState title="No notes yet">
            Add a Markdown file to <code>content/notes</code> and it will appear here. See the README for the template.
          </EmptyState>
        ) : (
          <NoteExplorer notes={notes} />
        )}
      </Container>
    </>
  );
}

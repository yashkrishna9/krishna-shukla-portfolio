import type { Metadata } from "next";
import { site } from "@content/site";
import { labelFor, videoCategories } from "@content/taxonomy";
import { getNotes, getProjects, getVideos } from "@/lib/content";
import { youtubeId } from "@/lib/youtube";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { VideoLibrary, type VideoCardData } from "@/components/VideoLibrary";

export const metadata: Metadata = {
  title: "Videos",
  description: "Educational videos on economics, econometrics, mathematics, Python and quantitative research.",
};

export default function VideosPage() {
  const notes = getNotes();
  const projects = getProjects();
  const videos: VideoCardData[] = getVideos().map((v) => {
    const videoId = youtubeId(v.url);
    return {
      id: v.id,
      title: v.title,
      videoId,
      invalidUrl: Boolean(v.url) && !videoId,
      category: v.category,
      categoryLabel: labelFor(videoCategories, v.category),
      playlist: v.playlist,
      description: v.description,
      featured: Boolean(v.featured),
      notes: (v.relatedNotes ?? []).flatMap((s) => {
        const n = notes.find((x) => x.slug === s);
        return n ? [{ slug: n.slug, title: n.title }] : [];
      }),
      projects: (v.relatedProjects ?? []).flatMap((s) => {
        const p = projects.find((x) => x.slug === s);
        return p ? [{ slug: p.slug, title: p.title }] : [];
      }),
    };
  });

  const real = videos.filter((v) => v.videoId).length;

  return (
    <>
      <PageHeader
        title="Videos"
        intro={
          real === 0
            ? "The video library is ready, but no real videos have been added yet. The cards below are labelled placeholders."
            : "Short explainers grouped into playlists. Open any video to watch it here."
        }
      />
      <Container>
        {videos.length === 0 ? (
          <EmptyState title="No videos yet">Add an entry to <code>content/videos.ts</code> and it will appear here.</EmptyState>
        ) : (
          <VideoLibrary videos={videos} channelUrl={site.links.youtube} />
        )}
      </Container>
    </>
  );
}

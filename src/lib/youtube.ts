/** Extract an 11-character YouTube video ID from a normal URL (or return null). */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/") || u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/live/"))
        id = u.pathname.split("/")[2];
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
/** Privacy-friendly embed host; nothing loads until the visitor opens a video. */
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;

import { describe, expect, it } from "vitest";
import { youtubeId } from "./youtube";

describe("youtubeId", () => {
  it("parses watch, short and embed links", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ?t=5")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("returns null for empty or invalid input", () => {
    expect(youtubeId("")).toBeNull();
    expect(youtubeId("not a url")).toBeNull();
    expect(youtubeId("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });
});

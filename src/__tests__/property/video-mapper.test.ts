import { describe, it, expect } from "vitest";
import { mapTokkoProperties } from "@/lib/tokko/mapper";
import type { TokkoProperty } from "@/lib/tokko/client";

function makeRawProperty(overrides: Partial<TokkoProperty> = {}): TokkoProperty {
  return {
    id: 1,
    publication_title: "Test Property",
    type: { id: 1, name: "House" },
    status: 2,
    branch: { id: 85101, name: "Test" },
    operations: [],
    photos: [],
    videos: [],
    ...overrides,
  };
}

describe("Video Mapper", () => {
  it("maps YouTube videos", () => {
    const raw = makeRawProperty({
      videos: [
        { id: 1, url: "https://youtube.com/watch?v=abc123", provider: "youtube", player_url: "https://youtube.com/embed/abc123" },
      ],
    });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(1);
    expect(properties[0].media.videos[0].url).toContain("youtube.com");
    expect(properties[0].media.videos[0].provider).toBe("youtube");
  });

  it("maps Instagram videos", () => {
    const raw = makeRawProperty({
      videos: [
        { id: 2, url: "https://instagram.com/reel/abc123", provider: "Otro" },
      ],
    });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(1);
    expect(properties[0].media.videos[0].url).toContain("instagram.com");
  });

  it("filters out videos with no URL", () => {
    const raw = makeRawProperty({
      videos: [
        { id: 3 },
        { id: 4, url: "https://youtube.com/watch?v=valid" },
      ],
    });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(1);
  });

  it("handles empty videos array", () => {
    const raw = makeRawProperty({ videos: [] });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(0);
  });

  it("handles missing videos field", () => {
    const raw = makeRawProperty({ videos: undefined });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(0);
  });

  it("maps multiple videos", () => {
    const raw = makeRawProperty({
      videos: [
        { id: 1, url: "https://youtube.com/watch?v=abc", provider: "youtube" },
        { id: 2, url: "https://youtube.com/watch?v=def", provider: "youtube" },
        { id: 3, url: "https://instagram.com/reel/ghi", provider: "Otro" },
      ],
    });
    const properties = mapTokkoProperties([raw]);
    expect(properties[0].media.videos).toHaveLength(3);
  });
});

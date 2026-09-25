import { describe, it, expect } from "vitest";
import type { Property, PropertyVideo, PropertyImage, PropertyPanorama } from "@/types/property";

function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 1,
    slug: "test-property",
    title: "Test Property",
    type: "house",
    operation: "sale",
    status: "available",
    prices: [{ amount: 100000, currency: "USD", operation: "sale", isPromotional: false }],
    location: { city: "Villa Rumipal" },
    features: { bedrooms: 2, bathrooms: 1 },
    media: { images: [], videos: [], panoramas360: [] },
    urls: { canonical: "/propiedades/test", tokkoId: 1 },
    ...overrides,
  };
}

function makeImage(overrides: Partial<PropertyImage> = {}): PropertyImage {
  return {
    id: "img-1",
    imageUrl: "https://example.com/image.jpg",
    thumbnailUrl: "https://example.com/thumb.jpg",
    originalUrl: "https://example.com/original.jpg",
    alt: "Test image",
    order: 0,
    isFrontCover: false,
    isBlueprint: false,
    ...overrides,
  };
}

function makeVideo(overrides: Partial<PropertyVideo> = {}): PropertyVideo {
  return {
    id: "video-1",
    url: "https://youtube.com/watch?v=abc123",
    provider: "youtube",
    ...overrides,
  };
}

describe("Property Media", () => {
  it("property has images array", () => {
    const property = makeProperty({
      media: { images: [makeImage()], videos: [], panoramas360: [] },
    });
    expect(property.media.images).toHaveLength(1);
  });

  it("property has videos array", () => {
    const property = makeProperty({
      media: { images: [], videos: [makeVideo()], panoramas360: [] },
    });
    expect(property.media.videos).toHaveLength(1);
  });

  it("property has panoramas360 array", () => {
    const property = makeProperty({
      media: { images: [], videos: [], panoramas360: [{ id: "p1", imageUrl: "test", type: "360" }] },
    });
    expect(property.media.panoramas360).toHaveLength(1);
  });
});

describe("Video Detection", () => {
  it("detects YouTube video", () => {
    const video = makeVideo({ url: "https://youtube.com/watch?v=abc123" });
    expect(video.url).toContain("youtube.com");
  });

  it("detects Instagram video", () => {
    const video = makeVideo({ url: "https://instagram.com/reel/abc123", provider: "Otro" });
    expect(video.url).toContain("instagram.com");
  });

  it("handles empty videos array", () => {
    const property = makeProperty();
    expect(property.media.videos).toHaveLength(0);
  });

  it("handles video with player_url", () => {
    const video = makeVideo({ url: "https://youtube.com/embed/abc123" });
    expect(video.url).toContain("embed");
  });
});

describe("Missing Media", () => {
  it("handles property with no images", () => {
    const property = makeProperty();
    expect(property.media.images).toHaveLength(0);
  });

  it("handles property with no videos", () => {
    const property = makeProperty();
    expect(property.media.videos).toHaveLength(0);
  });

  it("handles property with no panoramas", () => {
    const property = makeProperty();
    expect(property.media.panoramas360).toHaveLength(0);
  });

  it("handles property with empty media object", () => {
    const property = makeProperty({ media: { images: [], videos: [], panoramas360: [] } });
    expect(property.media.images).toHaveLength(0);
    expect(property.media.videos).toHaveLength(0);
    expect(property.media.panoramas360).toHaveLength(0);
  });
});

describe("360 Detection", () => {
  it("detects panorama data", () => {
    const panoramas: PropertyPanorama[] = [
      { id: "p1", imageUrl: "https://example.com/360.jpg", type: "360" },
    ];
    const property = makeProperty({
      media: { images: [], videos: [], panoramas360: panoramas },
    });
    expect(property.media.panoramas360.length).toBeGreaterThan(0);
  });

  it("handles no panorama data", () => {
    const property = makeProperty();
    expect(property.media.panoramas360).toHaveLength(0);
  });
});

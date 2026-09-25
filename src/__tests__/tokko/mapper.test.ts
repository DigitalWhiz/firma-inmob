// Tokko Mapper — Unit tests
import { describe, it, expect } from "vitest";
import { mapTokkoProperty, generatePropertySlug } from "@/lib/tokko/mapper";
import type { TokkoProperty } from "@/lib/tokko/client";

// ============================================================
// TEST FIXTURES
// ============================================================

function makeRawProperty(overrides: Partial<TokkoProperty> = {}): TokkoProperty {
  return {
    id: 1234567,
    publication_title: "Casa en Villa del Dique",
    status: 2,
    type: { code: "CH", id: 1, name: "House" },
    operations: [
      {
        operation_id: 1,
        operation_type: "Sale",
        prices: [{ currency: "USD", price: 250000, is_promotional: false, period: 0 }],
      },
    ],
    photos: [
      {
        description: null,
        image: "https://static.tokkobroker.com/pictures/test.jpg",
        is_blueprint: false,
        is_front_cover: true,
        order: 0,
        original: "https://static.tokkobroker.com/original_pictures/test.jpg",
        social_media_url: "https://static.tokkobroker.com/sm_pics/test_og.jpg",
        thumb: "https://static.tokkobroker.com/thumbs/test_thumb.jpg",
      },
    ],
    videos: [],
    producer: {
      id: 999,
      name: "Test Agent",
      email: "test@test.com",
      cellphone: "123456",
      phone: "789012",
      picture: "https://example.com/photo.jpg",
    },
    branch: { id: 85101, name: "Ezequiel" },
    location: {
      full_location: "Argentina | Cordoba | Calamuchita | Villa del Dique",
      id: 30860,
      name: "Villa del Dique",
    },
    geo_lat: "-32.1800",
    geo_long: "-64.4600",
    address: "Calle Principal 123",
    suite_amount: 3,
    bathroom_amount: 2,
    toilet_amount: 1,
    room_amount: 8,
    living_amount: 1,
    dining_room: 1,
    tv_rooms: 1,
    parking_lot_amount: 2,
    covered_parking_lot: 1,
    uncovered_parking_lot: 1,
    roofed_surface: "150.00",
    surface: "500.00",
    total_area: "0.00",
    floors_amount: 2,
    public_url: "https://ficha.info/p/AbCdEf123456",
    reference_code: "FHL1234567",
    description: "Hermosa casa con vista al lago",
    created_at: "2025-06-15T10:30:00",
    ...overrides,
  };
}

// ============================================================
// PROPERTY TYPE MAPPING
// ============================================================

describe("Property Type Mapping", () => {
  it("maps House to 'house'", () => {
    const raw = makeRawProperty({ type: { name: "House" } });
    expect(mapTokkoProperty(raw).type).toBe("house");
  });

  it("maps Land to 'land'", () => {
    const raw = makeRawProperty({ type: { name: "Land" } });
    expect(mapTokkoProperty(raw).type).toBe("land");
  });

  it("maps Bussiness Permit to 'business_permit'", () => {
    const raw = makeRawProperty({ type: { name: "Bussiness Permit" } });
    expect(mapTokkoProperty(raw).type).toBe("business_permit");
  });

  it("maps Countryside to 'countryside'", () => {
    const raw = makeRawProperty({ type: { name: "Countryside" } });
    expect(mapTokkoProperty(raw).type).toBe("countryside");
  });

  it("maps Apartment to 'apartment'", () => {
    const raw = makeRawProperty({ type: { name: "Apartment" } });
    expect(mapTokkoProperty(raw).type).toBe("apartment");
  });

  it("maps unknown type to 'other'", () => {
    const raw = makeRawProperty({ type: { name: "UnknownType" } });
    expect(mapTokkoProperty(raw).type).toBe("other");
  });

  it("maps missing type to 'other'", () => {
    const raw = makeRawProperty({ type: undefined });
    expect(mapTokkoProperty(raw).type).toBe("other");
  });

  it("maps missing type.name to 'other'", () => {
    const raw = makeRawProperty({ type: { code: "XX" } });
    expect(mapTokkoProperty(raw).type).toBe("other");
  });
});

// ============================================================
// OPERATION MAPPING
// ============================================================

describe("Operation Mapping", () => {
  it("maps Sale operation", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [{ currency: "USD", price: 100000, is_promotional: false, period: 0 }],
        },
      ],
    });
    expect(mapTokkoProperty(raw).operation).toBe("sale");
  });

  it("maps Rent operation", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 2,
          operation_type: "Rent",
          prices: [{ currency: "ARS", price: 50000, is_promotional: false, period: 30 }],
        },
      ],
    });
    expect(mapTokkoProperty(raw).operation).toBe("rent");
  });

  it("maps TemporaryRent operation", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 3,
          operation_type: "TemporaryRent",
          prices: [{ currency: "USD", price: 1000, is_promotional: false, period: 7 }],
        },
      ],
    });
    expect(mapTokkoProperty(raw).operation).toBe("temporary_rent");
  });

  it("maps unknown operation to 'other'", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 99,
          operation_type: "Exchange",
          prices: [{ currency: "USD", price: 0, is_promotional: false, period: 0 }],
        },
      ],
    });
    expect(mapTokkoProperty(raw).operation).toBe("other");
  });

  it("handles missing operations", () => {
    const raw = makeRawProperty({ operations: undefined });
    expect(mapTokkoProperty(raw).operation).toBe("sale");
  });
});

// ============================================================
// PRICE MAPPING
// ============================================================

describe("Price Mapping", () => {
  it("extracts single price", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [{ currency: "USD", price: 250000, is_promotional: false, period: 0 }],
        },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.prices).toHaveLength(1);
    expect(prop.prices[0].amount).toBe(250000);
    expect(prop.prices[0].currency).toBe("USD");
  });

  it("extracts multiple prices from same operation", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [
            { currency: "USD", price: 250000, is_promotional: false, period: 0 },
            { currency: "ARS", price: 100000000, is_promotional: false, period: 0 },
          ],
        },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.prices).toHaveLength(2);
    expect(prop.prices[0].currency).toBe("USD");
    expect(prop.prices[1].currency).toBe("ARS");
  });

  it("extracts prices from multiple operations", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [{ currency: "USD", price: 250000, is_promotional: false, period: 0 }],
        },
        {
          operation_id: 2,
          operation_type: "Rent",
          prices: [{ currency: "USD", price: 1500, is_promotional: false, period: 30 }],
        },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.prices).toHaveLength(2);
    expect(prop.prices[0].operation).toBe("sale");
    expect(prop.prices[1].operation).toBe("rent");
  });

  it("marks promotional prices", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [{ currency: "USD", price: 200000, is_promotional: true, period: 0 }],
        },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.prices[0].isPromotional).toBe(true);
  });

  it("handles missing operations", () => {
    const raw = makeRawProperty({ operations: undefined });
    expect(mapTokkoProperty(raw).prices).toEqual([]);
  });

  it("handles operations with no prices", () => {
    const raw = makeRawProperty({
      operations: [
        {
          operation_id: 1,
          operation_type: "Sale",
          prices: [],
        },
      ],
    });
    expect(mapTokkoProperty(raw).prices).toEqual([]);
  });
});

// ============================================================
// IMAGE MAPPING
// ============================================================

describe("Image Mapping", () => {
  it("maps images with correct structure", () => {
    const raw = makeRawProperty({
      photos: [
        {
          description: "Frente de la casa",
          image: "https://static.tokkobroker.com/pictures/test.jpg",
          is_blueprint: false,
          is_front_cover: true,
          order: 0,
          original: "https://static.tokkobroker.com/original_pictures/test.jpg",
          social_media_url: "https://static.tokkobroker.com/sm_pics/test_og.jpg",
          thumb: "https://static.tokkobroker.com/thumbs/test_thumb.jpg",
        },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images).toHaveLength(1);
    expect(prop.media.images[0].alt).toBe("Frente de la casa");
    expect(prop.media.images[0].isFrontCover).toBe(true);
    expect(prop.media.images[0].isBlueprint).toBe(false);
  });

  it("sorts images by order", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 2, image: "a.jpg", thumb: "a_t.jpg", original: "a_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
        { order: 0, image: "b.jpg", thumb: "b_t.jpg", original: "b_o.jpg", is_front_cover: true, is_blueprint: false, description: null, social_media_url: "" },
        { order: 1, image: "c.jpg", thumb: "c_t.jpg", original: "c_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images[0].order).toBe(0);
    expect(prop.media.images[1].order).toBe(1);
    expect(prop.media.images[2].order).toBe(2);
  });

  it("handles missing photos", () => {
    const raw = makeRawProperty({ photos: undefined });
    expect(mapTokkoProperty(raw).media.images).toEqual([]);
  });

  it("handles blueprint images", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 0, image: "bp.jpg", thumb: "bp_t.jpg", original: "bp_o.jpg", is_front_cover: false, is_blueprint: true, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images[0].isBlueprint).toBe(true);
  });

  it("generates unique IDs for images with same order but different URLs", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 17, image: "https://cdn.example.com/img-a.jpg", thumb: "thumb-a.jpg", original: "orig-a.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
        { order: 17, image: "https://cdn.example.com/img-b.jpg", thumb: "thumb-b.jpg", original: "orig-b.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images).toHaveLength(2);
    expect(prop.media.images[0].id).not.toBe(prop.media.images[1].id);
  });

  it("deduplicates images with same URL", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 0, image: "https://cdn.example.com/photo.jpg", thumb: "t.jpg", original: "o.jpg", is_front_cover: true, is_blueprint: false, description: null, social_media_url: "" },
        { order: 1, image: "https://cdn.example.com/photo.jpg", thumb: "t.jpg", original: "o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images).toHaveLength(1);
    expect(prop.media.images[0].isFrontCover).toBe(true);
  });

  it("preserves all images with different URLs even if order duplicates", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 5, image: "https://cdn.example.com/x.jpg", thumb: "x_t.jpg", original: "x_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
        { order: 5, image: "https://cdn.example.com/y.jpg", thumb: "y_t.jpg", original: "y_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
        { order: 5, image: "https://cdn.example.com/z.jpg", thumb: "z_t.jpg", original: "z_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images).toHaveLength(3);
    const ids = prop.media.images.map((img) => img.id);
    expect(new Set(ids).size).toBe(3);
  });

  it("generates stable deterministic IDs", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 0, image: "https://cdn.example.com/a.jpg", thumb: "a_t.jpg", original: "a_o.jpg", is_front_cover: true, is_blueprint: false, description: null, social_media_url: "" },
        { order: 1, image: "https://cdn.example.com/b.jpg", thumb: "b_t.jpg", original: "b_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop1 = mapTokkoProperty(raw);
    const prop2 = mapTokkoProperty(raw);
    expect(prop1.media.images[0].id).toBe(prop2.media.images[0].id);
    expect(prop1.media.images[1].id).toBe(prop2.media.images[1].id);
  });

  it("front cover image is correctly identified after deduplication", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 0, image: "https://cdn.example.com/cover.jpg", thumb: "cover_t.jpg", original: "cover_o.jpg", is_front_cover: true, is_blueprint: false, description: null, social_media_url: "" },
        { order: 1, image: "https://cdn.example.com/other.jpg", thumb: "other_t.jpg", original: "other_o.jpg", is_front_cover: false, is_blueprint: false, description: null, social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images[0].isFrontCover).toBe(true);
    expect(prop.media.images[1].isFrontCover).toBe(false);
  });

  it("empty photos array returns empty images", () => {
    const raw = makeRawProperty({ photos: [] });
    expect(mapTokkoProperty(raw).media.images).toEqual([]);
  });

  it("single image works correctly", () => {
    const raw = makeRawProperty({
      photos: [
        { order: 0, image: "https://cdn.example.com/single.jpg", thumb: "single_t.jpg", original: "single_o.jpg", is_front_cover: true, is_blueprint: false, description: "Solo", social_media_url: "" },
      ],
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.media.images).toHaveLength(1);
    expect(prop.media.images[0].alt).toBe("Solo");
    expect(prop.media.images[0].isFrontCover).toBe(true);
  });
});

// ============================================================
// AGENT MAPPING
// ============================================================

describe("Agent Mapping", () => {
  it("maps agent correctly", () => {
    const raw = makeRawProperty({
      producer: {
        id: 999,
        name: "Test Agent",
        email: "test@test.com",
        cellphone: "123456",
        phone: "789012",
        picture: "https://example.com/photo.jpg",
        position: "Manager",
      },
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.agent).toBeDefined();
    expect(prop.agent!.id).toBe(999);
    expect(prop.agent!.name).toBe("Test Agent");
    expect(prop.agent!.email).toBe("test@test.com");
    expect(prop.agent!.phone).toBe("789012");
    expect(prop.agent!.cellphone).toBe("123456");
    expect(prop.agent!.photoUrl).toBe("https://example.com/photo.jpg");
    expect(prop.agent!.position).toBe("Manager");
  });

  it("handles missing agent", () => {
    const raw = makeRawProperty({ producer: undefined });
    expect(mapTokkoProperty(raw).agent).toBeUndefined();
  });
});

// ============================================================
// FICHA URL EXTRACTION
// ============================================================

describe("Ficha URL Extraction", () => {
  it("extracts hash from public_url", () => {
    const raw = makeRawProperty({
      public_url: "https://ficha.info/p/eCZIZdGm1ojP9a",
    });
    const prop = mapTokkoProperty(raw);
    expect(prop.urls.fichaHash).toBe("eCZIZdGm1ojP9a");
    expect(prop.urls.fichaUrl).toBe("https://ficha.info/p/eCZIZdGm1ojP9a");
  });

  it("handles missing public_url", () => {
    const raw = makeRawProperty({ public_url: undefined });
    const prop = mapTokkoProperty(raw);
    expect(prop.urls.fichaHash).toBeUndefined();
    expect(prop.urls.fichaUrl).toBeUndefined();
  });
});

// ============================================================
// SLUG GENERATION
// ============================================================

describe("Slug Generation", () => {
  it("generates correct slug from title", () => {
    expect(generatePropertySlug("Casa con vista al lago")).toBe(
      "casa-con-vista-al-lago",
    );
  });

  it("removes special characters", () => {
    expect(generatePropertySlug("Casa | 5 AMBIENTES!")).toBe(
      "casa-5-ambientes",
    );
  });

  it("handles accents", () => {
    expect(generatePropertySlug("Cabaña con pileta")).toBe(
      "cabana-con-pileta",
    );
  });

  it("limits length to 100 chars", () => {
    const longTitle = "A".repeat(200);
    expect(generatePropertySlug(longTitle)).toHaveLength(100);
  });
});

// ============================================================
// MISSING OPTIONAL FIELDS
// ============================================================

describe("Missing Optional Fields", () => {
  it("handles minimal property data", () => {
    const raw: TokkoProperty = {
      id: 9999999,
      status: 2,
    };
    const prop = mapTokkoProperty(raw);
    expect(prop.id).toBe(9999999);
    expect(prop.title).toBe("Propiedad 9999999");
    expect(prop.type).toBe("other");
    expect(prop.operation).toBe("sale");
    expect(prop.status).toBe("available");
    expect(prop.prices).toEqual([]);
    expect(prop.media.images).toEqual([]);
    expect(prop.agent).toBeUndefined();
    expect(prop.urls.fichaHash).toBeUndefined();
  });
});

// ============================================================
// BRANCH VALIDATION
// ============================================================

describe("Branch Validation", () => {
  it("preserves branch ID in raw data", () => {
    const raw = makeRawProperty({
      branch: { id: 85101, name: "Ezequiel" },
    });
    mapTokkoProperty(raw);
    // Branch is not in the Property model — it's filtered at provider level.
    // But the raw data is preserved for debugging.
    expect(raw.branch?.id).toBe(85101);
  });
});

// ============================================================
// STATUS MAPPING
// ============================================================

describe("Status Mapping", () => {
  it("maps status 2 to 'available'", () => {
    const raw = makeRawProperty({ status: 2 });
    expect(mapTokkoProperty(raw).status).toBe("available");
  });

  it("maps unknown status to 'unavailable'", () => {
    const raw = makeRawProperty({ status: 99 });
    expect(mapTokkoProperty(raw).status).toBe("unavailable");
  });

  it("maps missing status to 'unavailable'", () => {
    const raw = makeRawProperty({ status: undefined });
    expect(mapTokkoProperty(raw).status).toBe("unavailable");
  });

  it("does NOT use deleted_at for status", () => {
    const raw = makeRawProperty({
      status: 2,
      deleted_at: "2025-11-11T16:47:57",
    });
    // deleted_at exists but status is still "available"
    expect(mapTokkoProperty(raw).status).toBe("available");
  });
});

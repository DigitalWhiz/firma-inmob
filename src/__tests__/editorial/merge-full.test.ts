import { describe, it, expect } from "vitest";
import {
  mergeProperty,
  mergeProperties,
  getVisibleProperties,
  getHiddenProperties,
  getFeaturedProperties,
  getPropertiesByStatus,
  sortBySortOrder,
  getPublicProperties,
  type EditorialProperty,
} from "@/lib/editorial/merge";
import type { Property } from "@/types/property";
import type { EditorialOverride } from "@/types/editorial";

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
    features: {},
    media: { images: [], videos: [], panoramas360: [] },
    urls: { canonical: "", tokkoId: 1 },
    ...overrides,
  };
}

function makeOverride(overrides: Partial<EditorialOverride> = {}): EditorialOverride {
  return {
    propertyId: 1,
    visible: true,
    featured: false,
    editorialStatus: "available",
    sortOrder: 0,
    internalNote: "",
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeMerged(
  id: number,
  editorial: Partial<EditorialProperty["editorial"]> = {},
): EditorialProperty {
  return {
    ...makeProperty({ id, slug: `property-${id}` }),
    editorial: {
      visible: true,
      featured: false,
      editorialStatus: "available",
      sortOrder: 0,
      internalNote: "",
      updatedAt: "",
      ...editorial,
    },
  };
}

describe("Editorial Merge — Full Suite", () => {
  describe("mergeProperty", () => {
    it("merges property with override", () => {
      const property = makeProperty({ id: 123 });
      const override = makeOverride({ propertyId: 123, visible: false, editorialStatus: "sold" });
      const merged = mergeProperty(property, override);
      expect(merged.id).toBe(123);
      expect(merged.editorial.visible).toBe(false);
      expect(merged.editorial.editorialStatus).toBe("sold");
    });

    it("uses defaults when no override", () => {
      const property = makeProperty({ id: 456 });
      const merged = mergeProperty(property, null);
      expect(merged.editorial.visible).toBe(true);
      expect(merged.editorial.featured).toBe(false);
      expect(merged.editorial.editorialStatus).toBe("available");
    });
  });

  describe("mergeProperties", () => {
    it("merges multiple properties with overrides", () => {
      const properties = [makeProperty({ id: 1 }), makeProperty({ id: 2 })];
      const overrides = new Map<number, EditorialOverride>([
        [1, makeOverride({ propertyId: 1, visible: false })],
      ]);
      const merged = mergeProperties(properties, overrides);
      expect(merged[0].editorial.visible).toBe(false);
      expect(merged[1].editorial.visible).toBe(true);
    });
  });

  describe("getVisibleProperties", () => {
    it("returns only visible properties", () => {
      const properties = [
        makeMerged(1, { visible: true }),
        makeMerged(2, { visible: false }),
        makeMerged(3, { visible: true }),
      ];
      const visible = getVisibleProperties(properties);
      expect(visible).toHaveLength(2);
      expect(visible.map((p) => p.id)).toEqual([1, 3]);
    });
  });

  describe("getHiddenProperties", () => {
    it("returns only hidden properties", () => {
      const properties = [
        makeMerged(1, { visible: true }),
        makeMerged(2, { visible: false }),
      ];
      const hidden = getHiddenProperties(properties);
      expect(hidden).toHaveLength(1);
      expect(hidden[0].id).toBe(2);
    });
  });

  describe("getFeaturedProperties", () => {
    it("returns only visible + featured properties", () => {
      const properties = [
        makeMerged(1, { visible: true, featured: true }),
        makeMerged(2, { visible: false, featured: true }),
        makeMerged(3, { visible: true, featured: false }),
      ];
      const featured = getFeaturedProperties(properties);
      expect(featured).toHaveLength(1);
      expect(featured[0].id).toBe(1);
    });

    it("hidden featured properties are excluded", () => {
      const properties = [
        makeMerged(1, { visible: false, featured: true }),
      ];
      const featured = getFeaturedProperties(properties);
      expect(featured).toHaveLength(0);
    });
  });

  describe("getPropertiesByStatus", () => {
    it("returns reserved properties", () => {
      const properties = [
        makeMerged(1, { editorialStatus: "available" }),
        makeMerged(2, { editorialStatus: "reserved" }),
        makeMerged(3, { editorialStatus: "sold" }),
      ];
      const reserved = getPropertiesByStatus(properties, "reserved");
      expect(reserved).toHaveLength(1);
      expect(reserved[0].id).toBe(2);
    });

    it("returns sold properties", () => {
      const properties = [
        makeMerged(1, { editorialStatus: "sold" }),
        makeMerged(2, { editorialStatus: "available" }),
      ];
      const sold = getPropertiesByStatus(properties, "sold");
      expect(sold).toHaveLength(1);
      expect(sold[0].id).toBe(1);
    });

    it("hidden properties excluded from status queries", () => {
      const properties = [
        makeMerged(1, { visible: false, editorialStatus: "reserved" }),
        makeMerged(2, { visible: true, editorialStatus: "reserved" }),
      ];
      const reserved = getPropertiesByStatus(properties, "reserved");
      expect(reserved).toHaveLength(1);
      expect(reserved[0].id).toBe(2);
    });
  });

  describe("sortBySortOrder", () => {
    it("sorts by sortOrder ascending", () => {
      const properties = [
        makeMerged(1, { sortOrder: 30 }),
        makeMerged(2, { sortOrder: 10 }),
        makeMerged(3, { sortOrder: 20 }),
      ];
      const sorted = sortBySortOrder(properties);
      expect(sorted.map((p) => p.id)).toEqual([2, 3, 1]);
    });
  });

  describe("getPublicProperties", () => {
    it("returns visible properties sorted by sortOrder", () => {
      const properties = [
        makeMerged(1, { visible: false, sortOrder: 0 }),
        makeMerged(2, { visible: true, sortOrder: 20 }),
        makeMerged(3, { visible: true, sortOrder: 10 }),
      ];
      const publicProps = getPublicProperties(properties);
      expect(publicProps).toHaveLength(2);
      expect(publicProps.map((p) => p.id)).toEqual([3, 2]);
    });

    it("reserved properties remain visible when visible=true", () => {
      const properties = [
        makeMerged(1, { visible: true, editorialStatus: "reserved" }),
      ];
      const publicProps = getPublicProperties(properties);
      expect(publicProps).toHaveLength(1);
    });

    it("sold properties remain visible when visible=true", () => {
      const properties = [
        makeMerged(1, { visible: true, editorialStatus: "sold" }),
      ];
      const publicProps = getPublicProperties(properties);
      expect(publicProps).toHaveLength(1);
    });
  });
});

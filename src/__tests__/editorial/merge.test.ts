import { describe, it, expect } from "vitest";
import {
  mergeProperty,
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

describe("Editorial Merge", () => {
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

  describe("getVisibleProperties", () => {
    it("returns only visible properties", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: false, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 3 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
      ];

      const visible = getVisibleProperties(properties);
      expect(visible).toHaveLength(2);
      expect(visible.map((p) => p.id)).toEqual([1, 3]);
    });
  });

  describe("getHiddenProperties", () => {
    it("returns only hidden properties", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: false, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
      ];

      const hidden = getHiddenProperties(properties);
      expect(hidden).toHaveLength(1);
      expect(hidden[0].id).toBe(2);
    });
  });

  describe("getFeaturedProperties", () => {
    it("returns only visible + featured properties", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: true, featured: true, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: false, featured: true, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 3 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
      ];

      const featured = getFeaturedProperties(properties);
      expect(featured).toHaveLength(1);
      expect(featured[0].id).toBe(1);
    });
  });

  describe("getPropertiesByStatus", () => {
    it("returns properties with specific status", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: true, featured: false, editorialStatus: "reserved", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 3 }), editorial: { visible: true, featured: false, editorialStatus: "sold", sortOrder: 0, internalNote: "", updatedAt: "" } },
      ];

      const reserved = getPropertiesByStatus(properties, "reserved");
      expect(reserved).toHaveLength(1);
      expect(reserved[0].id).toBe(2);
    });
  });

  describe("sortBySortOrder", () => {
    it("sorts by sortOrder ascending", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 30, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 10, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 3 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 20, internalNote: "", updatedAt: "" } },
      ];

      const sorted = sortBySortOrder(properties);
      expect(sorted.map((p) => p.id)).toEqual([2, 3, 1]);
    });
  });

  describe("getPublicProperties", () => {
    it("returns visible properties sorted by sortOrder", () => {
      const properties: EditorialProperty[] = [
        { ...makeProperty({ id: 1 }), editorial: { visible: false, featured: false, editorialStatus: "available", sortOrder: 0, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 2 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 20, internalNote: "", updatedAt: "" } },
        { ...makeProperty({ id: 3 }), editorial: { visible: true, featured: false, editorialStatus: "available", sortOrder: 10, internalNote: "", updatedAt: "" } },
      ];

      const publicProps = getPublicProperties(properties);
      expect(publicProps).toHaveLength(2);
      expect(publicProps.map((p) => p.id)).toEqual([3, 2]);
    });
  });
});

import { describe, it, expect } from "vitest";
import {
  CATEGORIES,
  getCategoryBySlug,
  getCategoryByTokkoType,
  getCategorySlugs,
} from "@/config/categories";

describe("Category Mapping", () => {
  it("has 5 categories", () => {
    expect(CATEGORIES).toHaveLength(5);
  });

  it("all categories have required fields", () => {
    for (const cat of CATEGORIES) {
      expect(cat.slug).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.pluralLabel).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.tokkoTypes.length).toBeGreaterThan(0);
      expect(cat.metaTitle).toBeTruthy();
      expect(cat.metaDescription).toBeTruthy();
    }
  });

  it("casas maps to house type", () => {
    const cat = getCategoryBySlug("casas");
    expect(cat).toBeDefined();
    expect(cat!.tokkoTypes).toContain("house");
  });

  it("departamentos maps to apartment type", () => {
    const cat = getCategoryBySlug("departamentos");
    expect(cat).toBeDefined();
    expect(cat!.tokkoTypes).toContain("apartment");
  });

  it("terrenos maps to land type", () => {
    const cat = getCategoryBySlug("terrenos");
    expect(cat).toBeDefined();
    expect(cat!.tokkoTypes).toContain("land");
  });

  it("complejos maps to business_permit type", () => {
    const cat = getCategoryBySlug("complejos");
    expect(cat).toBeDefined();
    expect(cat!.tokkoTypes).toContain("business_permit");
  });

  it("campos maps to countryside type", () => {
    const cat = getCategoryBySlug("campos");
    expect(cat).toBeDefined();
    expect(cat!.tokkoTypes).toContain("countryside");
  });

  it("getCategoryBySlug returns undefined for unknown slug", () => {
    expect(getCategoryBySlug("unknown")).toBeUndefined();
  });

  it("getCategoryByTokkoType returns correct category for each type", () => {
    expect(getCategoryByTokkoType("house")?.slug).toBe("casas");
    expect(getCategoryByTokkoType("apartment")?.slug).toBe("departamentos");
    expect(getCategoryByTokkoType("land")?.slug).toBe("terrenos");
    expect(getCategoryByTokkoType("business_permit")?.slug).toBe("complejos");
    expect(getCategoryByTokkoType("countryside")?.slug).toBe("campos");
  });

  it("getCategoryByTokkoType returns undefined for other type", () => {
    expect(getCategoryByTokkoType("other")).toBeUndefined();
  });

  it("getCategorySlugs returns all slugs", () => {
    const slugs = getCategorySlugs();
    expect(slugs).toContain("casas");
    expect(slugs).toContain("departamentos");
    expect(slugs).toContain("terrenos");
    expect(slugs).toContain("complejos");
    expect(slugs).toContain("campos");
  });

  it("slugs are URL-safe", () => {
    for (const cat of CATEGORIES) {
      expect(cat.slug).toMatch(/^[a-z-]+$/);
    }
  });
});

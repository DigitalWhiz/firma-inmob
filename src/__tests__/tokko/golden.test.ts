// Golden test — validates mapper against real Tokko data
// Uses: audit/raw/sample-property-full.json (Tokko ID 6871387)
// This test MUST NOT modify the fixture. The mapper must adapt to real data.

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { mapTokkoProperty, generatePropertySlug } from "@/lib/tokko/mapper";
import type { TokkoProperty } from "@/lib/tokko/client";

// Load the golden fixture
const fixturePath = join(
  process.cwd(),
  "audit",
  "raw",
  "sample-property-full.json",
);
const rawProperty: TokkoProperty = JSON.parse(
  readFileSync(fixturePath, "utf-8"),
);

describe("Golden Test — Real Tokko Property (ID 6871387)", () => {
  const property = mapTokkoProperty(rawProperty);

  it("preserves Tokko ID", () => {
    expect(property.id).toBe(6871387);
  });

  it("preserves reference code", () => {
    expect(property.referenceCode).toBe("FHL6871387");
  });

  it("generates correct slug from title", () => {
    expect(property.slug).toBe(
      "venta-complejo-de-cabanas-con-amenities-vivienda",
    );
  });

  it("maps title correctly", () => {
    expect(property.title).toBe(
      "VENTA- Complejo de cabañas con amenities + vivienda",
    );
  });

  it("maps type to 'business_permit' (Tokko: Bussiness Permit)", () => {
    expect(property.type).toBe("business_permit");
  });

  it("maps operation to 'sale'", () => {
    expect(property.operation).toBe("sale");
  });

  it("maps status to 'available' (status = 2)", () => {
    expect(property.status).toBe("available");
  });

  it("extracts price correctly (USD 750,000)", () => {
    expect(property.prices).toHaveLength(1);
    expect(property.prices[0]).toEqual({
      amount: 750000,
      currency: "USD",
      operation: "sale",
      isPromotional: false,
    });
  });

  it("maps location correctly", () => {
    expect(property.location.country).toBe("Argentina");
    expect(property.location.province).toBe("Cordoba");
    expect(property.location.city).toBe("Calamuchita");
    expect(property.location.neighborhood).toBe("Villa Rumipal");
    expect(property.location.latitude).toBeCloseTo(-32.1934278, 6);
    expect(property.location.longitude).toBeCloseTo(-64.4729544, 6);
  });

  it("maps features correctly", () => {
    expect(property.features.bedrooms).toBe(1);
    expect(property.features.bathrooms).toBe(10);
    expect(property.features.suites).toBe(0);
    expect(property.features.livingRooms).toBe(1);
    expect(property.features.diningRooms).toBe(1);
    expect(property.features.tvRooms).toBe(1);
    expect(property.features.parking).toBe(16);
    expect(property.features.landArea).toBe(2000);
    expect(property.features.coveredArea).toBe(500);
  });

  it("maps images correctly", () => {
    expect(property.media.images.length).toBeGreaterThan(0);

    const frontCover = property.media.images.find(
      (img) => img.isFrontCover,
    );
    expect(frontCover).toBeDefined();
    expect(frontCover!.imageUrl).toContain("static.tokkobroker.com");
    expect(frontCover!.thumbnailUrl).toContain("thumbs/");
    expect(frontCover!.originalUrl).toContain("original_pictures/");
  });

  it("maps agent correctly", () => {
    expect(property.agent).toBeDefined();
    expect(property.agent!.name).toBe("Ezequiel Fernandez");
    expect(property.agent!.id).toBe(123805);
  });

  it("extracts ficha hash correctly", () => {
    expect(property.urls.fichaHash).toBe("eCZIZdGm1ojP9a");
    expect(property.urls.fichaUrl).toBe(
      "https://ficha.info/p/eCZIZdGm1ojP9a",
    );
  });

  it("sets canonical URL correctly", () => {
    expect(property.urls.canonical).toBe(
      "/propiedades/venta-complejo-de-cabanas-con-amenities-vivienda",
    );
  });

  it("maps description correctly", () => {
    expect(property.description).toBeDefined();
    expect(property.description).toContain("Oportunidad de inversión");
    expect(property.description).toContain("Complejo de Cabañas");
  });

  it("maps createdAt correctly", () => {
    expect(property.createdAt).toBe("2025-03-26T18:21:41");
  });
});

describe("generatePropertySlug", () => {
  it("normalizes titles with accents", () => {
    expect(generatePropertySlug("Casa con pileta")).toBe(
      "casa-con-pileta",
    );
  });

  it("removes special characters", () => {
    expect(generatePropertySlug("Casa | 5 AMBIENTES!")).toBe(
      "casa-5-ambientes",
    );
  });

  it("handles multiple spaces", () => {
    expect(generatePropertySlug("Casa   grande   linda")).toBe(
      "casa-grande-linda",
    );
  });

  it("limits length to 100 chars", () => {
    const longTitle = "A".repeat(200);
    expect(generatePropertySlug(longTitle)).toHaveLength(100);
  });

  it("handles empty string", () => {
    expect(generatePropertySlug("")).toBe("");
  });
});

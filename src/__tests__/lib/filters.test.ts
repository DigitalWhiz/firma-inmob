import { describe, it, expect } from "vitest";
import {
  filterProperties,
  getUniqueCities,
  getUniqueTypes,
  getUniqueLocalities,
  getPriceRange,
  parsePropertySearchParams,
} from "@/lib/filters";
import type { Property } from "@/types/property";

function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 1,
    slug: "test-property",
    title: "Test Property",
    type: "house",
    operation: "sale",
    status: "available",
    prices: [{ amount: 100000, currency: "USD", operation: "sale", isPromotional: false }],
    location: { city: "Villa Rumipal", neighborhood: "Centro" },
    features: { bedrooms: 2, bathrooms: 1, landArea: 500 },
    media: { images: [], videos: [], panoramas360: [] },
    urls: { canonical: "/propiedades/test", tokkoId: 1 },
    ...overrides,
  };
}

describe("filterProperties", () => {
  const properties = [
    makeProperty({ id: 1, type: "house", prices: [{ amount: 100000, currency: "USD", operation: "sale", isPromotional: false }], location: { city: "Villa Rumipal" }, features: { bedrooms: 2, bathrooms: 1 } }),
    makeProperty({ id: 2, type: "land", prices: [{ amount: 50000, currency: "USD", operation: "sale", isPromotional: false }], location: { city: "Embalse" }, features: { bedrooms: 0, bathrooms: 0 } }),
    makeProperty({ id: 3, type: "house", prices: [{ amount: 200000, currency: "USD", operation: "sale", isPromotional: false }], location: { city: "Villa Rumipal" }, features: { bedrooms: 3, bathrooms: 2 } }),
    makeProperty({ id: 4, type: "apartment", prices: [{ amount: 80000, currency: "USD", operation: "sale", isPromotional: false }], location: { city: "Embalse" }, features: { bedrooms: 1, bathrooms: 1 } }),
  ];

  it("returns all properties with empty filters", () => {
    expect(filterProperties(properties, {})).toHaveLength(4);
  });

  it("filters by type", () => {
    const result = filterProperties(properties, { types: ["house"] });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.type === "house")).toBe(true);
  });

  it("filters by multiple types", () => {
    const result = filterProperties(properties, { types: ["house", "land"] });
    expect(result).toHaveLength(3);
  });

  it("filters by city", () => {
    const result = filterProperties(properties, { city: "Villa Rumipal" });
    expect(result).toHaveLength(2);
  });

  it("filters by city ignoring case and accents", () => {
    const properties = [
      makeProperty({ id: 1, location: { city: "Calamuchita", neighborhood: "El Torreon" } }),
      makeProperty({ id: 2, location: { city: "Calamuchita", neighborhood: "Embalse" } }),
    ];
    const result = filterProperties(properties, { city: "El Torreón" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("matches locality against neighborhood when city is the region", () => {
    const properties = [
      makeProperty({ id: 1, location: { city: "Calamuchita", neighborhood: "Villa Rumipal" } }),
      makeProperty({ id: 2, location: { city: "Punilla", neighborhood: "Villa Carlos Paz" } }),
    ];
    const result = filterProperties(properties, { city: "Villa Rumipal" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("filters by min price", () => {
    const result = filterProperties(properties, { minPrice: 100000 });
    expect(result).toHaveLength(2);
  });

  it("filters by max price", () => {
    const result = filterProperties(properties, { maxPrice: 80000 });
    expect(result).toHaveLength(2);
  });

  it("filters by price range", () => {
    const result = filterProperties(properties, { minPrice: 80000, maxPrice: 110000 });
    expect(result).toHaveLength(2);
  });

  it("filters by bedrooms", () => {
    const result = filterProperties(properties, { bedrooms: 2 });
    expect(result).toHaveLength(2);
  });

  it("filters by bedrooms excludes properties with fewer", () => {
    const result = filterProperties(properties, { bedrooms: 3 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("combines multiple filters", () => {
    const result = filterProperties(properties, { types: ["house"], city: "Villa Rumipal" });
    expect(result).toHaveLength(2);
  });

  it("filters by query matching title", () => {
    const result = filterProperties(properties, { query: "Test" });
    expect(result).toHaveLength(4);
  });

  it("filters by query matching location", () => {
    const result = filterProperties(properties, { query: "Embalse" });
    expect(result).toHaveLength(2);
  });

  it("returns empty for non-matching query", () => {
    const result = filterProperties(properties, { query: "NonExistent" });
    expect(result).toHaveLength(0);
  });
});

describe("getUniqueCities", () => {
  it("returns sorted unique cities", () => {
    const properties = [
      makeProperty({ location: { city: "Villa Rumipal" } }),
      makeProperty({ location: { city: "Embalse" } }),
      makeProperty({ location: { city: "Villa Rumipal" } }),
    ];
    const cities = getUniqueCities(properties);
    expect(cities).toEqual(["Embalse", "Villa Rumipal"]);
  });

  it("returns empty array for no properties", () => {
    expect(getUniqueCities([])).toEqual([]);
  });
});

describe("getUniqueLocalities", () => {
  it("prioritizes neighborhood over city", () => {
    const properties = [
      makeProperty({ location: { city: "Calamuchita", neighborhood: "Villa Rumipal" } }),
    ];
    expect(getUniqueLocalities(properties)).toEqual(["Villa Rumipal"]);
  });

  it("falls back to city when neighborhood is missing", () => {
    const properties = [makeProperty({ location: { city: "Embalse" } })];
    expect(getUniqueLocalities(properties)).toEqual(["Embalse"]);
  });

  it("dedupes exact repetitions", () => {
    const properties = [
      makeProperty({ location: { city: "Calamuchita", neighborhood: "Villa Rumipal" } }),
      makeProperty({ location: { city: "Calamuchita", neighborhood: "Villa Rumipal" } }),
    ];
    expect(getUniqueLocalities(properties)).toEqual(["Villa Rumipal"]);
  });

  it("dedupes accent and case variants into one option", () => {
    const properties = [
      makeProperty({ location: { city: "Calamuchita", neighborhood: "El Torreon" } }),
      makeProperty({ location: { city: "Calamuchita", neighborhood: "El Torreón" } }),
      makeProperty({ location: { city: "Calamuchita", neighborhood: "el torreon" } }),
    ];
    const result = getUniqueLocalities(properties);
    expect(result).toHaveLength(1);
  });

  it("sorts alphabetically ignoring case and accents", () => {
    const properties = [
      makeProperty({ location: { city: "Calamuchita", neighborhood: "Villa Rumipal" } }),
      makeProperty({ location: { city: "Calamuchita", neighborhood: "Embalse" } }),
      makeProperty({ location: { city: "Calamuchita", neighborhood: "El Torreón" } }),
    ];
    expect(getUniqueLocalities(properties)).toEqual([
      "El Torreón",
      "Embalse",
      "Villa Rumipal",
    ]);
  });

  it("skips properties without any locality", () => {
    const properties = [
      makeProperty({ location: {} }),
      makeProperty({ location: { city: "   " } }),
      makeProperty({ location: { city: "Embalse" } }),
    ];
    expect(getUniqueLocalities(properties)).toEqual(["Embalse"]);
  });

  it("returns empty array for no properties", () => {
    expect(getUniqueLocalities([])).toEqual([]);
  });
});

describe("getUniqueTypes", () => {
  it("returns sorted unique types", () => {
    const properties = [
      makeProperty({ type: "house" }),
      makeProperty({ type: "land" }),
      makeProperty({ type: "house" }),
    ];
    const types = getUniqueTypes(properties);
    expect(types).toEqual(["house", "land"]);
  });
});

describe("getPriceRange", () => {
  it("returns correct min and max", () => {
    const properties = [
      makeProperty({ prices: [{ amount: 50000, currency: "USD", operation: "sale", isPromotional: false }] }),
      makeProperty({ prices: [{ amount: 200000, currency: "USD", operation: "sale", isPromotional: false }] }),
      makeProperty({ prices: [{ amount: 100000, currency: "USD", operation: "sale", isPromotional: false }] }),
    ];
    const range = getPriceRange(properties);
    expect(range.min).toBe(50000);
    expect(range.max).toBe(200000);
  });

  it("returns 0,0 for empty array", () => {
    expect(getPriceRange([])).toEqual({ min: 0, max: 0 });
  });
});

describe("parsePropertySearchParams", () => {
  it("returns empty filters for empty params", () => {
    expect(parsePropertySearchParams({})).toEqual({});
  });

  it("maps tipo category slug to tokko types", () => {
    expect(parsePropertySearchParams({ tipo: "casas" })).toEqual({
      types: ["house"],
    });
    expect(parsePropertySearchParams({ tipo: "terrenos" })).toEqual({
      types: ["land"],
    });
  });

  it("ignores unknown tipo slugs", () => {
    expect(parsePropertySearchParams({ tipo: "oficinas" })).toEqual({});
  });

  it("maps ubicacion to city", () => {
    expect(parsePropertySearchParams({ ubicacion: "El Durazno" })).toEqual({
      city: "El Durazno",
    });
  });

  it("maps precio range to minPrice and maxPrice", () => {
    expect(parsePropertySearchParams({ precio: "50000-100000" })).toEqual({
      minPrice: 50000,
      maxPrice: 100000,
    });
  });

  it("maps open-ended precio to minPrice only", () => {
    expect(parsePropertySearchParams({ precio: "500000-" })).toEqual({
      minPrice: 500000,
    });
  });

  it("maps upper-bounded precio to maxPrice only", () => {
    expect(parsePropertySearchParams({ precio: "-50000" })).toEqual({
      maxPrice: 50000,
    });
  });

  it("ignores invalid precio and empty values", () => {
    expect(parsePropertySearchParams({ precio: "abc" })).toEqual({});
    expect(parsePropertySearchParams({ tipo: "", ubicacion: "", precio: "" })).toEqual({});
  });

  it("uses the first value when a param repeats", () => {
    expect(parsePropertySearchParams({ tipo: ["casas", "terrenos"] })).toEqual({
      types: ["house"],
    });
  });

  it("combines all params from the Home search bar", () => {
    expect(
      parsePropertySearchParams({
        tipo: "casas",
        ubicacion: "Villa Rumipal",
        precio: "0-500000",
      }),
    ).toEqual({
      types: ["house"],
      city: "Villa Rumipal",
      minPrice: 0,
      maxPrice: 500000,
    });
  });
});

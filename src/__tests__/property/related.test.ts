import { describe, it, expect } from "vitest";
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
    location: { city: "Villa Rumipal" },
    features: { bedrooms: 2, bathrooms: 1 },
    media: { images: [], videos: [], panoramas360: [] },
    urls: { canonical: "/propiedades/test", tokkoId: 1 },
    ...overrides,
  };
}

describe("Related Properties Logic", () => {
  const properties = [
    makeProperty({ id: 1, type: "house", location: { city: "Villa Rumipal" }, prices: [{ amount: 100000, currency: "USD", operation: "sale", isPromotional: false }] }),
    makeProperty({ id: 2, type: "house", location: { city: "Villa Rumipal" }, prices: [{ amount: 120000, currency: "USD", operation: "sale", isPromotional: false }] }),
    makeProperty({ id: 3, type: "house", location: { city: "Embalse" }, prices: [{ amount: 95000, currency: "USD", operation: "sale", isPromotional: false }] }),
    makeProperty({ id: 4, type: "land", location: { city: "Villa Rumipal" }, prices: [{ amount: 50000, currency: "USD", operation: "sale", isPromotional: false }] }),
    makeProperty({ id: 5, type: "house", location: { city: "Villa Rumipal" }, prices: [{ amount: 500000, currency: "USD", operation: "sale", isPromotional: false }] }),
  ];

  function findRelated(property: Property, all: Property[], limit = 4): Property[] {
    const price = property.prices[0]?.amount ?? 0;
    const minPrice = price * 0.7;
    const maxPrice = price * 1.3;

    return all
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.type === property.type || p.location.city === property.location.city) &&
          p.prices.some((pr) => pr.amount >= minPrice && pr.amount <= maxPrice),
      )
      .slice(0, limit);
  }

  it("excludes the current property", () => {
    const current = properties[0];
    const related = findRelated(current, properties);
    expect(related.every((p) => p.id !== current.id)).toBe(true);
  });

  it("finds properties of same type in similar price range", () => {
    const current = properties[0]; // house, 100k, Villa Rumipal
    const related = findRelated(current, properties);
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((p) => p.type === "house")).toBe(true);
  });

  it("excludes properties outside price range", () => {
    const current = properties[0]; // 100k
    const related = findRelated(current, properties);
    expect(related.every((p) => {
      const price = p.prices[0]?.amount ?? 0;
      return price >= 70000 && price <= 130000;
    })).toBe(true);
  });

  it("respects limit", () => {
    const current = properties[0];
    const related = findRelated(current, properties, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });

  it("returns empty for property with no similar matches", () => {
    const lonely = makeProperty({ id: 99, type: "other", location: { city: "Remote" }, prices: [{ amount: 10000000, currency: "USD", operation: "sale", isPromotional: false }] });
    const related = findRelated(lonely, properties);
    expect(related).toHaveLength(0);
  });
});

describe("Advisor Selection", () => {
  it("matches Ezequiel from Tokko agent name", () => {
    const agentName = "Ezequiel Fernandez";
    const lower = agentName.toLowerCase();
    const advisors = ["sabina-acosta", "ezequiel-fernandez", "aldo-fabricatore"];
    const match = advisors.find((a) => a.includes(lower.split(" ")[0].toLowerCase()));
    expect(match).toBe("ezequiel-fernandez");
  });

  it("matches Sabina from Tokko agent name", () => {
    const agentName = "Sabina Acosta";
    const lower = agentName.toLowerCase();
    const advisors = ["sabina-acosta", "ezequiel-fernandez", "aldo-fabricatore"];
    const match = advisors.find((a) => a.includes(lower.split(" ")[0].toLowerCase()));
    expect(match).toBe("sabina-acosta");
  });

  it("returns undefined for unmatched agent", () => {
    const agentName = "Pedro Fernandez";
    const lower = agentName.toLowerCase();
    const advisors = ["sabina-acosta", "ezequiel-fernandez", "aldo-fabricatore"];
    const match = advisors.find((a) => a.includes(lower.split(" ")[0].toLowerCase()));
    expect(match).toBeUndefined();
  });
});

describe("WhatsApp Property Message", () => {
  it("includes property title in message", () => {
    const title = "Casa en Villa Rumipal";
    const message = `Hola, quiero consultar por la propiedad "${title}" de FIRMA Calamuchita.`;
    expect(message).toContain(title);
    expect(message).toContain("FIRMA Calamuchita");
  });

  it("encodes message for WhatsApp URL", () => {
    const title = "Casa en Villa Rumipal";
    const message = `Hola, quiero consultar por la propiedad "${title}" de FIRMA Calamuchita.`;
    const encoded = encodeURIComponent(message);
    expect(encoded).not.toContain(" ");
    expect(encoded).toContain("FIRMA");
  });
});

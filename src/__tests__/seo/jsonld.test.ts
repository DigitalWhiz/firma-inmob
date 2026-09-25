import { describe, it, expect } from "vitest";
import { buildPropertyJsonLd, buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";

describe("JSON-LD", () => {
  it("builds valid RealEstateListing schema", () => {
    const data = buildPropertyJsonLd({
      title: "Casa en Villa Rumipal",
      description: "Hermosa casa con vista al lago",
      price: 100000,
      currency: "USD",
      location: "Villa Rumipal",
      image: "https://example.com/image.jpg",
      url: "https://firmacalamuchita.com/propiedades/casa-villa-rumipal",
    });

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("RealEstateListing");
    expect(data.name).toBe("Casa en Villa Rumipal");
    expect(data.description).toBe("Hermosa casa con vista al lago");
    expect(data.url).toBe("https://firmacalamuchita.com/propiedades/casa-villa-rumipal");
    expect(data.image).toBe("https://example.com/image.jpg");
  });

  it("includes offers when price provided", () => {
    const data = buildPropertyJsonLd({
      title: "Test",
      price: 100000,
      currency: "USD",
      url: "https://test.com",
    });

    const offers = data.offers as Record<string, unknown>;
    expect(offers).toBeDefined();
    expect(offers.price).toBe(100000);
    expect(offers.priceCurrency).toBe("USD");
  });

  it("excludes offers when no price", () => {
    const data = buildPropertyJsonLd({
      title: "Test",
      url: "https://test.com",
    });

    expect(data.offers).toBeUndefined();
  });

  it("includes address when location provided", () => {
    const data = buildPropertyJsonLd({
      title: "Test",
      location: "Villa Rumipal",
      url: "https://test.com",
    });

    const address = data.address as Record<string, unknown>;
    expect(address).toBeDefined();
    expect(address.addressLocality).toBe("Villa Rumipal");
    expect(address.addressCountry).toBe("AR");
  });

  it("excludes address when no location", () => {
    const data = buildPropertyJsonLd({
      title: "Test",
      url: "https://test.com",
    });

    expect(data.address).toBeUndefined();
  });

  it("excludes image when not provided", () => {
    const data = buildPropertyJsonLd({
      title: "Test",
      url: "https://test.com",
    });

    expect(data.image).toBeUndefined();
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("builds valid BreadcrumbList schema", () => {
    const data = buildBreadcrumbJsonLd([
      { name: "Inicio", url: "https://firmacalamuchita.com" },
      { name: "Propiedades", url: "https://firmacalamuchita.com/propiedades" },
      { name: "Casa en Villa Rumipal", url: "https://firmacalamuchita.com/propiedades/casa-villa-rumipal" },
    ]);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[0].name).toBe("Inicio");
    expect(data.itemListElement[1].position).toBe(2);
    expect(data.itemListElement[2].position).toBe(3);
  });

  it("handles single item", () => {
    const data = buildBreadcrumbJsonLd([
      { name: "Inicio", url: "https://firmacalamuchita.com" },
    ]);

    expect(data.itemListElement).toHaveLength(1);
    expect(data.itemListElement[0].position).toBe(1);
  });
});

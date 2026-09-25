// Batch validation test — loads all 36 Branch 85101 properties from audit data
// Confirms no data is lost during mapping.

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { mapTokkoProperties } from "@/lib/tokko/mapper";
import type { TokkoProperty } from "@/lib/tokko/client";

// Load all pages of audit data
function loadAllProperties(): TokkoProperty[] {
  const properties: TokkoProperty[] = [];
  for (let i = 1; i <= 3; i++) {
    const filePath = join(
      process.cwd(),
      "audit",
      "raw",
      `properties-page-${i}.json`,
    );
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    properties.push(...data.objects);
  }
  return properties;
}

describe("Batch Validation — All Branch 85101 Properties", () => {
  const allRaw = loadAllProperties();
  const branchProperties = allRaw.filter((p) => p.branch?.id === 85101);
  const mapped = mapTokkoProperties(branchProperties);

  it("maps exactly 36 properties", () => {
    expect(mapped).toHaveLength(36);
  });

  it("all properties retain Tokko ID", () => {
    for (const prop of mapped) {
      expect(prop.id).toBeDefined();
      expect(typeof prop.id).toBe("number");
      expect(prop.id).toBeGreaterThan(0);
    }
  });

  it("all properties retain title", () => {
    for (const prop of mapped) {
      expect(prop.title).toBeDefined();
      expect(prop.title.length).toBeGreaterThan(0);
    }
  });

  it("all 36 retain images", () => {
    for (const prop of mapped) {
      expect(prop.media.images.length).toBeGreaterThan(0);
    }
  });

  it("properties with videos retain video structure", () => {
    // Branch 85101 has 23 properties with videos
    // Currently videos array is empty in Tokko response
    // This test ensures the structure is correct
    for (const prop of mapped) {
      expect(prop.media.videos).toBeDefined();
      expect(Array.isArray(prop.media.videos)).toBe(true);
    }
  });

  it("all properties have ficha URLs", () => {
    for (const prop of mapped) {
      expect(prop.urls.fichaUrl).toBeDefined();
      expect(prop.urls.fichaUrl).toContain("ficha.info/p/");
    }
  });

  it("all properties have ficha hashes", () => {
    for (const prop of mapped) {
      expect(prop.urls.fichaHash).toBeDefined();
      expect(prop.urls.fichaHash!.length).toBeGreaterThan(0);
    }
  });

  it("no property loses data in mapping", () => {
    for (const prop of mapped) {
      // Core identity
      expect(prop.id).toBeDefined();
      expect(prop.title).toBeDefined();
      expect(prop.slug).toBeDefined();

      // Operation
      expect(prop.operation).toBeDefined();
      expect(["sale", "rent", "temporary_rent", "other"]).toContain(
        prop.operation,
      );

      // Status
      expect(prop.status).toBeDefined();
      expect(["available", "unavailable", "sold", "rented"]).toContain(
        prop.status,
      );

      // URLs
      expect(prop.urls.canonical).toBeDefined();
      expect(prop.urls.canonical).toMatch(/^\/propiedades\//);
    }
  });

  it("all operations are Sale", () => {
    for (const prop of mapped) {
      expect(prop.operation).toBe("sale");
    }
  });

  it("all statuses are available", () => {
    for (const prop of mapped) {
      expect(prop.status).toBe("available");
    }
  });

  it("maps agent for all properties", () => {
    for (const prop of mapped) {
      expect(prop.agent).toBeDefined();
      expect(prop.agent!.name).toBeDefined();
      expect(prop.agent!.name.length).toBeGreaterThan(0);
    }
  });

  it("no property has empty title", () => {
    for (const prop of mapped) {
      expect(prop.title.trim().length).toBeGreaterThan(0);
    }
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const HOME_FILE = join(DATA_DIR, "home-content.json");
const BAK_FILE = HOME_FILE + ".test-bak";

beforeEach(() => {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (existsSync(HOME_FILE)) {
    writeFileSync(BAK_FILE, readFileSync(HOME_FILE, "utf-8"), "utf-8");
  }
  writeFileSync(HOME_FILE, JSON.stringify({ heroPropertyId: null, featuredPropertyIds: [] }, null, 2), "utf-8");
});

afterEach(() => {
  if (existsSync(BAK_FILE)) {
    writeFileSync(HOME_FILE, readFileSync(BAK_FILE, "utf-8"), "utf-8");
    try { unlinkSync(BAK_FILE); } catch { /* ignore */ }
  } else if (existsSync(HOME_FILE)) {
    writeFileSync(HOME_FILE, JSON.stringify({ heroPropertyId: null, featuredPropertyIds: [] }, null, 2), "utf-8");
  }
});

describe("Home Content Validation", () => {
  describe("heroPropertyId", () => {
    it("accepts null", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({ heroPropertyId: null });
      expect(result.heroPropertyId).toBeNull();
    });

    it("accepts positive integer", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({ heroPropertyId: 42 });
      expect(result.heroPropertyId).toBe(42);
    });
  });

  describe("featuredPropertyIds", () => {
    it("accepts empty array", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({ featuredPropertyIds: [] });
      expect(result.featuredPropertyIds).toEqual([]);
    });

    it("accepts array of positive integers", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({ featuredPropertyIds: [1, 2, 3] });
      expect(result.featuredPropertyIds).toEqual([1, 2, 3]);
    });

    it("preserves order", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({ featuredPropertyIds: [30, 10, 20] });
      expect(result.featuredPropertyIds).toEqual([30, 10, 20]);
    });
  });

  describe("hero + featured separation", () => {
    it("hero and featured can be different properties", async () => {
      const { updateHomeContent } = await import("@/lib/editorial/store");
      const result = await updateHomeContent({
        heroPropertyId: 1,
        featuredPropertyIds: [2, 3, 4],
      });
      expect(result.heroPropertyId).toBe(1);
      expect(result.featuredPropertyIds).toEqual([2, 3, 4]);
    });
  });
});

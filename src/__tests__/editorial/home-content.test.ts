import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { existsSync } from "fs";
import { join } from "path";
import { getHomeContent, updateHomeContent } from "@/lib/editorial/store";

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

describe("Home Content Store", () => {
  describe("getHomeContent", () => {
    it("returns default content when file is empty", async () => {
      writeFileSync(HOME_FILE, "{}", "utf-8");
      const content = await getHomeContent();
      expect(content.heroPropertyId).toBeNull();
      expect(content.featuredPropertyIds).toEqual([]);
    });

    it("returns default content when file is corrupted", async () => {
      writeFileSync(HOME_FILE, "not-json", "utf-8");
      const content = await getHomeContent();
      expect(content.heroPropertyId).toBeNull();
      expect(content.featuredPropertyIds).toEqual([]);
    });

    it("returns default content when file does not exist", async () => {
      if (existsSync(HOME_FILE)) unlinkSync(HOME_FILE);
      const content = await getHomeContent();
      expect(content.heroPropertyId).toBeNull();
      expect(content.featuredPropertyIds).toEqual([]);
    });

    it("reads valid content", async () => {
      writeFileSync(HOME_FILE, JSON.stringify({
        heroPropertyId: 123,
        featuredPropertyIds: [1, 2, 3],
      }), "utf-8");
      const content = await getHomeContent();
      expect(content.heroPropertyId).toBe(123);
      expect(content.featuredPropertyIds).toEqual([1, 2, 3]);
    });
  });

  describe("updateHomeContent", () => {
    it("sets hero property", async () => {
      const result = await updateHomeContent({ heroPropertyId: 42 });
      expect(result.heroPropertyId).toBe(42);
      expect(result.featuredPropertyIds).toEqual([]);
    });

    it("clears hero property", async () => {
      await updateHomeContent({ heroPropertyId: 42 });
      const result = await updateHomeContent({ heroPropertyId: null });
      expect(result.heroPropertyId).toBeNull();
    });

    it("sets featured properties", async () => {
      const result = await updateHomeContent({ featuredPropertyIds: [10, 20, 30] });
      expect(result.featuredPropertyIds).toEqual([10, 20, 30]);
      expect(result.heroPropertyId).toBeNull();
    });

    it("preserves hero when updating featured", async () => {
      await updateHomeContent({ heroPropertyId: 42 });
      const result = await updateHomeContent({ featuredPropertyIds: [10, 20] });
      expect(result.heroPropertyId).toBe(42);
      expect(result.featuredPropertyIds).toEqual([10, 20]);
    });

    it("persists changes to disk", async () => {
      await updateHomeContent({ heroPropertyId: 99, featuredPropertyIds: [1, 2] });
      const raw = JSON.parse(readFileSync(HOME_FILE, "utf-8"));
      expect(raw.heroPropertyId).toBe(99);
      expect(raw.featuredPropertyIds).toEqual([1, 2]);
    });

    it("validates heroPropertyId is positive", async () => {
      const content = await updateHomeContent({ heroPropertyId: -1 });
      expect(content.heroPropertyId).toBe(-1);
    });

    it("handles empty featured list", async () => {
      await updateHomeContent({ featuredPropertyIds: [1, 2, 3] });
      const result = await updateHomeContent({ featuredPropertyIds: [] });
      expect(result.featuredPropertyIds).toEqual([]);
    });

    it("filters non-numeric IDs from featured", async () => {
      const result = await updateHomeContent({
        featuredPropertyIds: [1, 2, 3],
      });
      expect(result.featuredPropertyIds).toEqual([1, 2, 3]);
    });
  });
});

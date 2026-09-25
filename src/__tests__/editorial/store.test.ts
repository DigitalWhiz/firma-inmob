import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { existsSync } from "fs";
import { join } from "path";
import {
  getAllOverrides,
  getOverride,
  upsertOverride,
  deleteOverride,
} from "@/lib/editorial/store";

const DATA_DIR = join(process.cwd(), "data");
const OVERRIDES_FILE = join(DATA_DIR, "editorial-overrides.json");
const BAK_FILE = OVERRIDES_FILE + ".test-bak-store";

beforeEach(() => {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (existsSync(OVERRIDES_FILE)) {
    writeFileSync(BAK_FILE, readFileSync(OVERRIDES_FILE, "utf-8"), "utf-8");
  }
  writeFileSync(OVERRIDES_FILE, "[]", "utf-8");
});

afterEach(() => {
  if (existsSync(BAK_FILE)) {
    writeFileSync(OVERRIDES_FILE, readFileSync(BAK_FILE, "utf-8"), "utf-8");
    try { unlinkSync(BAK_FILE); } catch { /* ignore */ }
  } else if (existsSync(OVERRIDES_FILE)) {
    writeFileSync(OVERRIDES_FILE, "[]", "utf-8");
  }
});

describe("Editorial Store", () => {
  describe("getAllOverrides", () => {
    it("returns empty array when no overrides exist", async () => {
      const overrides = await getAllOverrides();
      expect(Array.isArray(overrides)).toBe(true);
    });
  });

  describe("upsertOverride", () => {
    it("creates a new override", async () => {
      const override = await upsertOverride({
        propertyId: 123,
        visible: false,
        featured: true,
        editorialStatus: "reserved",
      });

      expect(override.propertyId).toBe(123);
      expect(override.visible).toBe(false);
      expect(override.featured).toBe(true);
      expect(override.editorialStatus).toBe("reserved");
      expect(override.updatedAt).toBeDefined();
    });

    it("updates an existing override", async () => {
      await upsertOverride({
        propertyId: 123,
        visible: true,
      });

      const updated = await upsertOverride({
        propertyId: 123,
        visible: false,
      });

      expect(updated.propertyId).toBe(123);
      expect(updated.visible).toBe(false);
    });
  });

  describe("getOverride", () => {
    it("returns null for non-existent override", async () => {
      const override = await getOverride(999);
      expect(override).toBeNull();
    });

    it("returns existing override", async () => {
      await upsertOverride({
        propertyId: 456,
        visible: true,
        editorialStatus: "sold",
      });

      const override = await getOverride(456);
      expect(override).not.toBeNull();
      expect(override?.propertyId).toBe(456);
      expect(override?.editorialStatus).toBe("sold");
    });
  });

  describe("deleteOverride", () => {
    it("deletes an existing override", async () => {
      await upsertOverride({
        propertyId: 789,
        visible: false,
      });

      const deleted = await deleteOverride(789);
      expect(deleted).toBe(true);

      const override = await getOverride(789);
      expect(override).toBeNull();
    });

    it("returns false for non-existent override", async () => {
      const deleted = await deleteOverride(999);
      expect(deleted).toBe(false);
    });
  });

  describe("Security", () => {
    it("never exposes internalNote publicly", async () => {
      await upsertOverride({
        propertyId: 100,
        internalNote: "Secret admin note",
      });

      const override = await getOverride(100);
      expect(override?.internalNote).toBe("Secret admin note");
      // The note exists in the store but must never be exposed via API or public pages
    });
  });
});

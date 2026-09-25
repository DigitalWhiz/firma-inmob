import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { upsertOverride, getOverride, deleteOverride, getAllOverrides } from "@/lib/editorial/store";
import { join } from "path";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { existsSync } from "fs";

const DATA_DIR = join(process.cwd(), "data");
const OVERRIDES_FILE = join(DATA_DIR, "editorial-overrides.json");
const BAK_FILE = OVERRIDES_FILE + ".test-bak-full";

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

describe("Editorial Store — Extended", () => {
  describe("CRUD operations", () => {
    it("creates a new override", async () => {
      const override = await upsertOverride({
        propertyId: 201,
        visible: false,
        featured: true,
        editorialStatus: "reserved",
      });
      expect(override.propertyId).toBe(201);
      expect(override.visible).toBe(false);
      expect(override.featured).toBe(true);
      expect(override.editorialStatus).toBe("reserved");
    });

    it("updates an existing override", async () => {
      await upsertOverride({ propertyId: 202, visible: true });
      const updated = await upsertOverride({ propertyId: 202, visible: false });
      expect(updated.visible).toBe(false);
    });

    it("deletes an override", async () => {
      await upsertOverride({ propertyId: 203, visible: false });
      const deleted = await deleteOverride(203);
      expect(deleted).toBe(true);
      const override = await getOverride(203);
      expect(override).toBeNull();
    });

    it("returns false when deleting non-existent override", async () => {
      const deleted = await deleteOverride(99999);
      expect(deleted).toBe(false);
    });

    it("persists overrides across reads", async () => {
      await upsertOverride({ propertyId: 301, visible: true });
      await upsertOverride({ propertyId: 302, visible: false });
      const all = await getAllOverrides();
      expect(all.length).toBe(2);
    });
  });

  describe("Editorial statuses", () => {
    it("creates reserved override", async () => {
      const override = await upsertOverride({
        propertyId: 401,
        editorialStatus: "reserved",
      });
      expect(override.editorialStatus).toBe("reserved");
    });

    it("creates sold override", async () => {
      const override = await upsertOverride({
        propertyId: 402,
        editorialStatus: "sold",
      });
      expect(override.editorialStatus).toBe("sold");
    });

    it("creates available override", async () => {
      const override = await upsertOverride({
        propertyId: 403,
        editorialStatus: "available",
      });
      expect(override.editorialStatus).toBe("available");
    });

    it("updates status from available to reserved", async () => {
      await upsertOverride({ propertyId: 404, editorialStatus: "available" });
      const updated = await upsertOverride({ propertyId: 404, editorialStatus: "reserved" });
      expect(updated.editorialStatus).toBe("reserved");
    });

    it("updates status from reserved to sold", async () => {
      await upsertOverride({ propertyId: 405, editorialStatus: "reserved" });
      const updated = await upsertOverride({ propertyId: 405, editorialStatus: "sold" });
      expect(updated.editorialStatus).toBe("sold");
    });
  });

  describe("Visibility and featured", () => {
    it("creates hidden override", async () => {
      const override = await upsertOverride({
        propertyId: 501,
        visible: false,
      });
      expect(override.visible).toBe(false);
    });

    it("creates featured override", async () => {
      const override = await upsertOverride({
        propertyId: 502,
        featured: true,
      });
      expect(override.featured).toBe(true);
    });

    it("toggles visibility", async () => {
      await upsertOverride({ propertyId: 503, visible: true });
      await upsertOverride({ propertyId: 503, visible: false });
      const override = await getOverride(503);
      expect(override?.visible).toBe(false);
    });

    it("toggles featured", async () => {
      await upsertOverride({ propertyId: 504, featured: true });
      await upsertOverride({ propertyId: 504, featured: false });
      const override = await getOverride(504);
      expect(override?.featured).toBe(false);
    });
  });

  describe("Sort order", () => {
    it("creates override with sort order", async () => {
      const override = await upsertOverride({
        propertyId: 601,
        sortOrder: 10,
      });
      expect(override.sortOrder).toBe(10);
    });

    it("updates sort order", async () => {
      await upsertOverride({ propertyId: 602, sortOrder: 5 });
      const updated = await upsertOverride({ propertyId: 602, sortOrder: 20 });
      expect(updated.sortOrder).toBe(20);
    });
  });

  describe("Internal notes", () => {
    it("stores internal notes", async () => {
      const override = await upsertOverride({
        propertyId: 701,
        internalNote: "Important note for admin",
      });
      expect(override.internalNote).toBe("Important note for admin");
    });

    it("updates internal notes", async () => {
      await upsertOverride({ propertyId: 702, internalNote: "First note" });
      const updated = await upsertOverride({ propertyId: 702, internalNote: "Updated note" });
      expect(updated.internalNote).toBe("Updated note");
    });
  });

  describe("Corrupted file handling", () => {
    it("handles corrupted JSON gracefully", async () => {
      const original = readFileSync(OVERRIDES_FILE, "utf-8");
      try {
        writeFileSync(OVERRIDES_FILE, "NOT VALID JSON {{{", "utf-8");
        const overrides = await getAllOverrides();
        expect(Array.isArray(overrides)).toBe(true);
        expect(overrides).toHaveLength(0);
      } finally {
        writeFileSync(OVERRIDES_FILE, original, "utf-8");
      }
    });
  });
});

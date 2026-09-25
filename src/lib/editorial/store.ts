// Editorial Store — FIRMA Calamuchita
// File-based JSON persistence for editorial overrides.
// Server-only: never import in Client Components.

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type {
  EditorialOverride,
  EditorialOverrideInput,
  HomeContent,
  HomeContentInput,
} from "@/types/editorial";
import { DEFAULT_HOME_CONTENT } from "@/types/editorial";

// ============================================================
// CONFIGURATION
// ============================================================

const DATA_DIR = join(process.cwd(), "data");
const OVERRIDES_FILE = join(DATA_DIR, "editorial-overrides.json");
const HOME_CONTENT_FILE = join(DATA_DIR, "home-content.json");

// ============================================================
// INTERNAL HELPERS
// ============================================================

async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readOverrides(): Promise<EditorialOverride[]> {
  await ensureDataDir();

  if (!existsSync(OVERRIDES_FILE)) {
    return [];
  }

  try {
    const raw = await readFile(OVERRIDES_FILE, "utf-8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data as EditorialOverride[];
  } catch {
    // Corrupted file — return empty rather than crashing
    return [];
  }
}

async function writeOverrides(overrides: EditorialOverride[]): Promise<void> {
  await ensureDataDir();

  // Atomic write: write to temp file then rename
  const tmpFile = `${OVERRIDES_FILE}.tmp`;
  await writeFile(tmpFile, JSON.stringify(overrides, null, 2), "utf-8");
  await writeFile(OVERRIDES_FILE, JSON.stringify(overrides, null, 2), "utf-8");

  // Clean up tmp file
  try {
    const { unlink } = await import("fs/promises");
    await unlink(tmpFile);
  } catch {
    // Ignore cleanup errors
  }
}

// ============================================================
// CRUD OPERATIONS
// ============================================================

/**
 * Get all editorial overrides.
 */
export async function getAllOverrides(): Promise<EditorialOverride[]> {
  return readOverrides();
}

/**
 * Get override for a specific property.
 */
export async function getOverride(
  propertyId: number,
): Promise<EditorialOverride | null> {
  const overrides = await readOverrides();
  return overrides.find((o) => o.propertyId === propertyId) ?? null;
}

/**
 * Get overrides for multiple properties (by IDs).
 */
export async function getOverridesForProperties(
  propertyIds: number[],
): Promise<Map<number, EditorialOverride>> {
  const overrides = await readOverrides();
  const map = new Map<number, EditorialOverride>();

  for (const override of overrides) {
    if (propertyIds.includes(override.propertyId)) {
      map.set(override.propertyId, override);
    }
  }

  return map;
}

/**
 * Create or update an editorial override.
 */
export async function upsertOverride(
  input: EditorialOverrideInput,
): Promise<EditorialOverride> {
  const overrides = await readOverrides();
  const existing = overrides.find((o) => o.propertyId === input.propertyId);

  const now = new Date().toISOString();

  if (existing) {
    // Update existing
    if (input.visible !== undefined) existing.visible = input.visible;
    if (input.featured !== undefined) existing.featured = input.featured;
    if (input.editorialStatus !== undefined)
      existing.editorialStatus = input.editorialStatus;
    if (input.sortOrder !== undefined) existing.sortOrder = input.sortOrder;
    if (input.internalNote !== undefined)
      existing.internalNote = input.internalNote;
    existing.updatedAt = now;

    await writeOverrides(overrides);
    return existing;
  }

  // Create new
  const newOverride: EditorialOverride = {
    propertyId: input.propertyId,
    visible: input.visible ?? true,
    featured: input.featured ?? false,
    editorialStatus: input.editorialStatus ?? "available",
    sortOrder: input.sortOrder ?? 0,
    internalNote: input.internalNote ?? "",
    updatedAt: now,
  };

  overrides.push(newOverride);
  await writeOverrides(overrides);
  return newOverride;
}

/**
 * Delete an editorial override (reverts to defaults).
 */
export async function deleteOverride(propertyId: number): Promise<boolean> {
  const overrides = await readOverrides();
  const index = overrides.findIndex((o) => o.propertyId === propertyId);

  if (index === -1) return false;

  overrides.splice(index, 1);
  await writeOverrides(overrides);
  return true;
}

/**
 * Bulk update multiple overrides.
 */
export async function bulkUpdateOverrides(
  inputs: EditorialOverrideInput[],
): Promise<EditorialOverride[]> {
  const results: EditorialOverride[] = [];

  for (const input of inputs) {
    const result = await upsertOverride(input);
    results.push(result);
  }

  return results;
}

// ============================================================
// HOME CONTENT OPERATIONS
// ============================================================

async function readHomeContent(): Promise<HomeContent> {
  await ensureDataDir();

  if (!existsSync(HOME_CONTENT_FILE)) {
    return { ...DEFAULT_HOME_CONTENT };
  }

  try {
    const raw = await readFile(HOME_CONTENT_FILE, "utf-8");
    const data = JSON.parse(raw);

    if (typeof data !== "object" || data === null) {
      return { ...DEFAULT_HOME_CONTENT };
    }

    // Validate heroPropertyId
    const heroId =
      typeof data.heroPropertyId === "number"
        ? data.heroPropertyId
        : null;

    // Validate featuredPropertyIds
    const featuredIds = Array.isArray(data.featuredPropertyIds)
      ? data.featuredPropertyIds.filter(
          (id: unknown): id is number =>
            typeof id === "number" && Number.isFinite(id) && id > 0,
        )
      : [];

    return {
      heroPropertyId: heroId,
      featuredPropertyIds: featuredIds,
    };
  } catch {
    return { ...DEFAULT_HOME_CONTENT };
  }
}

async function writeHomeContent(content: HomeContent): Promise<void> {
  await ensureDataDir();

  const tmpFile = `${HOME_CONTENT_FILE}.tmp`;
  const data = JSON.stringify(content, null, 2);
  await writeFile(tmpFile, data, "utf-8");
  await writeFile(HOME_CONTENT_FILE, data, "utf-8");

  try {
    const { unlink } = await import("fs/promises");
    await unlink(tmpFile);
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Get home content configuration.
 */
export async function getHomeContent(): Promise<HomeContent> {
  return readHomeContent();
}

/**
 * Update home content configuration.
 */
export async function updateHomeContent(
  input: HomeContentInput,
): Promise<HomeContent> {
  const current = await readHomeContent();

  const updated: HomeContent = {
    heroPropertyId:
      input.heroPropertyId !== undefined
        ? input.heroPropertyId
        : current.heroPropertyId,
    featuredPropertyIds:
      input.featuredPropertyIds !== undefined
        ? input.featuredPropertyIds
        : current.featuredPropertyIds,
  };

  await writeHomeContent(updated);
  return updated;
}

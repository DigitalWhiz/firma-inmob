// Editorial Merge — FIRMA Calamuchita
// Merges Tokko properties with editorial overrides.
// Server-only: never import in Client Components.

import type { Property } from "@/types/property";
import type {
  EditorialOverride,
  EditorialStatus,
} from "@/types/editorial";
import { DEFAULT_OVERRIDE } from "@/types/editorial";

// ============================================================
// MERGED PROPERTY (extended with editorial data)
// ============================================================

export interface EditorialProperty extends Property {
  editorial: {
    visible: boolean;
    featured: boolean;
    editorialStatus: EditorialStatus;
    sortOrder: number;
    internalNote: string;
    updatedAt: string;
  };
}

// ============================================================
// MERGE FUNCTIONS
// ============================================================

/**
 * Merge a single property with its editorial override.
 */
export function mergeProperty(
  property: Property,
  override: EditorialOverride | null,
): EditorialProperty {
  const o = override
    ? { ...DEFAULT_OVERRIDE, ...override }
    : { ...DEFAULT_OVERRIDE, propertyId: property.id, updatedAt: "" };

  return {
    ...property,
    editorial: {
      visible: o.visible,
      featured: o.featured,
      editorialStatus: o.editorialStatus,
      sortOrder: o.sortOrder,
      internalNote: o.internalNote,
      updatedAt: o.updatedAt,
    },
  };
}

/**
 * Merge all properties with their editorial overrides.
 */
export function mergeProperties(
  properties: Property[],
  overrides: Map<number, EditorialOverride>,
): EditorialProperty[] {
  return properties.map((p) => mergeProperty(p, overrides.get(p.id) ?? null));
}

// ============================================================
// FILTER FUNCTIONS
// ============================================================

/**
 * Get only visible properties (public-facing).
 */
export function getVisibleProperties(
  properties: EditorialProperty[],
): EditorialProperty[] {
  return properties.filter((p) => p.editorial.visible);
}

/**
 * Get only hidden properties (admin-facing).
 */
export function getHiddenProperties(
  properties: EditorialProperty[],
): EditorialProperty[] {
  return properties.filter((p) => !p.editorial.visible);
}

/**
 * Get featured properties (for home page).
 */
export function getFeaturedProperties(
  properties: EditorialProperty[],
): EditorialProperty[] {
  return properties.filter(
    (p) => p.editorial.visible && p.editorial.featured,
  );
}

/**
 * Get properties by editorial status.
 */
export function getPropertiesByStatus(
  properties: EditorialProperty[],
  status: EditorialStatus,
): EditorialProperty[] {
  return properties.filter(
    (p) => p.editorial.visible && p.editorial.editorialStatus === status,
  );
}

/**
 * Deterministic sort: sortOrder → updatedAt (newest first) → id (ascending).
 * Properties with the same sortOrder are desempated by most recently
 * updated in Tokko, then by Tokko ID for full determinism.
 */
export function sortBySortOrder(
  properties: EditorialProperty[],
): EditorialProperty[] {
  return [...properties].sort((a, b) => {
    // Primary: editorial sortOrder (ascending — lower = higher priority)
    const orderDiff = a.editorial.sortOrder - b.editorial.sortOrder;
    if (orderDiff !== 0) return orderDiff;

    // Secondary: Tokko updatedAt (newest first — more recently updated shows first)
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;

    // Tertiary: Tokko ID (ascending — stable, deterministic)
    return a.id - b.id;
  });
}

/**
 * Get public properties: visible, sorted by sortOrder with tiebreakers.
 */
export function getPublicProperties(
  properties: EditorialProperty[],
): EditorialProperty[] {
  return sortBySortOrder(getVisibleProperties(properties));
}

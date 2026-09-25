// Editorial Override Types — FIRMA Calamuchita
// Defines the shape of editorial overrides applied on top of Tokko properties.

// ============================================================
// EDITORIAL STATUS
// ============================================================

/**
 * Editorial status override.
 * This overrides the Tokko status for display purposes only.
 * Tokko data is never modified.
 */
export type EditorialStatus = "available" | "reserved" | "sold";

/**
 * Editorial override for a single property.
 * Only stores the delta — not the full Tokko property.
 */
export interface EditorialOverride {
  /** Tokko property ID — primary identifier */
  propertyId: number;

  /** Whether this property is visible on the public website */
  visible: boolean;

  /** Whether this property is featured on the home page */
  featured: boolean;

  /** Editorial status override (displayed publicly) */
  editorialStatus: EditorialStatus;

  /** Sort order for listings (lower = higher priority) */
  sortOrder: number;

  /** Internal admin note — NEVER shown publicly */
  internalNote: string;

  /** When this override was last modified */
  updatedAt: string;
}

/**
 * Input for creating or updating an editorial override.
 * All fields optional except propertyId.
 */
export interface EditorialOverrideInput {
  propertyId: number;
  visible?: boolean;
  featured?: boolean;
  editorialStatus?: EditorialStatus;
  sortOrder?: number;
  internalNote?: string;
}

/**
 * Default override for a property that has no explicit override.
 */
export const DEFAULT_OVERRIDE: Omit<EditorialOverride, "propertyId" | "updatedAt"> = {
  visible: true,
  featured: false,
  editorialStatus: "available",
  sortOrder: 0,
  internalNote: "",
};

/**
 * Summary statistics for the admin dashboard.
 */
export interface EditorialStats {
  totalTokko: number;
  totalVisible: number;
  totalHidden: number;
  totalFeatured: number;
  totalReserved: number;
  totalSold: number;
  categories: {
    label: string;
    total: number;
    visible: number;
  }[];
}

// ============================================================
// HOME CONTENT CONFIGURATION
// ============================================================

/**
 * Home content configuration.
 * Controls which properties appear on the home page hero and featured sections.
 * Stored separately from per-property overrides.
 */
export interface HomeContent {
  /** Tokko property ID for the hero section */
  heroPropertyId: number | null;
  /** Ordered list of Tokko property IDs for the featured section */
  featuredPropertyIds: number[];
}

/**
 * Default home content — no editorial selection.
 */
export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroPropertyId: null,
  featuredPropertyIds: [],
};

/**
 * Input for updating home content.
 * All fields optional.
 */
export interface HomeContentInput {
  heroPropertyId?: number | null;
  featuredPropertyIds?: number[];
}

// Property Domain Model — Firma Calamuchita
// This model represents property data normalized from Tokko API.
// It is the single source of truth for the application layer.

// ============================================================
// ENUMS / UNIONS
// ============================================================

/**
 * Known property types from Tokko.
 * If Tokko introduces a new type, it falls through to "other".
 */
export type PropertyType =
  | "house"
  | "land"
  | "business_permit"
  | "countryside"
  | "apartment"
  | "other";

/**
 * Mapping from Tokko type.name → internal PropertyType.
 * Documented from FASE 1 audit (36 properties, Branch 85101).
 *
 * Tokko name          → Internal
 * "House"             → "house"
 * "Land"              → "land"
 * "Bussiness Permit"  → "business_permit" (note: Tokko typo preserved)
 * "Countryside"       → "countryside"
 * "Apartment"         → "apartment"
 * (anything else)     → "other"
 */
export const TOKKO_TYPE_MAP: Record<string, PropertyType> = {
  House: "house",
  Land: "land",
  "Bussiness Permit": "business_permit",
  Countryside: "countryside",
  Apartment: "apartment",
};

/**
 * Operation types supported by Tokko.
 * Branch 85101 currently has only "Sale", but the model supports all.
 */
export type PropertyOperation = "sale" | "rent" | "temporary_rent" | "other";

/**
 * Mapping from Tokko operation_type → internal PropertyOperation.
 */
export const TOKKO_OPERATION_MAP: Record<string, PropertyOperation> = {
  Sale: "sale",
  Rent: "rent",
  TemporaryRent: "temporary_rent",
};

/**
 * Property availability status.
 * FASE 1 discovered: status = 2 means "Available" for all 36 properties.
 *
 * IMPORTANT: `deleted_at` does NOT indicate deletion.
 * All 128 properties have `deleted_at` set but are live.
 * Only use `status` for availability checks.
 */
export type PropertyStatus = "available" | "unavailable" | "sold" | "rented";

/**
 * Mapping from Tokko status number → internal PropertyStatus.
 * Documented from FASE 1 audit.
 */
export const TOKKO_STATUS_MAP: Record<number, PropertyStatus> = {
  2: "available",
  // Other status values to be discovered as API evolves.
  // Until documented, unknown statuses default to "unavailable".
};

// ============================================================
// SUB-TYPES
// ============================================================

export interface PropertyPrice {
  amount: number;
  currency: string; // "USD" | "ARS"
  operation: PropertyOperation;
  isPromotional: boolean;
}

export interface PropertyImage {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
  ogUrl?: string;
  alt: string;
  order: number;
  isFrontCover: boolean;
  isBlueprint: boolean;
}

export interface PropertyVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  provider?: string;
}

export interface PropertyPanorama {
  id: string;
  imageUrl: string;
  type: string;
}

export interface PropertyAgent {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cellphone?: string;
  photoUrl?: string;
  position?: string;
}

export interface PropertyLocation {
  country?: string;
  province?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  fullLocation?: string;
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  halfBaths?: number;
  rooms?: number;
  livingRooms?: number;
  diningRooms?: number;
  tvRooms?: number;
  parking?: number;
  coveredParking?: number;
  uncoveredParking?: number;
  coveredArea?: number;
  totalArea?: number;
  landArea?: number;
  floors?: number;
}

export interface PropertyUrls {
  canonical: string;
  tokkoId: number;
  fichaUrl?: string;
  fichaHash?: string;
  publicUrl?: string;
}

// ============================================================
// MAIN PROPERTY MODEL
// ============================================================

export interface Property {
  // Identity
  id: number; // Tokko ID — primary identifier
  referenceCode?: string;
  slug: string; // SEO-friendly URL slug

  // Listing
  title: string;
  description?: string;
  type: PropertyType;
  operation: PropertyOperation;
  status: PropertyStatus;

  // Pricing (support multiple currencies/operations)
  prices: PropertyPrice[];

  // Location
  location: PropertyLocation;

  // Features
  features: PropertyFeatures;

  // Media
  media: {
    images: PropertyImage[];
    videos: PropertyVideo[];
    panoramas360: PropertyPanorama[];
  };

  // Agent
  agent?: PropertyAgent;

  // External URLs
  urls: PropertyUrls;

  // Metadata
  createdAt?: string;
  updatedAt?: string;

  // Tokko raw reference (optional, for debugging)
  _tokkoRaw?: Record<string, unknown>;
}

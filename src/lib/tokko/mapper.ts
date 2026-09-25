// Tokko Mapper — Transforms raw Tokko API responses to Property domain model.
// Pure, testable, deterministic. No HTTP inside this file.

import {
  type Property,
  type PropertyType,
  type PropertyOperation,
  type PropertyStatus,
  type PropertyPrice,
  type PropertyImage,
  type PropertyVideo,
  type PropertyAgent,
  type PropertyLocation,
  type PropertyFeatures,
  TOKKO_TYPE_MAP,
  TOKKO_OPERATION_MAP,
  TOKKO_STATUS_MAP,
} from "@/types/property";

import type { TokkoProperty } from "./client";

// ============================================================
// SLUG GENERATION
// ============================================================

/**
 * Generates a URL-safe slug from a property title.
 * Used for SEO-friendly URLs: /propiedades/{slug}
 *
 * Strategy:
 * - Lowercase
 * - Remove accents/diacritics
 * - Replace spaces and special chars with hyphens
 * - Remove consecutive hyphens
 * - Trim hyphens from ends
 * - Limit to 100 chars
 *
 * IMPORTANT: Slug is NOT the primary key. Tokko ID is.
 * If Tokko title changes, slug may differ. Redirect strategy
 * will be handled in a future phase via slug lookup.
 */
export function generatePropertySlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric
    .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
    .slice(0, 100); // Limit length
}

// ============================================================
// TYPE MAPPING
// ============================================================

/**
 * Maps Tokko type object to internal PropertyType.
 * Falls back to "other" for unknown types.
 */
function mapPropertyType(
  type: TokkoProperty["type"],
): PropertyType {
  if (!type?.name) return "other";
  return TOKKO_TYPE_MAP[type.name] ?? "other";
}

// ============================================================
// OPERATION MAPPING
// ============================================================

/**
 * Maps Tokko operation_type string to internal PropertyOperation.
 * Falls back to "other" for unknown operations.
 */
function mapOperationType(operationType: string): PropertyOperation {
  return TOKKO_OPERATION_MAP[operationType] ?? "other";
}

// ============================================================
// STATUS MAPPING
// ============================================================

/**
 * Maps Tokko status number to internal PropertyStatus.
 * Defaults to "unavailable" for unknown statuses.
 *
 * IMPORTANT: `deleted_at` is NOT used for status determination.
 * FASE 1 proved all 128 properties have `deleted_at` set but are live.
 */
function mapStatus(status: number | undefined): PropertyStatus {
  if (status === undefined) return "unavailable";
  return TOKKO_STATUS_MAP[status] ?? "unavailable";
}

// ============================================================
// PRICE MAPPING
// ============================================================

/**
 * Extracts prices from Tokko operations array.
 * Each operation can have multiple prices in different currencies.
 *
 * Tokko structure:
 * operations[] → operation_type + prices[] → {currency, price, is_promotional}
 *
 * Decision: We flatten all prices with their operation type.
 * If a property has both Sale and Rent operations, all prices are preserved.
 */
function mapPrices(operations: TokkoProperty["operations"]): PropertyPrice[] {
  if (!operations || !Array.isArray(operations)) return [];

  const prices: PropertyPrice[] = [];

  for (const operation of operations) {
    const operationType = mapOperationType(operation.operation_type);

    if (!operation.prices || !Array.isArray(operation.prices)) continue;

    for (const price of operation.prices) {
      prices.push({
        amount: price.price,
        currency: price.currency,
        operation: operationType,
        isPromotional: price.is_promotional,
      });
    }
  }

  return prices;
}

// ============================================================
// IMAGE MAPPING
// ============================================================

/**
 * Maps Tokko photos array to PropertyImage array.
 * Uses the best available URL for each context.
 * Images continue serving from Tokko CDN — no local download.
 *
 * TokkoPhoto has NO unique id field — `order` is a display position
 * that can be duplicated. We generate a stable, unique ID using:
 *   1. Array index (deterministic for same input)
 *   2. URL suffix as collision breaker (unique per image resource)
 *
 * Deduplicates by canonical URL to remove exact copies.
 */
function mapImages(photos: TokkoProperty["photos"]): PropertyImage[] {
  if (!photos || !Array.isArray(photos)) return [];

  const sorted = photos
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const seen = new Set<string>();

  return sorted
    .map((photo, index) => {
      const imageUrl = photo.image || photo.thumb || "";
      const thumbnailUrl = photo.thumb || photo.image || "";

      // Deduplicate by the primary image URL
      const canonicalUrl = imageUrl || thumbnailUrl;
      if (canonicalUrl && seen.has(canonicalUrl)) {
        return null;
      }
      if (canonicalUrl) {
        seen.add(canonicalUrl);
      }

      // Generate stable unique ID: index + URL hash suffix
      // Two photos with same order but different URLs get different IDs
      const urlHash = imageUrl
        ? `-${imageUrl.length}-${imageUrl.charCodeAt(imageUrl.length - 1) ?? 0}`
        : `-${index}`;

      return {
        id: `img-${index}${urlHash}`,
        imageUrl,
        thumbnailUrl,
        originalUrl: photo.original || photo.image || "",
        ogUrl: photo.social_media_url || undefined,
        alt: photo.description || "",
        order: photo.order ?? index,
        isFrontCover: photo.is_front_cover ?? false,
        isBlueprint: photo.is_blueprint ?? false,
      };
    })
    .filter((img): img is NonNullable<typeof img> => img !== null);
}

// ============================================================
// VIDEO MAPPING
// ============================================================

/**
 * Maps Tokko videos array to PropertyVideo array.
 * Tokko provides YouTube and Instagram videos with player_url, url, and provider fields.
 */
function mapVideos(
  videos: TokkoProperty["videos"],
): PropertyVideo[] {
  if (!videos || !Array.isArray(videos)) return [];

  return videos
    .filter((v) => v.url || v.player_url)
    .map((video, index) => ({
      id: `video-${video.id ?? index}`,
      url: video.player_url || video.url || "",
      thumbnailUrl: typeof video.thumbnailUrl === "string" ? video.thumbnailUrl : undefined,
      provider: typeof video.provider === "string" ? video.provider : undefined,
    }));
}

// ============================================================
// AGENT MAPPING
// ============================================================

/**
 * Maps Tokko producer object to PropertyAgent.
 * Only maps fields actually available in the Tokko response.
 */
function mapAgent(producer: TokkoProperty["producer"]): PropertyAgent | undefined {
  if (!producer) return undefined;

  return {
    id: producer.id,
    name: producer.name || "",
    email: producer.email || undefined,
    phone: producer.phone || undefined,
    cellphone: producer.cellphone || undefined,
    photoUrl: producer.picture || undefined,
    position: producer.position || undefined,
  };
}

// ============================================================
// LOCATION MAPPING
// ============================================================

/**
 * Maps Tokko location + geo fields to PropertyLocation.
 * Parses full_location string into structured components.
 */
function mapLocation(
  location: TokkoProperty["location"],
  geoLat: string | undefined,
  geoLong: string | undefined,
  address: string | undefined,
): PropertyLocation {
  const fullLocation = location?.full_location || "";

  // Parse "Argentina | Cordoba | Calamuchita | Villa Rumipal"
  const parts = fullLocation
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    country: parts[0] || undefined,
    province: parts[1] || undefined,
    city: parts[2] || undefined,
    neighborhood: parts[3] || undefined,
    address: address || undefined,
    latitude: geoLat ? parseFloat(geoLat) : undefined,
    longitude: geoLong ? parseFloat(geoLong) : undefined,
    fullLocation: fullLocation || undefined,
  };
}

// ============================================================
// FEATURES MAPPING
// ============================================================

/**
 * Maps Tokko property fields to PropertyFeatures.
 * Only maps fields that exist in the Tokko response.
 */
function mapFeatures(property: TokkoProperty): PropertyFeatures {
  return {
    bedrooms: property.suite_amount || property.total_suites || undefined,
    bathrooms: property.bathroom_amount ?? undefined,
    suites: property.suite_amount ?? undefined,
    halfBaths: property.toilet_amount ?? undefined,
    rooms: property.room_amount ?? undefined,
    livingRooms: property.living_amount ?? undefined,
    diningRooms: property.dining_room ?? undefined,
    tvRooms: property.tv_rooms ?? undefined,
    parking:
      property.parking_lot_amount ?? property.covered_parking_lot ?? undefined,
    coveredParking: property.covered_parking_lot ?? undefined,
    uncoveredParking: property.uncovered_parking_lot ?? undefined,
    coveredArea: property.roofed_surface
      ? parseFloat(property.roofed_surface)
      : undefined,
    totalArea: property.total_area
      ? parseFloat(property.total_area)
      : undefined,
    landArea: property.surface ? parseFloat(property.surface) : undefined,
    floors: property.floors_amount ?? undefined,
  };
}

// ============================================================
// FICHA.URL EXTRACTION
// ============================================================

/**
 * Extracts ficha.info hash from public_url.
 * Format: https://ficha.info/p/{hash}
 * No hash field exists directly in Tokko response.
 */
function extractFichaHash(publicUrl: string | undefined): string | undefined {
  if (!publicUrl) return undefined;
  const match = publicUrl.match(/\/p\/([a-zA-Z0-9]+)/);
  return match ? match[1] : undefined;
}

// ============================================================
// MAIN MAPPER
// ============================================================

/**
 * Maps a raw TokkoProperty to our Property domain model.
 *
 * This is a pure function — no side effects, no HTTP.
 * It is deterministic: same input always produces same output.
 */
export function mapTokkoProperty(raw: TokkoProperty): Property {
  return {
    // Identity
    id: raw.id,
    referenceCode: raw.reference_code || undefined,
    slug: generatePropertySlug(raw.publication_title || `propiedad-${raw.id}`),

    // Listing
    title: raw.publication_title || `Propiedad ${raw.id}`,
    description: raw.description?.trim() || undefined,
    type: mapPropertyType(raw.type),
    operation: mapPrices(raw.operations)[0]?.operation ?? "sale",
    status: mapStatus(raw.status),

    // Pricing
    prices: mapPrices(raw.operations),

    // Location
    location: mapLocation(
      raw.location,
      raw.geo_lat,
      raw.geo_long,
      raw.address,
    ),

    // Features
    features: mapFeatures(raw),

    // Media
    media: {
      images: mapImages(raw.photos),
      videos: mapVideos(raw.videos),
      panoramas360: [], // No 360 data detected in Tokko dataset
    },

    // Agent
    agent: mapAgent(raw.producer),

    // External URLs
    urls: {
      canonical: `/propiedades/${generatePropertySlug(raw.publication_title || `propiedad-${raw.id}`)}`,
      tokkoId: raw.id,
      fichaUrl: raw.public_url || undefined,
      fichaHash: extractFichaHash(raw.public_url),
      publicUrl: raw.public_url || undefined,
    },

    // Metadata
    createdAt: raw.created_at || undefined,
    updatedAt: raw.updated_at || undefined,
  };
}

/**
 * Maps an array of TokkoProperties to Property array.
 */
export function mapTokkoProperties(rawProperties: TokkoProperty[]): Property[] {
  return rawProperties.map(mapTokkoProperty);
}

// Tokko Property Provider — High-level interface for property data.
// Combines TokkoClient + TokkoMapper.
// The rest of the application should use this, not the client directly.

import { type Property } from "@/types/property";
import { TokkoClient } from "./client";
import { mapTokkoProperties } from "./mapper";

// ============================================================
// CONFIGURATION
// ============================================================

export interface TokkoProviderConfig {
  apiKey: string;
  branchId: number;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

// ============================================================
// PROVIDER
// ============================================================

export class TokkoPropertyProvider {
  private readonly client: TokkoClient;
  private readonly branchId: number;
  private cache: Property[] | null = null;
  private cacheTimestamp = 0;
  private readonly cacheTtlMs: number;

  constructor(config: TokkoProviderConfig) {
    if (!config.apiKey) {
      throw new Error("Tokko API key is required");
    }
    if (!config.branchId) {
      throw new Error("Tokko branch ID is required");
    }

    this.client = new TokkoClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
    });
    this.branchId = config.branchId;

    // Cache TTL: 30 minutes by default
    this.cacheTtlMs = 30 * 60 * 1000;
  }

  /**
   * Get all available properties for this branch.
   * Uses client-side filtering (server-side branch filtering returns 400).
   * Caches results for cacheTtlMs.
   */
  async getProperties(): Promise<Property[]> {
    // Return cache if valid
    if (this.cache && Date.now() - this.cacheTimestamp < this.cacheTtlMs) {
      return this.cache;
    }

    // Fetch all properties from Tokko
    const allRaw = await this.client.getAllProperties();

    // Filter by branch ID (client-side — server-side doesn't work)
    const branchProperties = allRaw.filter(
      (p) => p.branch?.id === this.branchId,
    );

    // Map to domain model
    const properties = mapTokkoProperties(branchProperties);

    // Update cache
    this.cache = properties;
    this.cacheTimestamp = Date.now();

    return properties;
  }

  /**
   * Get a single property by Tokko ID.
   */
  async getPropertyById(id: number): Promise<Property | null> {
    const properties = await this.getProperties();
    return properties.find((p) => p.id === id) ?? null;
  }

  /**
   * Get properties filtered by type.
   */
  async getPropertiesByType(type: Property["type"]): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter((p) => p.type === type);
  }

  /**
   * Get properties filtered by operation type.
   */
  async getPropertiesByOperation(
    operation: Property["operation"],
  ): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter((p) => p.operation === operation);
  }

  /**
   * Get properties filtered by status.
   */
  async getPropertiesByStatus(
    status: Property["status"],
  ): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter((p) => p.status === status);
  }

  /**
   * Get available properties (status = "available").
   */
  async getAvailableProperties(): Promise<Property[]> {
    return this.getPropertiesByStatus("available");
  }

  /**
   * Search properties by title, description, or location fields.
   */
  async searchProperties(query: string): Promise<Property[]> {
    const properties = await this.getProperties();
    const lowerQuery = query.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.location.city?.toLowerCase().includes(lowerQuery) ||
        p.location.neighborhood?.toLowerCase().includes(lowerQuery) ||
        p.location.address?.toLowerCase().includes(lowerQuery) ||
        p.location.fullLocation?.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Get properties matching a set of filter criteria.
   * All filters are optional; omitted filters match everything.
   */
  async filterProperties(filters: {
    types?: Property["type"][];
    operation?: Property["operation"];
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    bedrooms?: number;
    bathrooms?: number;
    minSurface?: number;
    maxSurface?: number;
  }): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter((p) => {
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(p.type)) return false;
      }
      if (filters.operation && p.operation !== filters.operation) return false;
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const price = p.prices[0]?.amount;
        if (price === undefined) return false;
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      }
      if (filters.city && p.location.city !== filters.city) return false;
      if (filters.bedrooms !== undefined) {
        if (p.features.bedrooms === undefined || p.features.bedrooms < filters.bedrooms) return false;
      }
      if (filters.bathrooms !== undefined) {
        if (p.features.bathrooms === undefined || p.features.bathrooms < filters.bathrooms) return false;
      }
      if (filters.minSurface !== undefined) {
        const surface = p.features.landArea ?? p.features.totalArea;
        if (surface === undefined || surface < filters.minSurface) return false;
      }
      if (filters.maxSurface !== undefined) {
        const surface = p.features.landArea ?? p.features.totalArea;
        if (surface !== undefined && surface > filters.maxSurface) return false;
      }
      return true;
    });
  }

  /**
   * Get properties by slug.
   */
  async getPropertyBySlug(slug: string): Promise<Property | null> {
    const properties = await this.getProperties();
    return properties.find((p) => p.slug === slug) ?? null;
  }

  /**
   * Get related properties: same type, same city, similar price range (±30%).
   */
  async getRelatedProperties(property: Property, limit = 4): Promise<Property[]> {
    const properties = await this.getProperties();
    const price = property.prices[0]?.amount ?? 0;
    const minPrice = price * 0.7;
    const maxPrice = price * 1.3;

    return properties
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.type === property.type || p.location.city === property.location.city) &&
          p.prices.some((pr) => pr.amount >= minPrice && pr.amount <= maxPrice),
      )
      .slice(0, limit);
  }

  /**
   * Get the current branch ID.
   */
  getBranchId(): number {
    return this.branchId;
  }

  /**
   * Invalidate the cache. Useful after Tokko webhook or manual refresh.
   */
  invalidateCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

// ============================================================
// CONVENIENCE FACTORY
// ============================================================

/**
 * Creates a TokkoPropertyProvider from environment variables.
 * Reads TOKKO_API_KEY and TOKKO_BRANCH_ID from process.env.
 */
export function createTokkoProvider(): TokkoPropertyProvider {
  const apiKey = process.env.TOKKO_API_KEY;
  const branchId = process.env.TOKKO_BRANCH_ID;

  if (!apiKey) {
    throw new Error("TOKKO_API_KEY environment variable is required");
  }
  if (!branchId) {
    throw new Error("TOKKO_BRANCH_ID environment variable is required");
  }

  return new TokkoPropertyProvider({
    apiKey,
    branchId: parseInt(branchId, 10),
  });
}

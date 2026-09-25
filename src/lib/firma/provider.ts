// Firma Property Provider — FIRMA Calamuchita
// High-level provider that merges Tokko data with editorial overrides.
// This is what public pages should use.

import { type Property } from "@/types/property";
import { type EditorialOverride } from "@/types/editorial";
import { createTokkoProvider, type TokkoPropertyProvider } from "@/lib/tokko";
import { getAllOverrides, getHomeContent } from "@/lib/editorial/store";
import type { HomeContent } from "@/types/editorial";
import {
  mergeProperties,
  getPublicProperties,
  getFeaturedProperties,
  type EditorialProperty,
} from "@/lib/editorial/merge";
import { filterProperties, type PropertyFilters } from "@/lib/filters";

// ============================================================
// FIRMA PROVIDER
// ============================================================

export class FirmaPropertyProvider {
  private tokkoProvider: TokkoPropertyProvider;
  private properties: EditorialProperty[] | null = null;
  private overrides: Map<number, EditorialOverride> | null = null;

  constructor(tokkoProvider: TokkoPropertyProvider) {
    this.tokkoProvider = tokkoProvider;
  }

  /**
   * Get all properties merged with editorial overrides.
   */
  async getAllProperties(): Promise<EditorialProperty[]> {
    if (this.properties) return this.properties;

    const [tokkoProperties, overridesList] = await Promise.all([
      this.tokkoProvider.getProperties(),
      getAllOverrides(),
    ]);

    this.overrides = new Map(overridesList.map((o) => [o.propertyId, o]));
    this.properties = mergeProperties(tokkoProperties, this.overrides);

    return this.properties;
  }

  /**
   * Get public properties (visible, sorted by sortOrder).
   * Optionally filters by type, city/locality and price range.
   */
  async getPublicProperties(
    filters?: PropertyFilters,
  ): Promise<EditorialProperty[]> {
    const all = await this.getAllProperties();
    const visible = getPublicProperties(all);
    return filters ? filterProperties(visible, filters) : visible;
  }

  /**
   * Get featured properties (visible + featured).
   */
  async getFeaturedProperties(): Promise<EditorialProperty[]> {
    const all = await this.getAllProperties();
    return getFeaturedProperties(all);
  }

  /**
   * Get a single property by slug (public — must be visible).
   */
  async getPropertyBySlug(slug: string): Promise<EditorialProperty | null> {
    const all = await this.getAllProperties();
    const property = all.find((p) => p.slug === slug);
    if (!property || !property.editorial.visible) return null;
    return property;
  }

  /**
   * Get a single property by ID (public — must be visible).
   */
  async getPropertyById(id: number): Promise<EditorialProperty | null> {
    const all = await this.getAllProperties();
    const property = all.find((p) => p.id === id);
    if (!property || !property.editorial.visible) return null;
    return property;
  }

  /**
   * Get properties by type (public only).
   */
  async getPropertiesByType(type: Property["type"]): Promise<EditorialProperty[]> {
    const all = await this.getPublicProperties();
    return all.filter((p) => p.type === type);
  }

  /**
   * Get related properties (public, same type or city, similar price).
   */
  async getRelatedProperties(
    property: EditorialProperty,
    limit = 4,
  ): Promise<EditorialProperty[]> {
    const all = await this.getPublicProperties();
    const price = property.prices[0]?.amount ?? 0;
    const minPrice = price * 0.7;
    const maxPrice = price * 1.3;

    return all
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.type === property.type || p.location.city === property.location.city) &&
          p.prices.some((pr) => pr.amount >= minPrice && pr.amount <= maxPrice),
      )
      .slice(0, limit);
  }

  /**
   * Search properties (public only).
   */
  async searchProperties(query: string): Promise<EditorialProperty[]> {
    const all = await this.getPublicProperties();
    const lowerQuery = query.toLowerCase();
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.location.city?.toLowerCase().includes(lowerQuery) ||
        p.location.neighborhood?.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Get all properties including hidden (admin use).
   */
  async getAllPropertiesForAdmin(): Promise<EditorialProperty[]> {
    return this.getAllProperties();
  }

  /**
   * Get home content configuration (hero + featured IDs).
   */
  async getHomeContentConfig(): Promise<HomeContent> {
    return getHomeContent();
  }

  /**
   * Get the hero property for the home page.
   * Uses editorial config, falls back to first visible property.
   */
  async getHeroProperty(): Promise<EditorialProperty | null> {
    const config = await getHomeContent();
    const all = await this.getAllProperties();

    // 1. Editorial hero selection
    if (config.heroPropertyId !== null) {
      const hero = all.find(
        (p) => p.id === config.heroPropertyId && p.editorial.visible,
      );
      if (hero) return hero;
    }

    // 2. Fallback: first visible property
    const visible = getPublicProperties(all);
    return visible[0] ?? null;
  }

  /**
   * Get featured properties for the home page.
   * Uses editorial config, falls back to first 5 visible properties.
   */
  async getHomeFeaturedProperties(): Promise<EditorialProperty[]> {
    const config = await getHomeContent();
    const all = await this.getAllProperties();

    // 1. Editorial featured selection
    if (config.featuredPropertyIds.length > 0) {
      const featured: EditorialProperty[] = [];
      for (const id of config.featuredPropertyIds) {
        const prop = all.find((p) => p.id === id && p.editorial.visible);
        if (prop) featured.push(prop);
      }
      if (featured.length > 0) return featured;
    }

    // 2. Fallback: first 5 visible properties (excluding hero)
    const hero = await this.getHeroProperty();
    const visible = getPublicProperties(all).filter(
      (p) => p.id !== hero?.id,
    );
    return visible.slice(0, 5);
  }

  /**
   * Get the branch ID.
   */
  getBranchId(): number {
    return this.tokkoProvider.getBranchId();
  }
}

// ============================================================
// FACTORY
// ============================================================

let firmaProviderInstance: FirmaPropertyProvider | null = null;

export function createFirmaProvider(): FirmaPropertyProvider {
  if (!firmaProviderInstance) {
    firmaProviderInstance = new FirmaPropertyProvider(createTokkoProvider());
  }
  return firmaProviderInstance;
}

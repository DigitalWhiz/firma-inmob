import type { Property, PropertyType } from "@/types/property";
import { getCategoryBySlug } from "@/config/categories";

export interface PropertyFilters {
  types?: PropertyType[];
  operation?: Property["operation"];
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  minSurface?: number;
  maxSurface?: number;
  query?: string;
}

/**
 * Normalize a string for accent/case-insensitive comparison.
 * e.g. "El Torreón" === "El Torreon", "Santa Rosa De Calamuchita" === "Santa Rosa de Calamuchita"
 */
function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesCity(property: Property, city: string): boolean {
  const target = normalizeText(city);
  const propertyCity = property.location.city;
  const propertyNeighborhood = property.location.neighborhood;
  return (
    (propertyCity != null && normalizeText(propertyCity) === target) ||
    (propertyNeighborhood != null &&
      normalizeText(propertyNeighborhood) === target)
  );
}

export function filterProperties<T extends Property>(
  properties: T[],
  filters: PropertyFilters,
): T[] {
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
    if (filters.city && !matchesCity(p, filters.city)) return false;
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
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.location.city?.toLowerCase().includes(q) ||
        p.location.neighborhood?.toLowerCase().includes(q) ||
        p.location.address?.toLowerCase().includes(q) ||
        p.location.fullLocation?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

export function getUniqueCities(properties: Property[]): string[] {
  const cities = new Set<string>();
  for (const p of properties) {
    if (p.location.city) cities.add(p.location.city);
  }
  return Array.from(cities).sort();
}

/**
 * Extract the unique localities available in the inventory, for search
 * dropdowns. Priority: location.neighborhood, fallback to location.city.
 * Dedupes accent/case variants ("El Torreón" vs "El Torreon") via a
 * normalized key (first label wins), then sorts alphabetically.
 * Pure function — call it only on the server; pass the resulting string[]
 * to client components.
 */
export function getUniqueLocalities(properties: Property[]): string[] {
  const byKey = new Map<string, string>();
  for (const p of properties) {
    const label = (p.location.neighborhood || p.location.city || "").trim();
    if (!label) continue;
    const key = normalizeText(label);
    if (!key || byKey.has(key)) continue;
    byKey.set(key, label);
  }
  return Array.from(byKey.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, label]) => label);
}

export function getUniqueTypes(properties: Property[]): PropertyType[] {
  const types = new Set<PropertyType>();
  for (const p of properties) types.add(p.type);
  return Array.from(types).sort();
}

export function getPriceRange(properties: Property[]): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const p of properties) {
    for (const price of p.prices) {
      if (price.amount < min) min = price.amount;
      if (price.amount > max) max = price.amount;
    }
  }
  return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max };
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Parse /propiedades URL search params into PropertyFilters.
 * Contract with the Home search bar:
 *   ?tipo=<category-slug>&ubicacion=<locality>&precio=<min-max>
 * e.g. /propiedades?tipo=casas&ubicacion=El%20Durazno&precio=0-500000
 */
export function parsePropertySearchParams(
  params: SearchParamsRecord,
): PropertyFilters {
  const filters: PropertyFilters = {};

  const tipo = firstValue(params.tipo);
  if (tipo) {
    const category = getCategoryBySlug(tipo);
    if (category) filters.types = [...category.tokkoTypes];
  }

  const ubicacion = firstValue(params.ubicacion);
  if (ubicacion) filters.city = ubicacion;

  const precio = firstValue(params.precio);
  if (precio) {
    const [minRaw, maxRaw] = precio.split("-");
    const min = Number(minRaw);
    const max = Number(maxRaw);
    if (minRaw && Number.isFinite(min)) filters.minPrice = min;
    if (maxRaw && Number.isFinite(max)) filters.maxPrice = max;
  }

  return filters;
}

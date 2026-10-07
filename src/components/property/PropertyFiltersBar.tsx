"use client";

import { useState, useMemo, useCallback } from "react";
// import type { ReactElement } from "react"; // ÍCONOS — ver bloque comentado abajo
import type { PropertyType } from "@/types/property";
import type { EditorialStatus } from "@/types/editorial";
import type { EditorialProperty } from "@/lib/editorial/merge";
import { filterProperties, type PropertyFilters } from "@/lib/filters";
import { CATEGORIES } from "@/config/categories";
import PropertyCard from "./PropertyCard";

interface PropertyFiltersBarProps {
  properties: EditorialProperty[];
  /** Unique localities extracted on the server from the active inventory. */
  availableLocations: string[];
  /** Filters pre-applied from the URL (?tipo&ubicacion&precio). */
  initialFilters?: PropertyFilters;
}

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "editorial";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Más recientes",
  oldest: "Más antiguas",
  "price-asc": "Menor precio",
  "price-desc": "Mayor precio",
  editorial: "Orden editorial",
};

/* ÍCONOS PREMIUM DE CATEGORÍAS — comentados por ahora.
   Para reactivar: descomentar este bloque, la importación de ReactElement
   arriba y los usos de <CategoryIcon /> en los botones. */

/*
const CATEGORY_ICONS: Record<string, ReactElement> = {
  todas: (
    <>
      <rect pathLength={1} x="3.75" y="3.75" width="7" height="7" rx="1.75" />
      <rect pathLength={1} x="13.25" y="3.75" width="7" height="7" rx="1.75" />
      <rect pathLength={1} x="3.75" y="13.25" width="7" height="7" rx="1.75" />
      <rect pathLength={1} x="13.25" y="13.25" width="7" height="7" rx="1.75" />
    </>
  ),
  casas: (
    <>
      <path pathLength={1} d="M3.5 11 12 3.5l8.5 7.5" />
      <path pathLength={1} d="M5.5 9.7V19.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.7" />
      <path pathLength={1} d="M9.75 20.5v-5.25h4.5v5.25" />
    </>
  ),
  departamentos: (
    <>
      <path pathLength={1} d="M4 21V5.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1V21" />
      <path pathLength={1} d="M13 21V10.5h6a1 1 0 0 1 1 1V21" />
      <path pathLength={1} d="M2.5 21h19" />
      <path pathLength={1} d="M7 8h1.5M7 11.5h1.5M7 15h1.5" />
      <path pathLength={1} d="M15.5 14h1.5M15.5 17h1.5" />
    </>
  ),
  terrenos: (
    <>
      <rect pathLength={1} x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path pathLength={1} d="M7.5 16.5 10.5 8l6 1.5-1 7Z" />
    </>
  ),
  complejos: (
    <>
      <circle pathLength={1} cx="17" cy="6.5" r="2.75" />
      <path pathLength={1} d="M2.5 19.5 8.5 9.5l3.2 5.3 2.3-3.3 5.5 8Z" />
    </>
  ),
  campos: (
    <>
      <path pathLength={1} d="M12 21V5.5" />
      <path pathLength={1} d="M12 13.5c2.6 0 4.2-1.9 4.2-4.8-2.8 0-4.2 2-4.2 4.8Z" />
      <path pathLength={1} d="M12 13.5c-2.6 0-4.2-1.9-4.2-4.8 2.8 0 4.2 2 4.2 4.8Z" />
      <path pathLength={1} d="M12 9.5c2.4 0 3.9-1.8 3.9-4.5-2.6 0-3.9 1.9-3.9 4.5Z" />
      <path pathLength={1} d="M12 9.5c-2.4 0-3.9-1.8-3.9-4.5 2.6 0 3.9 1.9 3.9 4.5Z" />
      <path pathLength={1} d="M12 6c-1.4-1.4-1.4-3.2 0-4.6 1.4 1.4 1.4 3.2 0 4.6Z" />
    </>
  ),
};

function CategoryIcon({ slug, active }: { slug: string; active: boolean }) {
  return (
    <span
      className={`firma-cat-icon${active ? " is-active" : ""}`}
      style={{
        color: active ? "var(--color-brand-gold)" : "var(--color-text-primary)",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {CATEGORY_ICONS[slug] ?? CATEGORY_ICONS.todas}
      </svg>
    </span>
  );
}
*/

export default function PropertyFiltersBar({
  properties,
  availableLocations,
  initialFilters,
}: PropertyFiltersBarProps) {
  const [selectedType, setSelectedType] = useState<PropertyType | null>(
    initialFilters?.types?.[0] ?? null,
  );
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(initialFilters?.city ?? "");
  const [minPrice, setMinPrice] = useState(
    initialFilters?.minPrice != null ? String(initialFilters.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters?.maxPrice != null ? String(initialFilters.maxPrice) : "",
  );
  const [sort, setSort] = useState<SortOption>("editorial");
  const [showFilters, setShowFilters] = useState(false);

  const filters: PropertyFilters = useMemo(() => ({
    types: selectedType ? [selectedType] : undefined,
    city: city || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    query: search || undefined,
  }), [selectedType, city, minPrice, maxPrice, search]);

  const filtered = useMemo(() => {
    let result = filterProperties(properties, filters);

    switch (sort) {
      case "newest":
        result = [...result].sort((a, b) => {
          const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return db - da;
        });
        break;
      case "oldest":
        result = [...result].sort((a, b) => {
          const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return da - db;
        });
        break;
      case "price-asc":
        result = [...result].sort((a, b) => (a.prices[0]?.amount ?? 0) - (b.prices[0]?.amount ?? 0));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => (b.prices[0]?.amount ?? 0) - (a.prices[0]?.amount ?? 0));
        break;
    }

    return result;
  }, [properties, filters, sort]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (selectedType) {
      const cat = CATEGORIES.find((c) => c.tokkoTypes.includes(selectedType));
      chips.push({
        key: "type",
        label: cat?.pluralLabel || selectedType,
        onRemove: () => setSelectedType(null),
      });
    }
    if (city) {
      chips.push({ key: "city", label: city, onRemove: () => setCity("") });
    }
    if (minPrice) {
      chips.push({
        key: "minPrice",
        label: `Desde USD ${Number(minPrice).toLocaleString("es-AR")}`,
        onRemove: () => setMinPrice(""),
      });
    }
    if (maxPrice) {
      chips.push({
        key: "maxPrice",
        label: `Hasta USD ${Number(maxPrice).toLocaleString("es-AR")}`,
        onRemove: () => setMaxPrice(""),
      });
    }
    if (search) {
      chips.push({ key: "search", label: `"${search}"`, onRemove: () => setSearch("") });
    }
    return chips;
  }, [selectedType, city, minPrice, maxPrice, search]);

  const clearAll = useCallback(() => {
    setSelectedType(null);
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSort("editorial");
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat.slug] = properties.filter((p) => cat.tokkoTypes.includes(p.type)).length;
    }
    return counts;
  }, [properties]);

  return (
    <div>
      {/* Category Visual Selector */}
      <div className="mb-6 md:mb-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
          {/* All categories */}
          <button
            onClick={() => setSelectedType(null)}
            className="firma-cat-btn flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-1 py-2.5 transition-all duration-200 md:gap-2 md:py-3"
            style={{
              borderColor: selectedType === null ? "var(--color-brand-gold)" : "var(--color-border)",
              backgroundColor: selectedType === null ? "rgba(206,184,138,0.08)" : "var(--color-surface)",
            }}
          >
            {/* <CategoryIcon slug="todas" active={selectedType === null} /> */}
            <span className="text-caption font-medium leading-tight text-center lg:text-body-sm" style={{ color: selectedType === null ? "var(--color-text-primary)" : "var(--color-text-primary)" }}>
              TODAS
            </span>
            <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
              {properties.length}
            </span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedType(cat.tokkoTypes[0])}
              className="firma-cat-btn flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-1 py-2.5 transition-all duration-200 md:gap-2 md:py-3"
              style={{
                borderColor: selectedType === cat.tokkoTypes[0] ? "var(--color-brand-gold)" : "var(--color-border)",
                backgroundColor: selectedType === cat.tokkoTypes[0] ? "rgba(206,184,138,0.08)" : "var(--color-surface)",
              }}
            >
              {/* <CategoryIcon slug={cat.slug} active={selectedType === cat.tokkoTypes[0]} /> */}
              <span className="text-caption font-medium leading-tight text-center lg:text-body-sm" style={{ color: selectedType === cat.tokkoTypes[0] ? "var(--color-brand-gold)" : "var(--color-text-primary)" }}>
                {cat.pluralLabel.toUpperCase()}
              </span>
              <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
                {categoryCounts[cat.slug] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative group">
          {/* ÍCONO LUPA — comentado
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-110 group-focus-within:-rotate-6 group-focus-within:text-[var(--color-brand-gold)]"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, ubicación..."
            className="w-full rounded-xl border py-3 pl-4 pr-4 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`firma-filters-btn${showFilters ? " is-open" : ""} flex items-center gap-2 rounded-xl border px-4 py-3 text-body-sm transition-colors duration-200 hover:border-[var(--color-brand-gold)]`}
          style={{
            borderColor: showFilters ? "var(--color-brand-gold)" : "var(--color-border)",
            color: showFilters ? "var(--color-brand-gold)" : "var(--color-text-muted)",
            backgroundColor: showFilters ? "rgba(206,184,138,0.08)" : "var(--color-surface)",
          }}
        >
          {/* ÍCONO SLIDERS — comentado
          <svg
            className="firma-sliders"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3.5" y1="7" x2="20.5" y2="7" />
            <line x1="3.5" y1="12" x2="20.5" y2="12" />
            <line x1="3.5" y1="17" x2="20.5" y2="17" />
            <circle className="knob knob-k1" cx="9" cy="7" r="2.4" fill="currentColor" stroke="none" />
            <circle className="knob knob-k2" cx="15" cy="12" r="2.4" fill="currentColor" stroke="none" />
            <circle className="knob knob-k3" cx="8" cy="17" r="2.4" fill="currentColor" stroke="none" />
          </svg>
          */}
          FILTROS
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mb-6 rounded-xl border p-4 md:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <div className="grid gap-4 md:grid-cols-3">
            {/* City */}
            <div>
              <label className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                UBICACIÓN
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text-primary)",
                }}
              >
                <option value="">Todas las zonas</option>
                {city && !availableLocations.includes(city) && (
                  <option value={city}>{city}</option>
                )}
                {availableLocations.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                PRECIO (USD)
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Mín"
                  className="w-1/2 rounded-lg border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text-primary)",
                  }}
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Máx"
                  className="w-1/2 rounded-lg border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                ORDENAR POR
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text-primary)",
                }}
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilters.map((chip) => (
            <span
              key={chip.key}
              className="group/chip inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption"
              style={{
                borderColor: "var(--color-brand-gold)",
                color: "var(--color-brand-gold)",
                backgroundColor: "rgba(206,184,138,0.08)",
              }}
            >
              {chip.label}
              {/* ÍCONO X PARA QUITAR CHIP — comentado
              <button
                onClick={chip.onRemove}
                className="ml-0.5 rounded-full p-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(206,184,138,0.2)] group-hover/chip:rotate-90"
                aria-label={`Quitar filtro ${chip.label}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              */}
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-caption font-medium tracking-wider transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            LIMPIAR FILTROS
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
        </p>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
            ORDEN:
          </span>
          {(["editorial", "newest", "price-asc", "price-desc"] as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="rounded-full border px-3 py-1 text-caption transition-colors duration-200"
              style={{
                borderColor: sort === s ? "var(--color-brand-gold)" : "var(--color-border)",
                color: sort === s ? "var(--color-brand-gold)" : "var(--color-text-muted)",
                backgroundColor: sort === s ? "rgba(206,184,138,0.08)" : "transparent",
              }}
            >
              {SORT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {/* ÍCONO DE ESTADO VACÍO — comentado
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full animate-float"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          */}
          <h3 className="mt-2 font-display text-xl" style={{ color: "var(--color-text-primary)" }}>
            No encontramos propiedades
          </h3>
          <p className="mt-2 max-w-md text-body-sm" style={{ color: "var(--color-text-muted)" }}>
            No hay propiedades que coincidan con estos filtros. Probá con otros criterios de búsqueda.
          </p>
          <button
            onClick={clearAll}
            className="btn-primary mt-6"
          >
            LIMPIAR FILTROS
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => {
            const original = properties.find((p) => p.id === property.id);
            const editorialStatus: EditorialStatus = original?.editorial?.editorialStatus ?? "available";
            const isFeatured = original?.editorial?.featured ?? false;
            return (
              <PropertyCard
                key={property.id}
                property={property}
                variant="editorial"
                featured={isFeatured}
                editorialStatus={editorialStatus}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

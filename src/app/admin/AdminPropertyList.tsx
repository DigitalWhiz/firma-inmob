"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import type { Property } from "@/types/property";
import type { EditorialOverride, EditorialOverrideInput, EditorialStatus } from "@/types/editorial";
import { STATUS_COLORS, STATUS_LABELS, STATUS_TINTS } from "@/config/status";

interface AdminPropertyListProps {
  properties: Property[];
  overrides: EditorialOverride[];
}

type Filter = "all" | "visible" | "hidden" | "featured" | "reserved" | "sold";
type ViewSort = "editorial" | "tokko-newest" | "tokko-oldest" | "alpha-asc" | "alpha-desc";

const VIEW_SORT_LABELS: Record<ViewSort, string> = {
  editorial: "Orden editorial",
  "tokko-newest": "Más recientes (Tokko)",
  "tokko-oldest": "Más antiguas (Tokko)",
  "alpha-asc": "A → Z",
  "alpha-desc": "Z → A",
};

export default function AdminPropertyList({
  properties,
  overrides,
}: AdminPropertyListProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [viewSort, setViewSort] = useState<ViewSort>("editorial");
  const [search, setSearch] = useState("");
  const [localOverrides, setLocalOverrides] = useState<Map<number, EditorialOverride>>(
    new Map(overrides.map((o) => [o.propertyId, o])),
  );
  const [saving, setSaving] = useState<number | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getOverride = useCallback(
    (id: number): EditorialOverride | undefined => localOverrides.get(id),
    [localOverrides],
  );

  const isVisible = useCallback(
    (id: number) => {
      const o = getOverride(id);
      return o ? o.visible : true;
    },
    [getOverride],
  );

  const isFeatured = useCallback(
    (id: number) => {
      const o = getOverride(id);
      return o ? o.featured : false;
    },
    [getOverride],
  );

  const getStatus = useCallback(
    (id: number): EditorialStatus => {
      const o = getOverride(id);
      return o ? o.editorialStatus : "available";
    },
    [getOverride],
  );

  const getSortOrder = useCallback(
    (id: number): number => {
      const o = getOverride(id);
      return o ? o.sortOrder : 0;
    },
    [getOverride],
  );

  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2000);
  }, []);

  const updateOverride = useCallback(
    async (propertyId: number, input: Partial<EditorialOverrideInput>) => {
      setSaving(propertyId);
      try {
        const res = await fetch("/api/admin/editorial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, ...input }),
        });

        if (res.ok) {
          const { override } = await res.json();
          setLocalOverrides((prev) => new Map(prev).set(propertyId, override));
          showSuccess("Guardado");
        }
      } catch {
        // Error handling without exposing details
      } finally {
        setSaving(null);
      }
    },
    [showSuccess],
  );

  // ---- SORT: Move property up/down in editorial order ----
  const moveProperty = useCallback(
    async (propertyId: number, direction: "up" | "down") => {
      const current = getSortOrder(propertyId);
      const delta = direction === "up" ? -1 : 1;
      const newOrder = current + delta;
      await updateOverride(propertyId, { sortOrder: newOrder });
    },
    [getSortOrder, updateOverride],
  );

  // ---- SORT: Set explicit sort order via number input ----
  const setSortOrder = useCallback(
    async (propertyId: number, value: string) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) return;
      const clamped = Math.max(-10000, Math.min(10000, num));
      await updateOverride(propertyId, { sortOrder: clamped });
    },
    [updateOverride],
  );

  // ---- BULK SORT: Apply sort order from a computed list ----
  const applyBulkSort = useCallback(
    async (sortedIds: number[], label: string) => {
      setBulkSaving(true);
      try {
        const inputs: EditorialOverrideInput[] = sortedIds.map((id, index) => ({
          propertyId: id,
          sortOrder: index,
        }));

        // Batch save via individual API calls (editorial API doesn't have bulk endpoint)
        for (const input of inputs) {
          const res = await fetch("/api/admin/editorial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          });
          if (!res.ok) break;
        }

        // Refresh overrides from server
        const refreshRes = await fetch("/api/admin/editorial");
        if (refreshRes.ok) {
          const { overrides: freshOverrides } = await refreshRes.json();
          setLocalOverrides(new Map(freshOverrides.map((o: EditorialOverride) => [o.propertyId, o])));
        }

        showSuccess(`${label} aplicado`);
      } catch {
        // Error handling
      } finally {
        setBulkSaving(false);
      }
    },
    [showSuccess],
  );

  // ---- SORT COMPUTATIONS ----
  const sortedPropertyIds = useMemo(() => {
    const ids = properties.map((p) => p.id);

    switch (viewSort) {
      case "editorial":
        return [...ids].sort((a, b) => getSortOrder(a) - getSortOrder(b));
      case "tokko-newest":
        return [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          const dateA = pa?.updatedAt ? new Date(pa.updatedAt).getTime() : 0;
          const dateB = pb?.updatedAt ? new Date(pb.updatedAt).getTime() : 0;
          return dateB - dateA;
        });
      case "tokko-oldest":
        return [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          const dateA = pa?.updatedAt ? new Date(pa.updatedAt).getTime() : 0;
          const dateB = pb?.updatedAt ? new Date(pb.updatedAt).getTime() : 0;
          return dateA - dateB;
        });
      case "alpha-asc":
        return [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          return (pa?.title || "").localeCompare(pb?.title || "", "es");
        });
      case "alpha-desc":
        return [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          return (pb?.title || "").localeCompare(pa?.title || "", "es");
        });
      default:
        return ids;
    }
  }, [properties, viewSort, getSortOrder]);

  const filtered = useMemo(() => {
    return sortedPropertyIds.filter((id) => {
      const p = properties.find((prop) => prop.id === id);
      if (!p) return false;

      const o = getOverride(id);
      const visible = o ? o.visible : true;
      const featured = o ? o.featured : false;
      const status = o ? o.editorialStatus : "available";

      if (filter === "visible" && !visible) return false;
      if (filter === "hidden" && visible) return false;
      if (filter === "featured" && !featured) return false;
      if (filter === "reserved" && status !== "reserved") return false;
      if (filter === "sold" && status !== "sold") return false;

      if (search) {
        const q = search.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.location.city?.toLowerCase().includes(q) ||
          p.location.neighborhood?.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [sortedPropertyIds, properties, filter, search, getOverride]);

  const handleApplySort = (sortType: ViewSort) => {
    if (sortType === "editorial") {
      setViewSort("editorial");
      return;
    }

    const ids = properties.map((p) => p.id);
    let sorted: number[];
    let label: string;

    switch (sortType) {
      case "tokko-newest":
        sorted = [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          const dateA = pa?.updatedAt ? new Date(pa.updatedAt).getTime() : 0;
          const dateB = pb?.updatedAt ? new Date(pb.updatedAt).getTime() : 0;
          return dateB - dateA;
        });
        label = "Orden cronológico (más recientes)";
        break;
      case "tokko-oldest":
        sorted = [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          const dateA = pa?.updatedAt ? new Date(pa.updatedAt).getTime() : 0;
          const dateB = pb?.updatedAt ? new Date(pb.updatedAt).getTime() : 0;
          return dateA - dateB;
        });
        label = "Orden cronológico (más antiguas)";
        break;
      case "alpha-asc":
        sorted = [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          return (pa?.title || "").localeCompare(pb?.title || "", "es");
        });
        label = "Orden alfabético A → Z";
        break;
      case "alpha-desc":
        sorted = [...ids].sort((a, b) => {
          const pa = properties.find((p) => p.id === a);
          const pb = properties.find((p) => p.id === b);
          return (pb?.title || "").localeCompare(pa?.title || "", "es");
        });
        label = "Orden alfabético Z → A";
        break;
      default:
        return;
    }

    if (window.confirm(`¿Aplicar "${label}" como orden persistente? Esto sobrescribirá el orden editorial actual.`)) {
      setViewSort(sortType);
      applyBulkSort(sorted, label);
    }
  };

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "visible", "hidden", "featured", "reserved", "sold"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full border px-3 py-1.5 text-caption tracking-wider transition-all duration-200"
            style={{
              borderColor: filter === f ? "var(--color-brand-gold)" : "var(--color-border)",
              color: filter === f ? "var(--color-brand-gold)" : "var(--color-text-muted)",
              backgroundColor: filter === f ? "rgba(206, 184, 138, 0.1)" : "transparent",
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
          ORDEN:
        </span>
        {(["editorial", "tokko-newest", "tokko-oldest", "alpha-asc", "alpha-desc"] as ViewSort[]).map((s) => (
          <button
            key={s}
            onClick={() => handleApplySort(s)}
            disabled={bulkSaving}
            className="rounded-full border px-3 py-1.5 text-caption tracking-wider transition-all duration-200 disabled:opacity-50"
            style={{
              borderColor: viewSort === s ? "var(--color-brand-gold)" : "var(--color-border)",
              color: viewSort === s ? "var(--color-brand-gold)" : "var(--color-text-muted)",
              backgroundColor: viewSort === s ? "rgba(206, 184, 138, 0.1)" : "transparent",
            }}
          >
            {VIEW_SORT_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mt-3 rounded-lg px-3 py-2 text-caption" style={{ backgroundColor: STATUS_TINTS.available, color: STATUS_COLORS.available }}>
          {successMsg}
        </div>
      )}

      {bulkSaving && (
        <div className="mt-3 rounded-lg px-3 py-2 text-caption" style={{ backgroundColor: "rgba(206, 184, 138, 0.1)", color: "var(--color-brand-gold)" }}>
          Aplicando orden...
        </div>
      )}

      {/* Search */}
      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, ID, ubicación..."
          className="w-full rounded-xl border px-4 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Property List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-body-sm" style={{ color: "var(--color-text-muted)" }}>
            No se encontraron propiedades
          </p>
        )}

        {filtered.map((propertyId) => {
          const property = properties.find((p) => p.id === propertyId);
          if (!property) return null;

          const visible = isVisible(property.id);
          const featured = isFeatured(property.id);
          const status = getStatus(property.id);
          const sortOrder = getSortOrder(property.id);
          const isSaving = saving === property.id;
          const mainImage = property.media.images.find((img) => img.isFrontCover) || property.media.images[0];

          return (
            <div
              key={property.id}
              className="rounded-xl border p-4 transition-all duration-200"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                opacity: visible ? 1 : 0.6,
              }}
            >
              <div className="flex gap-4">
                {/* Sort Order Controls */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveProperty(property.id, "up")}
                    disabled={isSaving || bulkSaving}
                    className="rounded border px-1.5 py-0.5 text-caption transition-colors disabled:opacity-30"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    title="Subir"
                  >
                    ▲
                  </button>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(property.id, e.target.value)}
                    disabled={isSaving || bulkSaving}
                    className="w-12 rounded border px-1 py-0.5 text-center text-caption outline-none disabled:opacity-50"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-background)",
                      color: "var(--color-text-primary)",
                    }}
                    title={`Orden: ${sortOrder}`}
                  />
                  <button
                    onClick={() => moveProperty(property.id, "down")}
                    disabled={isSaving || bulkSaving}
                    className="rounded border px-1.5 py-0.5 text-caption transition-colors disabled:opacity-30"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    title="Bajar"
                  >
                    ▼
                  </button>
                </div>

                {/* Image */}
                <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  {mainImage ? (
                    <Image
                      src={mainImage.thumbnailUrl}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-caption"
                      style={{ backgroundColor: "var(--color-background)", color: "var(--color-text-muted)" }}
                    >
                      SIN FOTO
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className="font-display text-sm font-medium truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {property.title}
                      </h3>
                      <p className="mt-0.5 text-caption" style={{ color: "var(--color-text-muted)" }}>
                        ID: {property.id} | {property.location.city || "Sin ubicación"}
                        {property.updatedAt && (
                          <> | Actualizado: {new Date(property.updatedAt).toLocaleDateString("es-AR")}</>
                        )}
                      </p>
                      {property.prices[0] && (
                        <p className="mt-0.5 text-caption" style={{ color: "var(--color-brand-gold)" }}>
                          USD {property.prices[0].amount.toLocaleString("es-AR")}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-caption"
                      style={{
                        backgroundColor: STATUS_TINTS[status],
                        color: STATUS_COLORS[status],
                      }}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ToggleButton
                      label={visible ? "Visible" : "Oculta"}
                      active={visible}
                      onClick={() => updateOverride(property.id, { visible: !visible })}
                      activeColor={STATUS_COLORS.available}
                      disabled={isSaving}
                    />
                    <ToggleButton
                      label={featured ? "Destacada" : "Destacar"}
                      active={featured}
                      onClick={() => updateOverride(property.id, { featured: !featured })}
                      activeColor="var(--color-brand-gold)"
                      disabled={isSaving}
                    />
                    <select
                      value={status}
                      onChange={(e) =>
                        updateOverride(property.id, {
                          editorialStatus: e.target.value as EditorialStatus,
                        })
                      }
                      disabled={isSaving}
                      className="rounded-lg border px-2 py-1 text-caption outline-none"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-background)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <option value="available">Disponible</option>
                      <option value="reserved">Reservada</option>
                      <option value="sold">Vendida</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
  activeColor,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border px-2 py-1 text-caption transition-all duration-200 disabled:opacity-50"
      style={{
        borderColor: active ? activeColor : "var(--color-border)",
        color: active ? activeColor : "var(--color-text-muted)",
        backgroundColor: active ? `${activeColor}15` : "transparent",
      }}
    >
      {label}
    </button>
  );
}

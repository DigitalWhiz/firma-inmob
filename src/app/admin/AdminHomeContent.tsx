"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import type { Property } from "@/types/property";
import type { HomeContent } from "@/types/editorial";
import { STATUS_COLORS, STATUS_TINTS } from "@/config/status";
import { revalidateTokko } from "./actions";

interface AdminHomeContentProps {
  properties: Property[];
  homeContent: HomeContent;
}

type SelectorMode = "hero" | "featured" | null;

export default function AdminHomeContent({
  properties,
  homeContent,
}: AdminHomeContentProps) {
  const [localContent, setLocalContent] = useState<HomeContent>({
    heroPropertyId: homeContent.heroPropertyId,
    featuredPropertyIds: [...homeContent.featuredPropertyIds],
  });
  const [selectorMode, setSelectorMode] = useState<SelectorMode>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const heroProperty = useMemo(() => {
    if (localContent.heroPropertyId === null) return null;
    return properties.find((p) => p.id === localContent.heroPropertyId) ?? null;
  }, [properties, localContent.heroPropertyId]);

  const featuredProperties = useMemo(() => {
    return localContent.featuredPropertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is Property => p !== undefined);
  }, [properties, localContent.featuredPropertyIds]);

  const filteredProperties = useMemo(() => {
    const usedIds = new Set<number>();
    if (selectorMode === "featured") {
      localContent.featuredPropertyIds.forEach((id) => usedIds.add(id));
    }
    // Hero also excluded from featured
    if (localContent.heroPropertyId !== null) {
      usedIds.add(localContent.heroPropertyId);
    }

    return properties.filter((p) => {
      if (usedIds.has(p.id)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.location.city?.toLowerCase().includes(q) ||
          p.location.neighborhood?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [properties, localContent, selectorMode, search]);

  const hasChanges = useMemo(() => {
    return (
      localContent.heroPropertyId !== homeContent.heroPropertyId ||
      JSON.stringify(localContent.featuredPropertyIds) !==
        JSON.stringify(homeContent.featuredPropertyIds)
    );
  }, [localContent, homeContent]);

  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2000);
  }, []);

  const selectHero = useCallback((propertyId: number) => {
    setLocalContent((prev) => ({
      ...prev,
      heroPropertyId: propertyId,
    }));
    setSelectorMode(null);
    setSearch("");
  }, []);

  const removeHero = useCallback(() => {
    setLocalContent((prev) => ({
      ...prev,
      heroPropertyId: null,
    }));
  }, []);

  const addFeatured = useCallback(
    (propertyId: number) => {
      if (localContent.featuredPropertyIds.includes(propertyId)) return;
      if (localContent.featuredPropertyIds.length >= 10) return;
      setLocalContent((prev) => ({
        ...prev,
        featuredPropertyIds: [...prev.featuredPropertyIds, propertyId],
      }));
      // Don't close modal — allow adding multiple
    },
    [localContent.featuredPropertyIds],
  );

  const removeFeatured = useCallback((propertyId: number) => {
    setLocalContent((prev) => ({
      ...prev,
      featuredPropertyIds: prev.featuredPropertyIds.filter(
        (id) => id !== propertyId,
      ),
    }));
  }, []);

  const moveFeatured = useCallback(
    (index: number, direction: "up" | "down") => {
      setLocalContent((prev) => {
        const ids = [...prev.featuredPropertyIds];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= ids.length) return prev;
        [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
        return { ...prev, featuredPropertyIds: ids };
      });
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/home-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localContent),
      });

      if (res.ok) {
        const { homeContent: saved } = await res.json();
        setLocalContent({
          heroPropertyId: saved.heroPropertyId,
          featuredPropertyIds: [...saved.featuredPropertyIds],
        });
        showSuccess("Contenido del Home actualizado correctamente.");

        // Revalidate home page via server action
        try {
          await revalidateTokko();
        } catch {
          // Non-critical — cache will expire naturally
        }
      } else {
        const data = await res.json();
        showSuccess(`Error: ${data.error || "No se pudieron guardar los cambios"}`);
      }
    } catch {
      showSuccess("Error de conexión");
    } finally {
      setSaving(false);
    }
  }, [localContent, showSuccess]);

  const handleCancel = useCallback(() => {
    setLocalContent({
      heroPropertyId: homeContent.heroPropertyId,
      featuredPropertyIds: [...homeContent.featuredPropertyIds],
    });
    setSearch("");
  }, [homeContent]);

  const closeSelector = useCallback(() => {
    setSelectorMode(null);
    setSearch("");
  }, []);

  const formatPrice = (amount: number, currency: string) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "ARS",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption tracking-widest" style={{ color: "var(--color-brand-gold)" }}>
            CONTENIDO DEL HOME
          </p>
          <h2 className="mt-2 font-display text-xl" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            Configurá qué propiedades se muestran en el Home
          </h2>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mt-4 rounded-lg px-4 py-3 text-body-sm" style={{ backgroundColor: STATUS_TINTS.available, color: STATUS_COLORS.available }}>
          {successMsg}
        </div>
      )}

      {/* ─── HERO SECTION ─── */}
      <div className="mt-8">
        <p className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          PROPIEDAD PRINCIPAL
        </p>

        {heroProperty ? (
          <div className="mt-3 rounded-xl border p-4" style={{ borderColor: "var(--color-brand-gold)", backgroundColor: "rgba(206, 184, 138, 0.05)" }}>
            <div className="flex gap-4">
              <div className="relative h-28 w-36 flex-shrink-0 overflow-hidden rounded-lg">
                {(() => {
                  const img = heroProperty.media.images.find((i) => i.isFrontCover) || heroProperty.media.images[0];
                  return img ? (
                    <Image src={img.thumbnailUrl} alt={heroProperty.title} fill className="object-cover" sizes="144px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-caption" style={{ backgroundColor: "var(--color-background)", color: "var(--color-text-muted)" }}>
                      SIN FOTO
                    </div>
                  );
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                  {heroProperty.title}
                </h3>
                <p className="mt-1 text-caption" style={{ color: "var(--color-text-muted)" }}>
                  {heroProperty.location.neighborhood || heroProperty.location.city || "Sin ubicación"}
                </p>
                {heroProperty.prices[0] && (
                  <p className="mt-1 text-body-sm font-semibold" style={{ color: "var(--color-brand-gold)" }}>
                    {formatPrice(heroProperty.prices[0].amount, heroProperty.prices[0].currency)}
                  </p>
                )}
                {heroProperty.referenceCode && (
                  <p className="mt-1 text-caption" style={{ color: "var(--color-text-muted)" }}>
                    Ref: {heroProperty.referenceCode}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectorMode("hero");
                  setSearch("");
                }}
                className="rounded-lg border px-4 py-2 text-caption tracking-wider transition-colors duration-200 hover:bg-[rgba(206,184,138,0.1)]"
                style={{ borderColor: "var(--color-brand-gold)", color: "var(--color-brand-gold)" }}
              >
                CAMBIAR PROPIEDAD
              </button>
              <button
                onClick={removeHero}
                className="rounded-lg border px-4 py-2 text-caption tracking-wider transition-colors duration-200 hover:bg-[rgba(239,68,68,0.1)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                QUITAR
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setSelectorMode("hero");
              setSearch("");
            }}
            className="mt-3 w-full rounded-xl border-2 border-dashed p-8 text-center transition-colors duration-200 hover:border-[var(--color-brand-gold)] hover:bg-[rgba(206,184,138,0.05)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
          >
            <span className="text-body-sm">+ Seleccionar propiedad principal</span>
          </button>
        )}
      </div>

      {/* ─── FEATURED SECTION ─── */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            PROPIEDADES DESTACADAS ({featuredProperties.length})
          </p>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="mt-3 space-y-2">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-background)" }}
              >
                <span className="flex-shrink-0 w-7 text-center text-caption font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {index + 1}
                </span>
                <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  {(() => {
                    const img = property.media.images.find((i) => i.isFrontCover) || property.media.images[0];
                    return img ? (
                      <Image src={img.thumbnailUrl} alt={property.title} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px]" style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-muted)" }}>
                        SIN FOTO
                      </div>
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-body-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                    {property.title}
                  </h4>
                  <p className="text-caption" style={{ color: "var(--color-text-muted)" }}>
                    {property.location.neighborhood || property.location.city || ""}
                    {property.prices[0] && (
                      <> · {formatPrice(property.prices[0].amount, property.prices[0].currency)}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveFeatured(index, "up")}
                    disabled={index === 0}
                    className="rounded border px-1.5 py-0.5 text-caption transition-colors disabled:opacity-30"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    title="Subir"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveFeatured(index, "down")}
                    disabled={index === featuredProperties.length - 1}
                    className="rounded border px-1.5 py-0.5 text-caption transition-colors disabled:opacity-30"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    title="Bajar"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => removeFeatured(property.id)}
                    className="ml-1 rounded border px-1.5 py-0.5 text-caption transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-body-sm" style={{ color: "var(--color-text-muted)" }}>
            No hay propiedades destacadas seleccionadas.
          </p>
        )}

        {featuredProperties.length < 10 && (
          <button
            onClick={() => {
              setSelectorMode("featured");
              setSearch("");
            }}
            className="mt-3 w-full rounded-xl border-2 border-dashed p-6 text-center transition-colors duration-200 hover:border-[var(--color-brand-gold)] hover:bg-[rgba(206,184,138,0.05)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
          >
            <span className="text-body-sm">+ Agregar propiedad destacada</span>
          </button>
        )}
      </div>

      {/* ─── ACTION BUTTONS ─── */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="rounded-lg px-6 py-3 text-caption font-medium tracking-wider transition-all duration-200 disabled:opacity-50"
          style={{
            backgroundColor: hasChanges ? "var(--color-brand-gold)" : "var(--color-surface)",
            color: hasChanges ? "var(--color-brand-navy)" : "var(--color-text-muted)",
            border: `1px solid ${hasChanges ? "var(--color-brand-gold)" : "var(--color-border)"}`,
          }}
        >
          {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving || !hasChanges}
          className="rounded-lg border px-6 py-3 text-caption tracking-wider transition-colors duration-200 disabled:opacity-50"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          CANCELAR
        </button>
      </div>

      {/* ─── PROPERTY SELECTOR MODAL ─── */}
      {selectorMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeSelector}>
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl"
            style={{ backgroundColor: "var(--color-background)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="font-display text-lg" style={{ color: "var(--color-text-primary)" }}>
                {selectorMode === "hero" ? "Seleccionar propiedad principal" : "Agregar propiedad destacada"}
              </h3>
              <button
                onClick={closeSelector}
                className="rounded-lg p-2 transition-colors hover:bg-[var(--color-surface)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="border-b px-6 py-3" style={{ borderColor: "var(--color-border)" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, ID o ubicación..."
                autoFocus
                className="w-full rounded-xl border px-4 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            {/* Property list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredProperties.length === 0 ? (
                <p className="py-8 text-center text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                  No se encontraron propiedades
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredProperties.map((property) => {
                    const img = property.media.images.find((i) => i.isFrontCover) || property.media.images[0];
                    return (
                      <button
                        key={property.id}
                        onClick={() => {
                          if (selectorMode === "hero") {
                            selectHero(property.id);
                          } else {
                            addFeatured(property.id);
                          }
                        }}
                        className="flex w-full gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:border-[var(--color-brand-gold)] hover:bg-[rgba(206,184,138,0.05)]"
                        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                      >
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          {img ? (
                            <Image src={img.thumbnailUrl} alt={property.title} fill className="object-cover" sizes="80px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px]" style={{ backgroundColor: "var(--color-background)", color: "var(--color-text-muted)" }}>
                              SIN FOTO
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-body-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                            {property.title}
                          </h4>
                          <p className="text-caption" style={{ color: "var(--color-text-muted)" }}>
                            ID: {property.id} · {property.location.neighborhood || property.location.city || "Sin ubicación"}
                          </p>
                          {property.prices[0] && (
                            <p className="mt-0.5 text-caption font-semibold" style={{ color: "var(--color-brand-gold)" }}>
                              {formatPrice(property.prices[0].amount, property.prices[0].currency)}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="border-t px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
              <button
                onClick={closeSelector}
                className="rounded-lg border px-4 py-2 text-caption tracking-wider transition-colors duration-200"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/types/property";
import { CATEGORIES } from "@/config/categories";
import { resolveEditorialStatus } from "@/config/status";
import PropertyStatusBadge from "@/components/property/PropertyStatusBadge";

interface HeroProps {
  property?: Property | null;
  /** Unique localities extracted on the server from the active inventory. */
  availableLocations: string[];
}

export default function Hero({ property, availableLocations }: HeroProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const image = property?.media.images.find((img) => img.isFrontCover)
    || property?.media.images[0];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType) params.set("tipo", selectedType);
    if (selectedCity) params.set("ubicacion", selectedCity);
    if (selectedPrice) params.set("precio", selectedPrice);
    const query = params.toString();
    router.push(query ? `/propiedades?${query}` : "/propiedades");
  };

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-hidden md:min-h-[calc(100svh-5rem)]">
      {image && (
        <Image
          src={image.originalUrl || image.imageUrl}
          alt={property?.title || "FIRMA Calamuchita"}
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 70vw"
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(23,15,51,0.45) 0%, rgba(23,15,51,0.15) 40%, rgba(23,15,51,0.7) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pb-12 pt-8 md:px-6 md:pb-24 md:pt-0">
        <div className="animate-fade-in-up">
          <p
            className="inline-flex items-center gap-2 text-caption tracking-widest"
            style={{ color: "var(--color-brand-gold)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            SELECCIÓN FIRMA
          </p>
        </div>

        <h1
          className="mt-6 max-w-3xl font-display leading-[1.05] animate-fade-in-up delay-100"
          style={{
            color: "var(--color-white)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Tu próxima propiedad
          <br />
          te está esperando
        </h1>

        <p
          className="mt-6 max-w-md text-body-lg animate-fade-in-up delay-200"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Descubrí las mejores propiedades en Calamuchita.
          Casas, terrenos, departamentos y más.
        </p>

        {/* Search bar */}
        <div className="mt-8 w-full max-w-3xl animate-fade-in-up delay-300">
          <div
            className="flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex-1">
              <label className="block text-[10px] font-medium tracking-wider text-white/60 mb-1 px-2">
                Tipo de propiedad
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-body-sm text-white outline-none border-none"
              >
                <option value="" className="text-gray-900">Todas</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="text-gray-900">
                    {cat.pluralLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden h-10 w-px bg-white/20 md:block" />

            <div className="flex-1">
              <label className="block text-[10px] font-medium tracking-wider text-white/60 mb-1 px-2">
                Ubicación
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-body-sm text-white outline-none border-none"
              >
                <option value="" className="text-gray-900">Todas las zonas</option>
                {availableLocations.map((location) => (
                  <option key={location} value={location} className="text-gray-900">
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden h-10 w-px bg-white/20 md:block" />

            <div className="flex-1">
              <label className="block text-[10px] font-medium tracking-wider text-white/60 mb-1 px-2">
                Precio
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-body-sm text-white outline-none border-none"
              >
                <option value="" className="text-gray-900">Todos los precios</option>
                <option value="0-50000" className="text-gray-900">Hasta USD 50.000</option>
                <option value="50000-100000" className="text-gray-900">USD 50.000 - 100.000</option>
                <option value="100000-200000" className="text-gray-900">USD 100.000 - 200.000</option>
                <option value="200000-500000" className="text-gray-900">USD 200.000 - 500.000</option>
                <option value="500000-" className="text-gray-900">Mas de USD 500.000</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-body-sm font-semibold tracking-wider transition-all duration-200 hover:shadow-lg md:mt-0 mt-1"
              style={{
                backgroundColor: "var(--color-brand-gold)",
                color: "var(--color-brand-navy)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Buscar
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-6 flex flex-wrap gap-2 animate-fade-in-up delay-400">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/propiedades/${cat.slug}`}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-medium tracking-wider text-white/90 transition-all duration-200 hover:bg-white/15"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {cat.pluralLabel}
            </Link>
          ))}
        </div>
      </div>

      {/* Floating property card — desktop */}
      {property && (
        <HeroPropertyCard property={property} />
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to top, var(--color-background), transparent)",
        }}
      />
    </section>
  );
}

function HeroPropertyCard({ property }: { property: Property }) {
  const img = property.media.images.find((i) => i.isFrontCover) || property.media.images[0];
  const price = property.prices[0];
  const location = property.location.neighborhood || property.location.city || "";

  return (
    <div className="absolute bottom-32 right-6 z-10 hidden w-80 animate-slide-in-right delay-500 lg:block">
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div className="relative h-44 overflow-hidden">
          {img && (
            <Image
              src={img.imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              sizes="320px"
            />
          )}
          <div className="absolute top-3 left-3">
            <PropertyStatusBadge
              status={resolveEditorialStatus(property)}
              featured
              compact
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
            {property.title}
          </h3>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            {location}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            {property.features.bedrooms && <span>{property.features.bedrooms} dorm</span>}
            {property.features.bathrooms && <span>{property.features.bathrooms} baños</span>}
            {(property.features.landArea || property.features.totalArea) && (
              <span>{property.features.landArea || property.features.totalArea} m²</span>
            )}
          </div>
          {price && (
            <p className="mt-2 text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
              USD {new Intl.NumberFormat("es-AR").format(price.amount)}
            </p>
          )}
          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            Ref: {property.referenceCode || property.id}
          </p>
          <Link
            href={`/propiedades/${property.slug}`}
            className="mt-3 flex items-center justify-center gap-1 rounded-xl py-2.5 text-[11px] font-semibold tracking-wider transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: "var(--color-brand-gold)",
              color: "var(--color-brand-navy)",
            }}
          >
            Ver propiedad
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

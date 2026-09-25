"use client";

import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/types/property";
import type { EditorialStatus } from "@/types/editorial";
import { resolveEditorialStatus } from "@/config/status";
import PropertyStatusBadge from "./PropertyStatusBadge";
import { trackConversion } from "@/lib/analytics";

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

const TYPE_LABELS: Record<string, string> = {
  house: "CASA",
  land: "TERRENO",
  business_permit: "COMPLEJO",
  countryside: "CAMPO",
  apartment: "DEPARTAMENTO",
  other: "PROPIEDAD",
};

interface PropertyCardProps {
  property: Property;
  variant?: "editorial" | "featured" | "compact";
  featured?: boolean;
  editorialStatus?: EditorialStatus;
}

export default function PropertyCard({
  property,
  variant = "editorial",
  featured = false,
  editorialStatus,
}: PropertyCardProps) {
  const mainImage = property.media.images.find((img) => img.isFrontCover)
    || property.media.images[0];

  const price = property.prices[0];
  const typeLabel = TYPE_LABELS[property.type] || "PROPIEDAD";
  const location = property.location.neighborhood
    || property.location.city
    || "";

  const status = editorialStatus ?? resolveEditorialStatus(property);

  if (variant === "compact") {
    return (
      <Link
        href={`/propiedades/${property.slug}`}
        className="group flex min-w-0 gap-4"
      >
        {mainImage && (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={mainImage.thumbnailUrl}
              alt={property.title}
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="96px"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
            {typeLabel} {location && `· ${location}`}
          </span>
          <h3 className="mt-1 text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            {property.title}
          </h3>
          {price && (
            <p className="mt-1 text-body-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {formatPrice(price.amount, price.currency)}
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/propiedades/${property.slug}`}
        className="group relative block min-w-0 overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
      >
        {mainImage && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={mainImage.imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        )}
        {/* Badges top-left */}
        <div className="absolute top-3 left-3 z-10">
          <PropertyStatusBadge status={status} featured={featured} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
          <span className="text-[10px] md:text-caption" style={{ color: "var(--color-brand-gold)" }}>
            {typeLabel} {location && `· ${location}`}
          </span>
          <h3 className="mt-1 md:mt-2 font-display text-base md:text-xl text-white line-clamp-2">
            {property.title}
          </h3>
          {price && (
            <p className="mt-1 md:mt-2 text-sm md:text-body-lg font-semibold text-white">
              {formatPrice(price.amount, price.currency)}
            </p>
          )}
        </div>
      </Link>
    );
  }

  // editorial variant (default)
  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className="group block min-w-0 rounded-2xl transition-shadow duration-300 hover:shadow-lg"
    >
      {mainImage && (
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
<Image
              src={mainImage.imageUrl}
              alt={property.title}
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 33vw"
            />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10">
            <PropertyStatusBadge status={status} featured={featured} />
          </div>
          {/* CTA on hover */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span
              onClick={() => trackConversion({ event: "property_viewed", propertyId: property.id, status })}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#272F51] backdrop-blur-sm"
            >
              VER DETALLE →
            </span>
          </div>
        </div>
      )}
      <div className="mt-2 md:mt-4">
        <span className="text-[10px] md:text-caption" style={{ color: "var(--color-text-muted)" }}>
          {typeLabel} {location && `· ${location}`}
        </span>
        <h3 className="mt-1 md:mt-2 font-display text-base md:text-lg line-clamp-2" style={{ color: "var(--color-text-primary)" }}>
          {property.title}
        </h3>
        {price && (
          <p className="mt-1 md:mt-2 text-sm md:text-body-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {formatPrice(price.amount, price.currency)}
          </p>
        )}
        <div className="mt-1.5 md:mt-3 flex flex-wrap gap-2 md:gap-4 text-xs md:text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          {property.referenceCode && (
            <span>Ref: {property.referenceCode}</span>
          )}
          {property.features.bedrooms && (
            <span>{property.features.bedrooms} dorm</span>
          )}
          {property.features.bathrooms && (
            <span>{property.features.bathrooms} baños</span>
          )}
          {(property.features.landArea || property.features.totalArea || property.features.coveredArea) && (
            <span>{property.features.landArea || property.features.totalArea || property.features.coveredArea} m²</span>
          )}
        </div>
      </div>
    </Link>
  );
}

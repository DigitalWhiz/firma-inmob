"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types/property";
import { ADVISORS } from "@/data/advisors";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface PropertyHeroProps {
  property: Property;
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

const TYPE_LABELS: Record<string, string> = {
  house: "CASA",
  land: "TERRENO",
  business_permit: "COMPLEJO",
  countryside: "CAMPO",
  apartment: "DEPARTAMENTO",
  other: "PROPIEDAD",
};

export default function PropertyHero({ property }: PropertyHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdvisors, setShowAdvisors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainImage = property.media.images.find((img) => img.isFrontCover)
    || property.media.images[0];

  const hasVideo = property.media.videos.length > 0;
  const price = property.prices[0];
  const typeLabel = TYPE_LABELS[property.type] || "PROPIEDAD";
  const location =
    [property.location.neighborhood, property.location.city]
      .filter(Boolean)
      .join(", ") || "Calamuchita";

  const whatsappMessage = `Hola, quiero consultar por la propiedad "${property.title}" de FIRMA Calamuchita.`;

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showAdvisors) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAdvisors(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAdvisors]);

  return (
    <section className="relative h-[45vh] min-h-[280px] w-full overflow-hidden bg-black md:h-[80vh] md:min-h-[500px]">
      {mainImage && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: loaded ? 1 : 0 }}
        >
<Image
              src={mainImage.imageUrl}
              alt={property.title}
              fill
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
              className="object-cover"
              sizes="100vw"
              priority
            />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      <Link
        href="/propiedades"
        className="absolute left-4 top-24 z-10 flex items-center gap-2 text-body-sm text-white/70 transition-colors duration-200 hover:text-white md:left-6 md:top-28"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        VOLVER
      </Link>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 transition-all duration-700 md:px-6 md:pb-12"
        style={{
          transform: scrolled ? "translateY(20px)" : "translateY(0)",
          opacity: scrolled ? 0.8 : 1,
        }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-caption tracking-widest text-white backdrop-blur-sm">
                  {typeLabel}
                </span>
                {hasVideo && (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-caption tracking-widest text-white backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    VIDEO
                  </span>
                )}
              </div>

              <h1
                className="mt-3 max-w-full overflow-hidden font-display text-2xl text-white md:mt-4 md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {property.title}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-xs md:text-body-sm text-white/80">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </div>

              {price && (
                <p className="mt-3 font-display text-xl text-[var(--color-brand-gold)] md:mt-4 md:text-3xl">
                  {formatPrice(price.amount, price.currency)}
                </p>
              )}

              {property.referenceCode && (
                <p className="mt-2 text-caption text-white/60">
                  Ref: {property.referenceCode}
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAdvisors(!showAdvisors)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-body-sm font-medium tracking-wider text-white transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  CONSULTAR
                </button>

                {showAdvisors && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-background)" }}>
                    <p className="px-4 pt-3 text-caption" style={{ color: "var(--color-text-muted)" }}>
                      ¿CON QUIÉN QUERÉS HABLAR?
                    </p>
                    <div className="pb-2">
                      {ADVISORS.map((advisor) => (
                        <a
                          key={advisor.id}
                          href={getWhatsAppUrl(advisor.phone, whatsappMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:bg-gray-50"
                          onClick={() => setShowAdvisors(false)}
                        >
                          <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
                            style={{ backgroundColor: "var(--color-brand-navy)" }}
                          >
                            {advisor.name.charAt(0)}
                          </div>
                          <span className="text-body-sm" style={{ color: "var(--color-text-primary)" }}>
                            {advisor.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {property.urls.fichaUrl && (
                <a
                  href={property.urls.fichaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-body-sm font-medium tracking-wider text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
                >
                  FICHA ORIGINAL
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

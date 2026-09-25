"use client";

import Link from "next/link";
import { CATEGORIES } from "@/config/categories";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ICONS: Record<string, React.ReactNode> = {
  casas: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  departamentos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 10h.01M15 10h.01" />
    </svg>
  ),
  terrenos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  complejos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 7v14M21 7v14M6 11h.01M6 15h.01M10 11h.01M10 15h.01M14 11h.01M14 15h.01M18 11h.01M18 15h.01M12 2l-9 5h18l-9-5z" />
    </svg>
  ),
  campos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12" />
      <path d="M2 22l4-4M7 22l3-5M13 22l1-4M19 22l-1-3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function CategoryCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-caption tracking-widest mb-3" style={{ color: "var(--color-brand-gold)" }}>
              EXPLORAR
            </p>
            <h2 className="text-display-md font-display" style={{ color: "var(--color-text-primary)" }}>
              Tipos de Propiedad
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-body-md" style={{ color: "var(--color-text-muted)" }}>
              Encontrá la propiedad ideal en el Valle de Calamuchita
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 100}>
              <Link
                href={`/propiedades/${cat.slug}`}
                className="group flex flex-col items-center rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "rgba(206,184,138,0.1)",
                    color: "var(--color-brand-gold)",
                  }}
                >
                  {ICONS[cat.slug]}
                </div>
                <h3
                  className="font-display text-sm font-medium tracking-wide"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {cat.pluralLabel}
                </h3>
                <p className="mt-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  {cat.description.split(".")[0]}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--color-brand-gold)" }}>
                  Ver todas
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

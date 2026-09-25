import Link from "next/link";
import type { Property } from "@/types/property";
import type { FirmaCategory } from "@/config/categories";
import PropertyGrid from "./PropertyGrid";
import EmptyState from "./EmptyState";

interface PropertyCategoryPageProps {
  category: FirmaCategory;
  properties: Property[];
}

export default function PropertyCategoryPage({
  category,
  properties,
}: PropertyCategoryPageProps) {
  return (
    <>
      <section
        className="px-4 pt-20 pb-10 md:px-6 md:pt-40 md:pb-24"
        style={{ backgroundColor: "var(--color-brand-navy)" }}
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-caption tracking-widest text-[var(--color-brand-gold)]">
            FIRMA CALAMUCHITA
          </p>
          <h1
            className="mt-4 font-display text-4xl text-white md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {category.pluralLabel.toUpperCase()}
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            {category.description}
          </p>
          <div className="mt-6 flex items-center gap-3 text-body-sm text-white/60">
            <Link
              href="/propiedades"
              className="transition-colors duration-200 hover:text-white"
            >
              PROPIEDADES
            </Link>
            <span>/</span>
            <span className="text-white">{category.pluralLabel.toUpperCase()}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex min-w-0 items-end justify-between">
            <div>
              <p
                className="text-caption"
                style={{ color: "var(--color-brand-gold)" }}
              >
                {properties.length} {properties.length === 1 ? "propiedad" : "propiedades"}
              </p>
              <h2
                className="mt-2 font-display text-2xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                {category.pluralLabel.toUpperCase()} EN VENTA
              </h2>
            </div>
            <Link
              href="/propiedades"
              className="hidden text-body-sm font-medium tracking-wider text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand-gold)] md:block"
            >
              VER TODAS →
            </Link>
          </div>

          <div className="mt-6 md:mt-10">
            {properties.length > 0 ? (
              <PropertyGrid properties={properties} />
            ) : (
              <EmptyState
                title={`No hay ${category.pluralLabel.toLowerCase()} disponibles`}
                description="Actualmente no tenemos propiedades de esta categoría en nuestro catálogo. Contactanos para conocer las novedades."
              />
            )}
          </div>

          <div
            className="mt-8 rounded-lg p-4 md:mt-16 md:p-8 text-center"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <h3
              className="font-display text-lg md:text-xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              ¿BUSCÁS ALGO ESPECÍFICO?
            </h3>
            <p
              className="mt-1.5 md:mt-2 text-body-sm md:text-body"
              style={{ color: "var(--color-text-muted)" }}
            >
              Contactanos y te ayudamos a encontrar la propiedad ideal.
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-colors duration-200"
              style={{ backgroundColor: "var(--color-brand-gold)" }}
            >
              CONTACTANOS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

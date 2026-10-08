import type { Metadata } from "next";
import Link from "next/link";
import { createFirmaProvider } from "@/lib/firma/provider";
import { parsePropertySearchParams, getUniqueLocalities, type SearchParamsRecord } from "@/lib/filters";
import PropertyFiltersBar from "@/components/property/PropertyFiltersBar";

export const metadata: Metadata = {
  title: "Propiedades en Calamuchita",
  description:
    "Catálogo completo de propiedades en venta en el Valle de Calamuchita. Casas, departamentos, terrenos, complejos y campos.",
  openGraph: {
    title: "Propiedades en Calamuchita — FIRMA",
    description:
      "Catálogo completo de propiedades en venta en el Valle de Calamuchita.",
  },
};

interface PropiedadesPageProps {
  searchParams: Promise<SearchParamsRecord>;
}

export default async function PropiedadesPage({
  searchParams,
}: PropiedadesPageProps) {
  const filters = parsePropertySearchParams(await searchParams);
  const provider = createFirmaProvider();
  const allProperties = await provider.getPublicProperties();
  const results = await provider.getPublicProperties(filters);
  // Server-side extraction — client only ever receives this string[].
  const availableLocations = getUniqueLocalities(allProperties);

  return (
    <>
      <section
        className="px-4 pt-8 pb-10 md:px-6 md:pt-24 md:pb-24"
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
            PROPIEDADES
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            Explorá nuestro catálogo completo de propiedades en venta en el
            Valle de Calamuchita.
          </p>
          <p className="mt-3 text-body-sm text-white/60">
            {results.length} propiedades disponibles
          </p>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <PropertyFiltersBar
            properties={allProperties}
            availableLocations={availableLocations}
            initialFilters={filters}
          />
        </div>
      </section>

      <section
        className="px-4 py-8 md:px-6 md:py-16 lg:py-20"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-[1440px] text-center">
          <h2
            className="font-display text-xl md:text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            ¿ENCONTRASTE LO QUE BUSCÁS?
          </h2>
          <p
            className="mt-2 md:mt-3 text-body-sm md:text-body"
            style={{ color: "var(--color-text-muted)" }}
          >
            Si no encontrás la propiedad ideal, contactanos y te ayudamos a
            encontrarla.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-colors duration-200"
            style={{ backgroundColor: "var(--color-brand-gold)" }}
          >
            CONTACTANOS
          </Link>
        </div>
      </section>
    </>
  );
}

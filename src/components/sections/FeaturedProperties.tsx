import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Property } from "@/types/property";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({
  properties,
}: FeaturedPropertiesProps) {
  const featured = properties.slice(0, 6);

  if (featured.length === 0) return null;

  const first = featured[0];
  const rest = featured.slice(1);

  return (
    <section className="px-4 py-8 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal>
          <div className="flex min-w-0 items-end justify-between">
            <div>
              <p className="text-caption text-[var(--color-brand-gold)]">
                SELECCIÓN FIRMA
              </p>
              <h2
                className="mt-3 font-display"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                PROPIEDADES DESTACADAS
              </h2>
            </div>
            <Link
              href="/propiedades"
              className="hidden text-body-sm font-medium tracking-wider text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand-gold)] md:block"
            >
              VER TODAS →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-6 min-w-0 md:mt-10 grid gap-4 md:gap-6 md:grid-cols-12">
          <ScrollReveal delay={100} className="md:col-span-7">
            <PropertyCard property={first} variant="featured" featured />
          </ScrollReveal>
          <div className="flex flex-col gap-4 md:gap-6 md:col-span-5">
            {rest.slice(0, 2).map((property, i) => (
              <ScrollReveal key={property.id} delay={200 + i * 100}>
                <PropertyCard
                  property={property}
                  variant="compact"
                  featured
                />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {rest.length > 2 && (
          <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-3">
            {rest.slice(2).map((property, i) => (
              <ScrollReveal key={property.id} delay={400 + i * 100}>
                <PropertyCard
                  property={property}
                  variant="editorial"
                  featured
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-body-sm font-medium tracking-wider text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
          >
            VER TODAS →
          </Link>
        </div>
      </div>
    </section>
  );
}

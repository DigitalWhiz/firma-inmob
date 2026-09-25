import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createFirmaProvider } from "@/lib/firma/provider";
import { getCategoryByTokkoType } from "@/config/categories";
import PropertyHero from "@/components/property/PropertyHero";
import PropertyMediaGallery from "@/components/property/PropertyMediaGallery";
import PropertyVideoIndicator from "@/components/property/PropertyVideoIndicator";
import PropertyInformation from "@/components/property/PropertyInformation";
import PropertyLocation from "@/components/property/PropertyLocation";
import PropertyContact from "@/components/property/PropertyContact";
import PropertyRelated from "@/components/property/PropertyRelated";
import WhatsAppStickyCTA from "@/components/property/WhatsAppStickyCTA";
import PropertyShare from "@/components/property/PropertyShare";
import FavoriteButton from "@/components/property/FavoriteButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import JsonLd, { buildPropertyJsonLd, buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PropertyStatusBadge from "@/components/property/PropertyStatusBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = createFirmaProvider();
  const property = await provider.getPropertyBySlug(slug);

  if (!property) return { title: "Propiedad no encontrada" };

  const category = getCategoryByTokkoType(property.type);
  const price = property.prices[0];
  const priceStr = price ? formatPrice(price.amount, price.currency) : "";
  const location = property.location.neighborhood || property.location.city || "Calamuchita";

  return {
    title: `${property.title} — ${priceStr}`,
    description:
      property.description?.slice(0, 160) ||
      `${category?.pluralLabel || "Propiedad"} en venta en ${location}. FIRMA Calamuchita.`,
    openGraph: {
      title: property.title,
      description:
        property.description?.slice(0, 200) ||
        `${category?.pluralLabel || "Propiedad"} en venta en ${location}.`,
      images: property.media.images[0]
        ? [{ url: property.media.images[0].imageUrl, width: 1200, height: 630 }]
        : [],
    },
  };
}

export const revalidate = 1800;

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = createFirmaProvider();
  const property = await provider.getPropertyBySlug(slug);

  if (!property) notFound();

  const price = property.prices[0];
  const category = getCategoryByTokkoType(property.type);
  const location =
    [property.location.neighborhood, property.location.city]
      .filter(Boolean)
      .join(", ") || "Calamuchita";
  const relatedProperties = await provider.getRelatedProperties(property, 4);
  const hasVideo = property.media.videos.length > 0;
  const hasImages = property.media.images.length > 0;
  const posterImage = property.media.images.find((img) => img.isFrontCover) || property.media.images[0];

  return (
    <>
      <JsonLd
        data={buildPropertyJsonLd({
          title: property.title,
          description: property.description,
          price: price?.amount,
          currency: price?.currency,
          location: property.location.city || "Calamuchita",
          image: posterImage?.imageUrl,
          url: `https://firmacalamuchita.com/propiedades/${property.slug}`,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Inicio", url: "https://firmacalamuchita.com" },
          { name: "Propiedades", url: "https://firmacalamuchita.com/propiedades" },
          ...(category ? [{ name: category.pluralLabel, url: `https://firmacalamuchita.com/propiedades/${category.slug}` }] : []),
          { name: property.title, url: `https://firmacalamuchita.com/propiedades/${property.slug}` },
        ])}
      />

      <WhatsAppStickyCTA propertyTitle={property.title} />

      <PropertyHero property={property} />

        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 md:py-12">
        <div className="grid min-w-0 gap-6 md:gap-10 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <ScrollReveal>
              <div className="flex min-w-0 items-center gap-3 text-caption text-[var(--color-text-muted)]">
                <Link
                  href="/propiedades"
                  className="transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                >
                  PROPIEDADES
                </Link>
                <span>/</span>
                {category && (
                  <>
                    <Link
                      href={`/propiedades/${category.slug}`}
                      className="transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                    >
                      {category.pluralLabel.toUpperCase()}
                    </Link>
                    <span>/</span>
                  </>
                )}
                <span className="text-[var(--color-text-primary)] line-clamp-1">
                  {property.title}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="mt-6 flex min-w-0 items-start justify-between gap-4">
                <h1
                  className="min-w-0 flex-1 overflow-hidden font-display text-3xl md:text-4xl"
                  style={{
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {property.title}
                </h1>
                <PropertyStatusBadge status={property.editorial.editorialStatus} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="mt-3 flex min-w-0 items-center gap-2 text-body-sm text-[var(--color-text-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </div>
            </ScrollReveal>

            {price && (
            <ScrollReveal delay={200}>
              <p className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap font-display text-3xl" style={{ color: "var(--color-text-primary)" }}>
                  {formatPrice(price.amount, price.currency)}
                </p>
                {property.referenceCode && (
                  <p className="mt-2 text-caption" style={{ color: "var(--color-text-muted)" }}>
                    Ref: {property.referenceCode}
                  </p>
                )}
              </ScrollReveal>
            )}

            <ScrollReveal delay={275} className="mt-6">
              <div className="flex items-center gap-3">
                <PropertyShare title={property.title} slug={property.slug} />
                <FavoriteButton propertyId={property.id} slug={property.slug} />
              </div>
            </ScrollReveal>

            {hasImages && (
              <ScrollReveal delay={250} className="mt-6 md:mt-10">
                <PropertyMediaGallery images={property.media.images} title={property.title} />
              </ScrollReveal>
            )}

            <ScrollReveal delay={300} className="mt-6 md:mt-10">
              <h2 className="font-display text-lg" style={{ color: "var(--color-text-primary)" }}>
                INFORMACIÓN
              </h2>
              <div className="mt-4">
                <PropertyInformation property={property} />
              </div>
            </ScrollReveal>

            {property.description && (
              <ScrollReveal delay={350} className="mt-6 md:mt-10">
                <h2 className="font-display text-lg" style={{ color: "var(--color-text-primary)" }}>
                  DESCRIPCIÓN
                </h2>
                <div
                  className="mt-4 max-w-2xl text-body leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {property.description.split("\n").map((paragraph, i) => (
                    paragraph.trim() ? <p key={i} className={i > 0 ? "mt-4" : ""}>{paragraph}</p> : null
                  ))}
                </div>
              </ScrollReveal>
            )}

            {hasVideo && (
              <ScrollReveal delay={400} className="mt-6 md:mt-10">
                <PropertyVideoIndicator videos={property.media.videos} />
              </ScrollReveal>
            )}

            <ScrollReveal delay={500} className="mt-6 md:mt-10">
              <h2 className="font-display text-lg" style={{ color: "var(--color-text-primary)" }}>
                UBICACIÓN
              </h2>
              <div className="mt-4">
                <PropertyLocation location={property.location} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={550} className="mt-6 md:mt-10">
              <PropertyContact propertyTitle={property.title} />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 hidden lg:block">
              <ScrollReveal delay={300}>
                <PropertyContact propertyTitle={property.title} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {relatedProperties.length > 0 && (
        <ScrollReveal className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
          <div className="mx-auto max-w-[1440px]">
            <PropertyRelated properties={relatedProperties} />
          </div>
        </ScrollReveal>
      )}

      <section
        className="px-4 py-8 md:px-6 md:py-16 lg:py-20"
        style={{ backgroundColor: "var(--color-brand-navy)" }}
      >
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-display text-lg md:text-2xl text-white">
            ¿TE INTERESA ESTA PROPIEDAD?
          </h2>
          <p className="mt-2 md:mt-3 text-body-sm md:text-body text-white/80">
            Contactanos para agendar una visita o recibir más información.
          </p>
          <Link
            href="/contacto"
            className="mt-4 md:mt-6 inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-body-sm font-medium tracking-wider text-[var(--color-brand-navy)] transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "var(--color-brand-gold)" }}
          >
            CONTACTANOS
          </Link>
        </div>
      </section>
    </>
  );
}

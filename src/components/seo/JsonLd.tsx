interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function buildPropertyJsonLd(property: {
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  location?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: property.url,
    ...(property.image && { image: property.image }),
    ...(property.price &&
      property.currency && {
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: property.currency,
          availability: "https://schema.org/InStock",
        },
      }),
    ...(property.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: property.location,
        addressCountry: "AR",
      },
    }),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

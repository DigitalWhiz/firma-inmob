import { ImageResponse } from "next/og";
import { createFirmaProvider } from "@/lib/firma/provider";

export const alt = "FIRMA Calamuchita — Propiedad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 1800;

const BRAND_NAVY = "#272F51";
const BRAND_GOLD = "#CEB88A";

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const mime = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

interface OgCardData {
  title: string;
  price: string | null;
  imageSrc: string | null;
}

async function loadOgCardData(slug: string): Promise<OgCardData> {
  try {
    const provider = createFirmaProvider();
    const property = await provider.getPropertyBySlug(slug);
    if (!property) {
      return { title: "FIRMA Calamuchita", price: null, imageSrc: null };
    }

    const price = property.prices[0];
    const cover =
      property.media.images.find((img) => img.isFrontCover) ||
      property.media.images[0];
    const imageSrc = cover?.imageUrl
      ? await fetchImageAsDataUrl(cover.imageUrl)
      : null;

    return {
      title: property.title,
      price: price ? formatPrice(price.amount, price.currency) : null,
      imageSrc,
    };
  } catch {
    return { title: "FIRMA Calamuchita", price: null, imageSrc: null };
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { title, price, imageSrc } = await loadOgCardData(slug);
  const displayTitle = truncate(title, 90);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
          padding: 64,
          backgroundColor: BRAND_NAVY,
          backgroundImage: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1a1f36 100%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            ...(imageSrc
              ? {
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: BRAND_GOLD,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: BRAND_GOLD,
                textTransform: "uppercase",
              }}
            >
              FIRMA Calamuchita
            </span>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: 1020,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {displayTitle}
          </div>
          {price && (
            <div
              style={{
                marginTop: 24,
                fontSize: 44,
                fontWeight: 700,
                color: BRAND_GOLD,
                display: "flex",
              }}
            >
              {price}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

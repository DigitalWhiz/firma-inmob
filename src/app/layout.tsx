import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/layout/Layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FIRMA Calamuchita | Inmobiliaria Premium",
    template: "%s | FIRMA Calamuchita",
  },
  description:
    "Inmobiliaria premium en el Valle de Calamuchita. Propiedades en venta en Villa Rumipal, Embalse, Santa Rosa de Calamuchita, La Cumbrecita y alrededores, Córdoba, Argentina.",
  metadataBase: new URL("https://firmacalamuchita.com"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "FIRMA Calamuchita",
    title: "FIRMA Calamuchita — Propiedades en Calamuchita",
    description:
      "Propiedades en venta en Villa Rumipal, Embalse y el Valle de Calamuchita, Córdoba, Argentina.",
    url: "https://firmacalamuchita.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRMA Calamuchita — Propiedades en Calamuchita",
    description:
      "Propiedades en venta en Villa Rumipal, Embalse y el Valle de Calamuchita, Córdoba, Argentina.",
    images: ["/assets/brand/logo/firma-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

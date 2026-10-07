import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Layout from "@/components/layout/Layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FIRMA Calamuchita | Inmobiliaria en el Valle de Calamuchita",
    template: "%s | FIRMA Calamuchita",
  },
  description:
    "Firma Inmobiliaria Calamuchita, inmobiliaria local especializada en el Valle de Calamuchita, Córdoba. Casas, departamentos, lotes, cabañas, complejos y campos en venta.",
  metadataBase: new URL("https://firmacalamuchita.com"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "FIRMA Calamuchita",
    title: "FIRMA Calamuchita — Propiedades en Calamuchita",
    description:
      "Propiedades en venta en Santa Rosa de Calamuchita, Villa Rumipal, Villa del Dique, Embalse y el Valle de Calamuchita, Córdoba, Argentina.",
    url: "https://firmacalamuchita.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRMA Calamuchita — Propiedades en Calamuchita",
    description:
      "Propiedades en venta en Santa Rosa de Calamuchita, Villa Rumipal, Villa del Dique, Embalse y el Valle de Calamuchita, Córdoba, Argentina.",
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
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XCP7Y9HD2M"}
        />
        <GoogleTagManager gtmId="GT-5DHD52NH" />
      </body>
    </html>
  );
}

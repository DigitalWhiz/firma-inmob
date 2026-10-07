import type { Metadata } from "next";
import Link from "next/link";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "Valle de Calamuchita",
  description:
    "Conocé el Valle de Calamuchita: Santa Rosa de Calamuchita, Villa Rumipal, Villa del Dique, Embalse, Villa General Belgrano y más destinos en Córdoba, Argentina.",
  openGraph: {
    title: "Valle de Calamuchita — FIRMA",
    description:
      "Conocé el Valle de Calamuchita: destinos únicos en Córdoba, Argentina.",
  },
};

const LOCATIONS = [
  {
    name: "Villa Rumipal",
    description:
      "Villa Rumipal ofrece playa, lago, tranquilidad y pesca, naturaleza a solo minutos de las ciudades.",
  },
  {
    name: "Embalse",
    description:
      "Ciudad turística con acceso rápidos, lago, naturaleza y una vibrante actividad comercial.",
  },
  {
    name: "Villa General Belgrano",
    description:
      "Famosa por su arquitectura germánica y el Oktoberfest, Villa General Belgrano es un destino único todo el año.",
  },
  {
    name: "El Durazno",
    description:
      "Valle rural con campos y quintas, ideal para quienes buscan espacio y naturaleza a minutos de Villa Rumipal.",
  },
];

export default function CalamuchitaPage() {
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
            VALLE DE CALAMUCHITA
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            Un territorio único en el corazón de Córdoba, Argentina.
            Naturaleza y tranquilidad a minutos de las principales ciudades.
          </p>
        </div>
      </section>

      <About />

      <section className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                className="rounded-lg p-3 md:p-6"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <h3
                  className="font-display text-lg md:text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {loc.name.toUpperCase()}
                </h3>
                <p
                  className="mt-2 md:mt-3 text-xs md:text-body-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {loc.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-colors duration-200"
              style={{ backgroundColor: "var(--color-brand-gold)" }}
            >
              VER PROPIEDADES
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

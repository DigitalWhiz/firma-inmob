import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vender tu Propiedad",
  description:
    "Vendé tu propiedad en el Valle de Calamuchita con FIRMA. Asesoramiento personalizado, publicación profesional y acompañamiento completo.",
  openGraph: {
    title: "Vender tu Propiedad — FIRMA Calamuchita",
    description:
      "Vendé tu propiedad en el Valle de Calamuchita con FIRMA.",
  },
};

export default function VenderPage() {
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
            VENDÉ TU PROPIEDAD
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            Te asesoramos en todo el proceso de venta de tu propiedad en el
            Valle de Calamuchita.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:gap-8 md:grid-cols-3">
            <div
              className="rounded-lg p-3 md:p-6"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div
                className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full font-display text-base md:text-lg text-white"
                style={{ backgroundColor: "var(--color-brand-gold)" }}
              >
                1
              </div>
              <h3
                className="mt-3 md:mt-4 font-display text-base md:text-lg"
                style={{ color: "var(--color-text-primary)" }}
              >
                CONSULTA INICIAL
              </h3>
              <p
                className="mt-1.5 md:mt-2 text-xs md:text-body-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Contactanos para una consulta sin compromiso. Evaluamos tu
                propiedad y te informamos sobre el mercado actual.
              </p>
            </div>

            <div
              className="rounded-lg p-3 md:p-6"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div
                className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full font-display text-base md:text-lg text-white"
                style={{ backgroundColor: "var(--color-brand-gold)" }}
              >
                2
              </div>
              <h3
                className="mt-3 md:mt-4 font-display text-base md:text-lg"
                style={{ color: "var(--color-text-primary)" }}
              >
                PUBLICACIÓN PROFESIONAL
              </h3>
              <p
                className="mt-1.5 md:mt-2 text-xs md:text-body-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Fotos profesionales, descripción optimizada y publicación en
                los principales portales inmobiliarios.
              </p>
            </div>

            <div
              className="rounded-lg p-3 md:p-6"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div
                className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full font-display text-base md:text-lg text-white"
                style={{ backgroundColor: "var(--color-brand-gold)" }}
              >
                3
              </div>
              <h3
                className="mt-3 md:mt-4 font-display text-base md:text-lg"
                style={{ color: "var(--color-text-primary)" }}
              >
                CIERRE EXITOSO
              </h3>
              <p
                className="mt-1.5 md:mt-2 text-xs md:text-body-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Acompañamiento completo hasta el cierre de la operación.
                Asesoramiento legal y financiero.
              </p>
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-colors duration-200"
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

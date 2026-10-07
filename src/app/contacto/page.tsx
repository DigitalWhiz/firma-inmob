import type { Metadata } from "next";
import Link from "next/link";
import { ADVISORS } from "@/data/advisors";
import AdvisorCard from "@/components/advisors/AdvisorCard";
import { PHONE_DISPLAY, PHONE_HREF } from "@/config/company";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactanos para consultar por propiedades en el Valle de Calamuchita. Nuestros asesores te ayudan a encontrar la propiedad ideal.",
  openGraph: {
    title: "Contacto — FIRMA Calamuchita",
    description:
      "Contactanos para consultar por propiedades en el Valle de Calamuchita.",
  },
};

export default function ContactoPage() {
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
            HABLEMOS
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            Estamos para ayudarte a encontrar la propiedad ideal en el Valle de
            Calamuchita.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 md:mb-10">
            <p
              className="text-caption"
              style={{ color: "var(--color-text-primary)" }}
            >
              NUESTROS ASESORES
            </p>
            <h2
              className="mt-3 font-display text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              EQUIPO COMERCIAL
            </h2>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {ADVISORS.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>

          <div
            className="mt-6 md:mt-12 rounded-lg p-4 md:p-8 text-center"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <h3
              className="font-display text-xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              INFORMACIÓN GENERAL
            </h3>
            <div className="mt-4 md:mt-6 flex flex-col items-center gap-3 md:gap-4 text-body-sm">
              <a
                href="mailto:info@firmacalamuchita.com"
                className="transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                info@firmacalamuchita.com
              </a>
              <a
                href={PHONE_HREF}
                className="transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {PHONE_DISPLAY}
              </a>
              <p style={{ color: "var(--color-text-muted)" }}>
                Villa Rumipal, Córdoba, Argentina
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-4 py-10 md:px-6 md:py-16 lg:py-20"
        style={{ backgroundColor: "var(--color-brand-navy)" }}
      >
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-display text-2xl text-white">
            ¿QUERÉS VENDER TU PROPIEDAD?
          </h2>
          <p className="mt-3 text-body text-white/80">
            Te asesoramos en todo el proceso de venta de tu propiedad.
          </p>
          <Link
            href="/vender"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-[var(--color-brand-navy)] transition-colors duration-200"
            style={{ backgroundColor: "var(--color-brand-gold)" }}
          >
            VENDER MI PROPIEDAD
          </Link>
        </div>
      </section>
    </>
  );
}

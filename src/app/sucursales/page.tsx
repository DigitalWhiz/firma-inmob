import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sucursales — FIRMA Calamuchita",
  description:
    "Sucursales de FIRMA en el Valle de Calamuchita. Conoce nuestras ubicaciones y cómo contactarnos.",
};

export default function SucursalesPage() {
  const branches = [
    {
      name: "FIRMA INMOB",
      instagram: "https://www.instagram.com/firma.inmob/",
      instagramUser: "@firma.inmob",
      description: "Sucursal principal en el Valle de Calamuchita",
      logo: "/assets/brand/logo/firma-logo.png",
    },
    {
      name: "FIRMA INMOB CALAMUCHITA",
      instagram: "https://www.instagram.com/firma.inmob.calamuchita/",
      instagramUser: "@firma.inmob.calamuchita",
      description:
        "Sucursal exclusiva en Calamuchita. VENTA de propiedades y lotes. Av. Riemann 681 · Villa Rumipal.",
      logo: "/assets/brand/logo/firma-logo.png",
    },
  ];

  return (
    <>
      <section
        className="px-4 pt-32 pb-16 md:px-6 md:pt-40 md:pb-24"
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
            SUCURSALES
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/70">
            Conocé nuestras ubicaciones en el Valle de Calamuchita.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 md:grid-cols-2">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="group overflow-hidden rounded-2xl border transition-colors duration-300 hover:border-[var(--color-brand-gold)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                {branch.logo && (
                  <div className="relative h-48">
                    <Image
                      src={branch.logo}
                      alt={branch.name}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3
                    className="font-display text-2xl"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {branch.name}
                  </h3>
                  <p
                    className="mt-2 text-body-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {branch.description}
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={branch.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-body-sm transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      {branch.instagramUser}
                    </a>

                    <a
                      href="mailto:info@firmacalamuchita.com"
                      className="inline-flex items-center gap-2 text-body-sm transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 4L12 13L2 4" />
                      </svg>
                      info@firmacalamuchita.com
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-16 md:px-6 md:py-20"
        style={{ backgroundColor: "var(--color-brand-navy)" }}
      >
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-display text-2xl text-white">
            ¿QUERÉS VISITARNOS?
          </h2>
          <p className="mt-3 text-body text-white/80">
            Contactanos para agendar una visita o recibir más información.
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium tracking-wider text-[var(--color-brand-navy)] transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "var(--color-brand-gold)" }}
          >
            CONTACTANOS
          </Link>
        </div>
      </section>
    </>
  );
}

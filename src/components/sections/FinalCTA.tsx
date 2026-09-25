import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-12 md:py-24"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand-navy) 0%, var(--color-brand-blue) 100%)",
            }}
          >
            {/* Decorative radial */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, var(--color-brand-gold) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--color-brand-gold) 0%, transparent 40%)",
              }}
            />

            <p className="relative z-10 text-caption tracking-widest" style={{ color: "var(--color-brand-gold)" }}>
              EMPEZÁ AHORA
            </p>
            <h2
              className="relative z-10 mt-4 font-display text-white"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
              }}
            >
              ¿LISTO PARA ENCONTRAR
              <br />
              TU PROPIEDAD?
            </h2>
            <p
              className="relative z-10 mx-auto mt-6 max-w-md text-body-lg"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Explorá nuestra selección o contactanos para una asesoría
              personalizada.
            </p>
            <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-body-sm font-semibold tracking-wider transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: "var(--color-brand-gold)",
                  color: "var(--color-brand-navy)",
                }}
              >
                EXPLORAR PROPIEDADES
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-body-sm font-semibold tracking-wider transition-all duration-300 hover:bg-white/10"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "var(--color-white)",
                }}
              >
                CONTACTAR A FIRMA
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

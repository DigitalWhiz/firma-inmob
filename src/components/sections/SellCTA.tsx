import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function SellCTA() {
  return (
    <section
      className="px-4 py-12 md:px-6 md:py-20 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-navy)" }}
    >
      <div className="mx-auto max-w-[1440px] text-center">
        <ScrollReveal>
          <p className="text-caption text-[var(--color-brand-gold)]">
            VENDER
          </p>
          <h2
            className="mt-4 font-display text-white"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            ¿TENÉS UNA PROPIEDAD
            <br />
            PARA VENDER?
          </h2>
          <p
            className="mx-auto mt-6 max-w-lg text-body-lg"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Te asesoramos desde la tasación hasta la escrituración. Tu propiedad
            merece ser presentada correctamente.
          </p>
          <Link
            href="/vender"
            className="mt-6 md:mt-8 inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-body-sm font-medium tracking-wider transition-all duration-300 hover:gap-3"
            style={{
              backgroundColor: "var(--color-brand-gold)",
              color: "var(--color-brand-navy)",
            }}
          >
            HABLEMOS
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

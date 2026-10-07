import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Territory() {
  return (
    <section
      className="relative overflow-hidden px-4 py-12 md:px-6 md:py-20 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-navy)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, var(--color-brand-blue) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-brand-gold) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
          <ScrollReveal>
            <div>
              <p className="text-caption text-[var(--color-brand-gold)]">
                TERRITORIO
              </p>
              <h2
                className="mt-4 font-display text-white"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                }}
              >
                VALLE DE
                <br />
                CALAMUCHITA
              </h2>
              <p
                className="mt-6 max-w-lg text-body-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Ubicado en el corazón de Córdoba, el Valle de Calamuchita ofrece
                un equilibrio perfecto entre naturaleza, conectividad y
                oportunidad de inversión.
              </p>
              <p
                className="mt-4 max-w-lg leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "var(--font-size-body-md)",
                }}
              >
                Villa Rumipal, Villa del Dique, Santa Rosa de Calamuchita —
                destinos que combinan montañas, lagos y una calidad de vida
                única en la Argentina.
              </p>
              <Link
                href="/calamuchita"
                className="mt-8 inline-flex items-center gap-2 text-body-sm font-medium tracking-wider text-[var(--color-brand-gold)] transition-all duration-300 hover:gap-3"
              >
                CONOCER MÁS
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
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { name: "Villa Rumipal", desc: "Lago y naturaleza" },
              { name: "Embalse", desc: "Aguas claras" },
              { name: "Villa del Dique", desc: "Embalse y sierras" },
            ].map((place, i) => (
              <ScrollReveal key={place.name} delay={200 + i * 100}>
                <div
                  className="flex flex-col items-center rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/10"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="font-display text-lg text-white">
                    {place.name}
                  </span>
                  <span
                    className="mt-1 text-body-sm"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {place.desc}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

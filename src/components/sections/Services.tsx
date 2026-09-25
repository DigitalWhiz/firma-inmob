import ScrollReveal from "@/components/ui/ScrollReveal";

const SERVICES = [
  {
    number: "01",
    title: "COMPRAR",
    description:
      "Encontrá la propiedad que se adapte a tu vida. Desde casas en el lago hasta terrenos para invertir.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "VENDER",
    description:
      "Te acompañamos desde la tasación hasta la escrituración. Tu propiedad en las mejores manos.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "INVERTIR",
    description:
      "El Valle de Calamuchita ofrece oportunidades únicas. Te asesoramos para que tu inversión crezca.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-caption text-[var(--color-brand-gold)]">
              SERVICIOS
            </p>
            <h2
              className="mt-3 font-display"
              style={{
                color: "var(--color-text-primary)",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              ¿QUÉ HACEMOS?
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-8 md:mt-12 grid gap-6 md:gap-8 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <ScrollReveal key={service.number} delay={i * 100}>
              <div
                className="group rounded-2xl border-t pt-6 md:pt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-white)",
                  padding: "1.5rem",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: "rgba(206,184,138,0.1)",
                      color: "var(--color-brand-gold)",
                    }}
                  >
                    {service.icon}
                  </div>
                  <span
                    className="font-display text-2xl md:text-3xl"
                    style={{ color: "var(--color-brand-gold)", opacity: 0.4 }}
                  >
                    {service.number}
                  </span>
                </div>
                <h3
                  className="font-display text-lg md:text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="mt-2 md:mt-3 text-body-sm md:text-body-md leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

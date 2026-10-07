import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  QUIENES_SOMOS,
  DONDE_TRABAJAMOS,
  QUE_VENDEMOS,
  COMO_TRABAJAMOS,
} from "@/config/company";

const BLOCKS = [
  { title: "DÓNDE TRABAJAMOS", description: DONDE_TRABAJAMOS },
  { title: "QUÉ VENDEMOS", description: QUE_VENDEMOS },
  { title: "CÓMO TRABAJAMOS", description: COMO_TRABAJAMOS },
];

export default function About() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-caption text-[var(--color-brand-gold)]">
              NOSOTROS
            </p>
            <h2
              className="mt-3 font-display"
              style={{
                color: "var(--color-text-primary)",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              QUIÉNES SOMOS
            </h2>
            <p
              className="mx-auto mt-5 max-w-3xl text-body-md leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {QUIENES_SOMOS}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 md:mt-12 grid gap-6 md:gap-8 md:grid-cols-3">
          {BLOCKS.map((block, i) => (
            <ScrollReveal key={block.title} delay={i * 100}>
              <div
                className="group rounded-2xl border-t pt-6 md:pt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-white)",
                  padding: "1.5rem",
                }}
              >
                <h3
                  className="font-display text-lg md:text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {block.title}
                </h3>
                <p
                  className="mt-2 md:mt-3 text-body-sm md:text-body-md leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {block.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

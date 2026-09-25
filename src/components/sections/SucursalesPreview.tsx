import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BRANCHES = [
  {
    name: "FIRMA INMOB",
    instagram: "https://www.instagram.com/firma.inmob/",
    instagramUser: "@firma.inmob",
    subtitle: "Sucursal principal",
  },
  {
    name: "FIRMA INMOB CALAMUCHITA",
    instagram: "https://www.instagram.com/firma.inmob.calamuchita/",
    instagramUser: "@firma.inmob.calamuchita",
    subtitle: "Sucursal Calamuchita",
  },
];

export default function SucursalesPreview() {
  return (
    <section
      className="border-y px-4 py-6 md:px-6 md:py-12 lg:py-20"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {BRANCHES.map((branch, i) => (
            <ScrollReveal key={branch.name} delay={i * 100}>
              <div
                className="group rounded-2xl p-3 md:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "var(--color-background)" }}
              >
                <div className="mx-auto flex h-10 w-10 md:h-16 md:w-16 items-center justify-center rounded-full" style={{ backgroundColor: "var(--color-brand-navy)" }}>
                  <span className="font-display text-base md:text-lg font-semibold text-white">
                    {branch.name.split(" ")[0].charAt(0)}
                  </span>
                </div>
                <h3
                  className="mt-2 md:mt-4 font-display text-base md:text-xl"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {branch.name}
                </h3>
                <p className="mt-1 md:mt-2 text-xs md:text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                  {branch.subtitle}
                </p>
                <Link
                  href={branch.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 md:mt-4 inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-body-sm transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  {branch.instagramUser}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/sucursales"
            className="inline-flex items-center gap-2 text-body-sm font-medium tracking-wider text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
          >
            Ver todas las sucursales
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

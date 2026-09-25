import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/calamuchita", label: "Calamuchita" },
  { href: "/contacto", label: "Contacto" },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/vender", label: "Vender" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-brand-navy-dark)" }}
    >
      {/* Subtle radial decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 0%, var(--color-brand-gold) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden">
                <Image
                  src="/assets/brand/logo/firma-logo.png"
                  alt="FIRMA"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <div>
                <span className="font-display text-lg font-semibold tracking-wide text-white">
                  FIRMA
                </span>
                <span className="ml-1 text-[10px] font-medium tracking-widest text-white/50">
                  CALAMUCHITA
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-body-sm text-white/50 leading-relaxed">
              Negocios Inmobiliarios. Tu aliado de confianza en el Valle de
              Calamuchita.
            </p>
            <a
              href="tel:+5493546123456"
              className="mt-4 inline-flex items-center gap-2 text-body-sm text-white/70 transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +54 9 3546 123456
            </a>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-caption text-white/40 tracking-widest">
              Navegación
            </h4>
            <nav className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-white/60 transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="md:col-span-3">
            <h4 className="text-caption text-white/40 tracking-widest">
              Contacto
            </h4>
            <div className="mt-4 flex flex-col gap-2.5">
              <p className="text-body-sm text-white/60">
                Villa Rumipal, Córdoba, Argentina
              </p>
              <a
                href="mailto:info@firmacalamuchita.com"
                className="text-body-sm text-white/60 transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
              >
                info@firmacalamuchita.com
              </a>
            </div>
          </div>

          {/* Instagram */}
          <div className="md:col-span-2">
            <h4 className="text-caption text-white/40 tracking-widest">
              Instagram
            </h4>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href="https://www.instagram.com/firma.inmob/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-white/60 transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
              >
                @firma.inmob
              </a>
              <a
                href="https://www.instagram.com/firma.inmob.calamuchita/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-white/60 transition-colors duration-200 hover:text-[var(--color-brand-gold)]"
              >
                @firma.inmob.calamuchita
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 md:mt-12 md:pt-8"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-caption text-white/50">
              &copy; {new Date().getFullYear()} FIRMA. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-4">
              <span className="text-caption text-white/40">
                Mat. N° 1234 · CUCICBA
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

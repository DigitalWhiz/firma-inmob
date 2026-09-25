"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/calamuchita", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(229,227,223,0.5)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden md:h-12 md:w-12">
              <Image
                src="/assets/brand/logo/firma-logo.png"
                alt="FIRMA Calamuchita"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <div className="hidden flex-col md:flex">
              <span
                className="font-display text-sm font-semibold leading-tight tracking-wide"
                style={{ color: scrolled ? "var(--color-brand-navy)" : "var(--color-white)" }}
              >
                FIRMA
              </span>
              <span
                className="text-[10px] font-medium tracking-widest"
                style={{ color: scrolled ? "var(--color-text-muted)" : "rgba(255,255,255,0.7)" }}
              >
                CALAMUCHITA
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
                style={{
                  color: scrolled
                    ? "var(--color-text-secondary)"
                    : "rgba(255,255,255,0.85)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+5493546123456"
              className="flex items-center gap-2 text-body-sm font-medium transition-colors duration-200"
              style={{ color: scrolled ? "var(--color-text-primary)" : "var(--color-white)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +54 9 3546 123456
            </a>
            <Link
              href="/contacto"
              className="rounded-full px-5 py-2.5 text-caption font-semibold tracking-wider transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: scrolled ? "var(--color-brand-gold)" : "var(--color-brand-gold)",
                color: "var(--color-brand-navy)",
              }}
            >
              Contacto
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-[5px] md:hidden"
            aria-label="Abrir menú"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-[2px] w-6 transition-all duration-200"
                style={{
                  backgroundColor: scrolled
                    ? "var(--color-text-primary)"
                    : "var(--color-white)",
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center animate-fade-in"
          style={{ backgroundColor: "var(--color-brand-navy)" }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center"
            aria-label="Cerrar menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl tracking-wide text-white transition-colors duration-200 hover:text-[var(--color-brand-gold)] animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+5493546123456"
              className="mt-4 flex items-center gap-2 text-body-sm text-white/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +54 9 3546 123456
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

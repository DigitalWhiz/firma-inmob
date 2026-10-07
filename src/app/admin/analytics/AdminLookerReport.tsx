"use client";

import { useState } from "react";

const PLACEHOLDER_SRC = "about:blank";

export default function AdminLookerReport() {
  const [value, setValue] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string>(PLACEHOLDER_SRC);
  const [message, setMessage] = useState<string | null>(null);

  const isPlaceholder = embedUrl === PLACEHOLDER_SRC;

  const handleApply = () => {
    const next = value.trim();
    if (!next) {
      setMessage("Pegá un enlace de incrustación válido para mostrar el reporte.");
      return;
    }
    if (!/^https?:\/\//i.test(next)) {
      setMessage("El enlace debe comenzar con http:// o https://");
      return;
    }
    setEmbedUrl(next);
    setMessage(null);
  };

  const handleClear = () => {
    setEmbedUrl(PLACEHOLDER_SRC);
    setValue("");
    setMessage(null);
  };

  return (
    <section
      className="rounded-xl border p-6"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
    >
      <header>
        <p className="text-caption tracking-widest" style={{ color: "var(--color-brand-gold)" }}>
          SECCIÓN A · VISUALIZACIÓN
        </p>
        <h2
          className="mt-2 font-display text-xl"
          style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
        >
          Reporte de Google Looker Studio
        </h2>
        <p className="mt-2 max-w-2xl text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
          Incrustá tu panel de Looker Studio para seguir tráfico, conversiones y
          rendimiento de publicaciones sin salir del panel de administración.
          El enlace queda guardado durante esta sesión.
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="looker-embed"
            className="text-caption mb-1.5 block"
            style={{ color: "var(--color-text-muted)" }}
          >
            ENLACE DE INCRUSTACIÓN
          </label>
          <input
            id="looker-embed"
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://lookerstudio.google.com/embed/reporting/..."
            className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl px-6 py-3 text-caption font-medium tracking-wider transition-all duration-200"
            style={{
              backgroundColor: "var(--color-brand-gold)",
              color: "var(--color-brand-navy)",
            }}
          >
            APLICAR
          </button>
          {!isPlaceholder && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border px-6 py-3 text-caption tracking-wider transition-colors duration-200"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            >
              QUITAR
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="mt-3 text-body-sm" style={{ color: "#EF4444" }}>
          {message}
        </p>
      )}

      <div
        className="relative mt-5 w-full overflow-hidden rounded-xl border"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-background)",
          aspectRatio: "16 / 10",
        }}
      >
        <iframe
          key={embedUrl}
          src={embedUrl}
          title="Reporte de Google Looker Studio"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />

        {isPlaceholder && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
            style={{ backgroundColor: "var(--color-background)" }}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border text-caption"
              style={{ borderColor: "var(--color-brand-gold)", color: "var(--color-brand-gold)" }}
            >
              BI
            </span>
            <p className="max-w-md text-body-sm" style={{ color: "var(--color-text-muted)" }}>
              Pega aquí el enlace de incrustación de Google Looker Studio
            </p>
            <p className="text-caption" style={{ color: "var(--color-text-muted)" }}>
              Compartí el reporte → Incorporar informe → copiar el URL
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

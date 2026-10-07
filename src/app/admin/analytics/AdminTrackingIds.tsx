"use client";

import { useState } from "react";

type PixelType = "Meta Pixel" | "TikTok Pixel" | "Google Tag Manager" | "Google Ads" | "Otro";

interface TrackingId {
  key: string;
  type: PixelType;
  label: string;
  value: string;
  notes: string;
}

const PIXEL_TYPES: PixelType[] = [
  "Meta Pixel",
  "TikTok Pixel",
  "Google Tag Manager",
  "Google Ads",
  "Otro",
];

const EMPTY_FORM = { type: "Meta Pixel" as PixelType, label: "", value: "", notes: "" };

export default function AdminTrackingIds() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [ids, setIds] = useState<TrackingId[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const canSave = form.label.trim().length > 0 && form.value.trim().length > 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      setMessage("Completá la etiqueta y el ID del píxel.");
      return;
    }

    setIds((prev) => [
      {
        key: `${Date.now()}-${prev.length}`,
        type: form.type,
        label: form.label.trim(),
        value: form.value.trim(),
        notes: form.notes.trim(),
      },
      ...prev,
    ]);
    setForm({ ...EMPTY_FORM });
    setMessage("ID guardado en el estado local de esta sesión.");
  };

  const removeId = (key: string) => {
    setIds((prev) => prev.filter((item) => item.key !== key));
  };

  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text-primary)",
  };

  return (
    <section
      className="rounded-xl border p-6"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
    >
      <header>
        <p className="text-caption tracking-widest" style={{ color: "var(--color-brand-gold)" }}>
          SECCIÓN B · GESTIÓN DE CAMPAÑAS
        </p>
        <h2
          className="mt-2 font-display text-xl"
          style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
        >
          IDs de campaña y píxeles
        </h2>
        <p className="mt-2 max-w-2xl text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
          Registrá los identificadores de tus píxeles de publicidad y tags de
          terceros. Por ahora se guardan en el estado local; próximamente se
          persistirán en la base de datos de configuraciones.
        </p>
      </header>

      <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="pixel-type"
            className="text-caption mb-1.5 block"
            style={{ color: "var(--color-text-muted)" }}
          >
            TIPO
          </label>
          <select
            id="pixel-type"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as PixelType }))}
            className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={inputStyle}
          >
            {PIXEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="pixel-label"
            className="text-caption mb-1.5 block"
            style={{ color: "var(--color-text-muted)" }}
          >
            ETIQUETA / NOMBRE
          </label>
          <input
            id="pixel-label"
            type="text"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="Campaña Verano 2026"
            className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="pixel-value"
            className="text-caption mb-1.5 block"
            style={{ color: "var(--color-text-muted)" }}
          >
            ID / CÓDIGO DEL PÍXEL
          </label>
          <input
            id="pixel-value"
            type="text"
            value={form.value}
            onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            placeholder="123456789012345"
            className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="pixel-notes"
            className="text-caption mb-1.5 block"
            style={{ color: "var(--color-text-muted)" }}
          >
            NOTAS (OPCIONAL)
          </label>
          <input
            id="pixel-notes"
            type="text"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Cuenta de Business Manager, campaña activa…"
            className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
            style={inputStyle}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-xl px-6 py-3 text-caption font-medium tracking-wider transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: canSave ? "var(--color-brand-gold)" : "var(--color-surface)",
              color: canSave ? "var(--color-brand-navy)" : "var(--color-text-muted)",
              border: `1px solid ${canSave ? "var(--color-brand-gold)" : "var(--color-border)"}`,
            }}
            disabled={!canSave}
          >
            GUARDAR ID
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
          {message}
        </p>
      )}

      <div className="mt-8">
        <p className="text-caption tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          IDS REGISTRADOS ({ids.length})
        </p>

        {ids.length === 0 ? (
          <div
            className="mt-3 rounded-xl border-2 border-dashed p-8 text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
              Todavía no se agregaron IDs de campaña en esta sesión.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {ids.map((item) => (
              <li
                key={item.key}
                className="flex items-start gap-3 rounded-xl border p-4"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-background)",
                }}
              >
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-caption"
                  style={{
                    backgroundColor: "rgba(206, 184, 138, 0.15)",
                    color: "var(--color-brand-gold)",
                  }}
                >
                  {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {item.label}
                  </p>
                  <p
                    className="mt-0.5 truncate text-caption"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.value}
                    {item.notes ? ` · ${item.notes}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeId(item.key)}
                  className="shrink-0 rounded border px-2 py-1 text-caption transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

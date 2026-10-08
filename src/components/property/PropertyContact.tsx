"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { trackConversion } from "@/lib/analytics";
import { ADVISORS } from "@/data/advisors";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface PropertyContactProps {
  propertyTitle: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function PropertyContact({ propertyTitle }: PropertyContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, property: propertyTitle }),
      });
      if (!res.ok) throw new Error();
      trackConversion({ event: "form_submitted" });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text-primary)",
  };

  return (
    <div
      className="w-full min-w-0 overflow-hidden rounded-2xl p-2 md:p-3 lg:p-3"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <h3
        className="font-display text-base md:text-lg"
        style={{ color: "var(--color-text-primary)" }}
      >
        CONSULTAR POR WHATSAPP
      </h3>
      <p
        className="mt-1 text-xs md:text-body-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        ¿Con quién querés hablar?
      </p>
      <div className="mt-3 md:mt-6 grid grid-cols-1 gap-2 md:gap-3 sm:grid-cols-2 md:grid-cols-3">
        {ADVISORS.map((advisor) => {
          const advisorMessage = `Hola, quiero consultar por la propiedad "${propertyTitle}" de FIRMA Calamuchita.`;
          const url = getWhatsAppUrl(advisor.phone, advisorMessage);

          return (
            <a
              key={advisor.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion({ event: "property_contact" })}
              className="flex min-w-0 items-center gap-2 rounded-lg p-2.5 md:p-4 transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-display text-xs text-white md:h-10 md:w-10 md:text-sm"
                style={{ backgroundColor: "var(--color-brand-navy)" }}
              >
                {advisor.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs md:text-body-sm font-medium truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {advisor.name}
                </p>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#25D366"
                className="md:w-5 md:h-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          );
        })}
      </div>

      {/* Email form */}
      <div className="mt-6 border-t pt-4 md:mt-8 md:pt-6" style={{ borderColor: "var(--color-border)" }}>
        <h3
          className="font-display text-base md:text-lg"
          style={{ color: "var(--color-text-primary)" }}
        >
          O ENVIANOS UN EMAIL
        </h3>
        <p
          className="mt-1 text-xs md:text-body-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Te respondemos a la brevedad.
        </p>

        <form onSubmit={handleSubmit} className="mt-3 space-y-2 md:mt-4 md:space-y-3">
          <div>
            <label htmlFor="contact-name" className="text-[10px] tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              NOMBRE *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="text-[10px] tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              EMAIL *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="text-[10px] tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              TELÉFONO
            </label>
            <input
              id="contact-phone"
              type="tel"
              maxLength={30}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="text-[10px] tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              MENSAJE *
            </label>
            <textarea
              id="contact-message"
              required
              minLength={5}
              maxLength={2000}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border px-3 py-2.5 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl px-6 py-3 text-caption font-semibold tracking-wider transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-brand-gold)",
              color: "var(--color-brand-navy)",
            }}
          >
            {status === "loading" ? "ENVIANDO..." : "ENVIAR CONSULTA"}
          </button>

          {status === "success" && (
            <p className="text-body-sm" style={{ color: "#16A34A" }}>
              ¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.
            </p>
          )}
          {status === "error" && (
            <p className="text-body-sm" style={{ color: "#EF4444" }}>
              No se pudo enviar. Probá por WhatsApp o al teléfono de la inmobiliaria.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

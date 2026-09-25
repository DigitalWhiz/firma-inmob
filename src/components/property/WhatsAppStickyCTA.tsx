"use client";

import { useState, useEffect } from "react";
import { trackConversion } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ADVISORS } from "@/data/advisors";

interface WhatsAppStickyCTAProps {
  propertyTitle: string;
}

export default function WhatsAppStickyCTA({ propertyTitle }: WhatsAppStickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const message = `Hola, quiero consultar por la propiedad "${propertyTitle}" de FIRMA Calamuchita.`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] max-w-full overflow-hidden md:hidden">
      {expanded && (
        <div className="border-t bg-white px-4 pb-4 pt-3" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-caption" style={{ color: "var(--color-text-muted)" }}>
            ¿CON QUIÉN QUERÉS HABLAR?
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {ADVISORS.map((advisor) => (
              <a
                key={advisor.id}
                href={getWhatsAppUrl(advisor.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion({ event: "whatsapp_click" })}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-gray-50"
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: "var(--color-brand-navy)" }}
                >
                  {advisor.name.charAt(0)}
                </div>
                <span className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {advisor.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          trackConversion({ event: "whatsapp_click" });
          setExpanded(!expanded);
        }}
        className="flex w-full items-center justify-center gap-3 py-4 text-body-sm font-medium tracking-wider text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {expanded ? "SELECCIONAR ASESOR" : "HABLAR POR WHATSAPP"}
      </button>
    </div>
  );
}

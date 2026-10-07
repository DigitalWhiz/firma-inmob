// Analytics / lead tracking utilities
// Centralized conversion event tracker.
// This file is imported by both client and server components, so it must be framework-agnostic.
//
// On the client, events are forwarded to Google Analytics 4 through the `gtag`
// function injected by `@next/third-parties/google` in `src/app/layout.tsx`.
// On the server (or before hydration) it is a safe no-op.

export type ConversionEvent =
  | "property_viewed"
  | "property_contact"
  | "whatsapp_click"
  | "form_submitted"
  | "cta_click";

export interface TrackConversionProps {
  event: ConversionEvent;
  propertyId?: string | number;
  status?: string;
  extra?: Record<string, unknown>;
}

type GtagFunction = (
  command: "event" | "config" | "set" | "js" | "get",
  targetOrName: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

function buildEventParams(payload: TrackConversionProps): Record<string, unknown> {
  const params: Record<string, unknown> = { ...(payload.extra ?? {}) };
  if (payload.propertyId !== undefined) params.property_id = payload.propertyId;
  if (payload.status !== undefined) params.status = payload.status;
  return params;
}

export function trackConversion(payload: TrackConversionProps) {
  // No-op on the server — analytics only runs in the browser after hydration.
  if (typeof window === "undefined") return;

  const params = buildEventParams(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", payload.event, params);
    return;
  }

  // Fallback: push directly onto the dataLayer (e.g. gtag.js still loading).
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(["event", payload.event, params]);
  }
}

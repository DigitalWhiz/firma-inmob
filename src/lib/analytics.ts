// Analytics / lead tracking utilities
// Centralized conversion event tracker — can be integrated with any analytics provider
// This file is imported by both client and server components, so it must be framework-agnostic.
//
// TODO: Integrate with your analytics provider (Plausible, Google Analytics, etc.)
// Example: window.plt.event('conversion', payload);
// Example: gtag('event', 'conversion', payload);

type ConversionEvent =
  | "property_viewed"
  | "property_contact"
  | "whatsapp_click"
  | "form_submitted"
  | "cta_click";

interface TrackConversionProps {
  event: ConversionEvent;
  propertyId?: string | number;
  status?: string;
  extra?: Record<string, unknown>;
}

export function trackConversion(payload: TrackConversionProps) {
  // No-op by default — can be called from client or server components
  void payload;
}
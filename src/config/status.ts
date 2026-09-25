// Status design tokens — FIRMA Calamuchita
// Single source of truth for property status colors, labels and icons.
// Used by PropertyStatusBadge, admin list and admin dashboard.

import type { EditorialStatus } from "@/types/editorial";
import type { Property } from "@/types/property";

/** Foreground color per status (WCAG AA on light backgrounds). */
export const STATUS_COLORS: Record<EditorialStatus, string> = {
  available: "#166534",
  reserved: "#A8470A",
  sold: "#64748B",
};

/** 10% tint background per status. */
export const STATUS_TINTS: Record<EditorialStatus, string> = {
  available: "rgba(22, 101, 52, 0.1)",
  reserved: "rgba(168, 71, 10, 0.1)",
  sold: "rgba(100, 116, 139, 0.1)",
};

/** Title-case labels (admin UI). */
export const STATUS_LABELS: Record<EditorialStatus, string> = {
  available: "Disponible",
  reserved: "Reservada",
  sold: "Vendida",
};

/** Uppercase labels (public badges). */
export const STATUS_LABELS_UPPER: Record<EditorialStatus, string> = {
  available: "DISPONIBLE",
  reserved: "RESERVADA",
  sold: "VENDIDA",
};

/** Non-color redundancy: each status carries its own icon. */
export const STATUS_ICONS: Record<EditorialStatus, string> = {
  available: "✓",
  reserved: "◷",
  sold: "✕",
};

/** Featured (DESTACADA) meta-badge — gold, the only pill with a border. */
export const FEATURED_BADGE = {
  color: "#CEB88A",
  tint: "rgba(206, 184, 138, 0.15)",
  border: "rgba(206, 184, 138, 0.3)",
} as const;

/**
 * Resolve the editorial status from a (possibly merged) property.
 * Falls back to "available" when no editorial override is present.
 */
export function resolveEditorialStatus(
  property: Property & {
    editorial?: { editorialStatus: EditorialStatus };
  },
): EditorialStatus {
  return property.editorial?.editorialStatus ?? "available";
}

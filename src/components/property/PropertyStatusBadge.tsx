import type { EditorialStatus } from "@/types/editorial";
import {
  FEATURED_BADGE,
  STATUS_COLORS,
  STATUS_ICONS,
  STATUS_LABELS_UPPER,
} from "@/config/status";

interface PropertyStatusBadgeProps {
  status: EditorialStatus;
  featured?: boolean;
  compact?: boolean;
}

/**
 * Variant A (status): glassmorphism white/90 + backdrop-blur + shadow-md — max contrast over photos.
 * Variant B (featured/DESTACADA): glassmorphism dark black/70 + gold border + shadow-md — premium meta-layer.
 */
export default function PropertyStatusBadge({
  status,
  featured = false,
  compact = false,
}: PropertyStatusBadgeProps) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS_UPPER[status];
  const icon = STATUS_ICONS[status];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {featured && (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-[#CEB88A]/50 bg-black/70 font-medium tracking-wider leading-none shadow-md backdrop-blur-sm"
          style={{
            color: FEATURED_BADGE.color,
            padding: compact ? "2px 8px" : "4px 12px",
            fontSize: compact ? "0.625rem" : "0.6875rem",
          }}
        >
          <svg
            width={compact ? 10 : 12}
            height={compact ? 10 : 12}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          DESTACADA
        </span>
      )}
      <span
        className="inline-flex items-center gap-1 rounded-full bg-white/90 font-medium tracking-wider leading-none shadow-md backdrop-blur-sm"
        style={{
          color: color,
          padding: compact ? "2px 8px" : "4px 12px",
          fontSize: compact ? "0.625rem" : "0.6875rem",
        }}
      >
        {icon} {label}
      </span>
    </div>
  );
}

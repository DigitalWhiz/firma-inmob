import type { PropertyLocation } from "@/types/property";

interface PropertyLocationProps {
  location: PropertyLocation;
}

export default function PropertyLocation({ location }: PropertyLocationProps) {
  const hasCoords = location.latitude && location.longitude;

  const addressParts = [
    location.address,
    location.neighborhood,
    location.city,
    location.province,
  ].filter(Boolean);

  return (
    <div>
      {addressParts.length > 0 && (
        <div
          className="w-full min-w-0 overflow-hidden rounded-lg p-3 md:p-5"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="flex items-start gap-2 md:gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-brand-gold)"
              strokeWidth="1.5"
              className="mt-0.5 flex-shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="min-w-0 flex-1 break-words">
              {location.address && (
                <p className="text-body-sm md:text-body" style={{ color: "var(--color-text-primary)" }}>
                  {location.address}
                </p>
              )}
              {location.neighborhood && (
                <p className="mt-0.5 md:mt-1 text-xs md:text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {location.neighborhood}
                </p>
              )}
              <p className="mt-0.5 md:mt-1 text-xs md:text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                {[location.city, location.province, location.country].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCoords && (
        <div className="mt-4">
          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-body-sm transition-colors duration-200 hover:underline"
            style={{ color: "var(--color-brand-gold)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Ver en Google Maps
          </a>
        </div>
      )}
    </div>
  );
}

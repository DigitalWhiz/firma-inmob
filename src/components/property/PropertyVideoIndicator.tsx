import type { PropertyVideo } from "@/types/property";

interface PropertyVideoIndicatorProps {
  videos: PropertyVideo[];
}

function getValidExternalUrl(url: string): string | null {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return url;
  }
  if (url.includes("vimeo.com")) {
    return url;
  }
  if (url.includes("instagram.com")) {
    return url;
  }
  return null;
}

export default function PropertyVideoIndicator({ videos }: PropertyVideoIndicatorProps) {
  if (!videos || videos.length === 0) return null;

  const firstVideo = videos[0];
  const externalUrl = firstVideo ? getValidExternalUrl(firstVideo.url) : null;

  return (
    <div
      className="w-full min-w-0 overflow-hidden rounded-lg p-3 md:p-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full md:h-12 md:w-12"
          style={{ backgroundColor: "var(--color-brand-navy)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="md:w-5 md:h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <h3
            className="font-display text-xs md:text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            VIDEO DISPONIBLE
          </h3>
          <p className="mt-0.5 text-[10px] md:text-caption" style={{ color: "var(--color-text-muted)" }}>
            Esta propiedad dispone de video
          </p>
        </div>
      </div>

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 md:mt-4 inline-flex items-center gap-1.5 md:gap-2 rounded-lg border px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-body-sm font-medium tracking-wider transition-all duration-200 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)]"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          VER VIDEO
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </div>
  );
}

import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 md:py-24 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="1.5"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h3
        className="mt-6 font-display text-xl"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="mt-2 max-w-md text-body"
          style={{ color: "var(--color-text-muted)" }}
        >
          {description}
        </p>
      )}
      <Link
        href="/contacto"
        className="btn-primary mt-8"
      >
        CONTACTANOS
      </Link>
    </div>
  );
}

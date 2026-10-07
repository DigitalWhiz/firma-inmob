"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/analytics", label: "Analíticas" },
];

export default function AdminNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="rounded-full border px-4 py-2 text-caption tracking-widest transition-colors duration-200"
            style={{
              borderColor: active ? "var(--color-brand-gold)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-brand-gold)" : "transparent",
              color: active ? "var(--color-brand-navy)" : "var(--color-text-muted)",
            }}
          >
            {item.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}

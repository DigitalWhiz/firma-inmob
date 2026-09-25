"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl border px-4 py-2 text-caption tracking-wider transition-colors duration-200 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] disabled:opacity-50"
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text-muted)",
      }}
    >
      {loading ? "CERRANDO..." : "CERRAR SESIÓN"}
    </button>
  );
}

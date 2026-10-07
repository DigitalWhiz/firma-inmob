"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginStatus = "idle" | "loading" | "error";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from") || "/admin";
  // Solo rutas internas (evita open redirect a //evil.com o https://externo)
  const from = rawFrom.startsWith("/") && !rawFrom.startsWith("//") ? rawFrom : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setStatus("error");
        setError("Credenciales inválidas");
      }
    } catch {
      setStatus("error");
      setError("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="text-caption block mb-1.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-caption block mb-1.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          CONTRASEÑA
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-xl border px-4 py-3 text-body-sm outline-none transition-colors duration-200 focus:border-[var(--color-brand-gold)]"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      {error && (
        <p className="text-body-sm" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-all duration-200 disabled:opacity-50"
        style={{ backgroundColor: "var(--color-brand-gold)", color: "var(--color-brand-navy)" }}
      >
        {status === "loading" ? "INGRESANDO..." : "INGRESAR"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-caption tracking-widest text-[var(--color-brand-gold)]">
            FIRMA
          </p>
          <h1
            className="mt-4 font-display text-2xl"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
          >
            Panel de Administración
          </h1>
          <p
            className="mt-2 text-body-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Ingresá tus credenciales para continuar
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-8">
            <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>Cargando...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

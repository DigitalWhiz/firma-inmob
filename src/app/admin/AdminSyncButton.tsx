"use client";

import { useState } from "react";
import { STATUS_COLORS } from "@/config/status";
import { revalidateTokko } from "./actions";

type SyncStatus = "idle" | "loading" | "success" | "error";

export default function AdminSyncButton() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setStatus("loading");
    setMessage("Actualizando...");

    try {
      const result = await revalidateTokko();

      if (result.success) {
        setStatus("success");
        setMessage("Actualización completada");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
          window.location.reload();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(result.error || "Error al actualizar");
      }
    } catch {
      setStatus("error");
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={status === "loading"}
        className="w-full rounded-xl px-6 py-3 text-body-sm font-medium tracking-wider text-white transition-all duration-200 disabled:opacity-50"
        style={{ backgroundColor: "var(--color-brand-gold)" }}
      >
        {status === "loading" ? "ACTUALIZANDO..." : "ACTUALIZAR PROPIEDADES"}
      </button>

      {message && (
        <p
          className="mt-3 text-center text-body-sm"
          style={{
            color:
              status === "success"
                ? STATUS_COLORS.available
                : status === "error"
                  ? "#EF4444"
                  : "var(--color-text-muted)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

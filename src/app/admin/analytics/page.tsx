import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminNav from "../AdminNav";
import AdminLogoutButton from "../AdminLogoutButton";
import AdminLookerReport from "./AdminLookerReport";
import AdminTrackingIds from "./AdminTrackingIds";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analíticas",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login?from=/admin/analytics");

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XCP7Y9HD2M";

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-12 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-caption tracking-widest text-[var(--color-brand-gold)]">
              ADMIN · ANALÍTICAS
            </p>
            <h1
              className="mt-4 font-display text-3xl"
              style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
            >
              Dashboard de Analíticas
            </h1>
            <p className="mt-3 max-w-2xl text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              Visualizá los reportes de Google Analytics 4 y Looker Studio, y
              administrá los identificadores de tus campañas publicitarias.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <AdminNav />
            <AdminLogoutButton />
          </div>
        </div>

        {/* Status cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatusCard label="GOOGLE ANALYTICS 4" value="Activo" color="var(--color-brand-gold)" />
          <StatusCard label="PROPERTY ID" value={gaId} />
          <StatusCard label="LOOKER STUDIO" value="Sin reporte" color="#EF4444" />
        </div>

        {/* Section A — Looker Studio embed */}
        <div className="mt-8">
          <AdminLookerReport />
        </div>

        {/* Section B — Campaign / pixel IDs */}
        <div className="mt-8">
          <AdminTrackingIds />
        </div>

        <div className="mt-8 rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
          <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
            EVENTOS ENVIADOS A GA4: whatsapp_click · property_contact ·
            property_viewed · form_submitted · cta_click
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  label,
  value,
  color = "var(--color-text-primary)",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
      <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <p className="mt-2 font-display text-xl" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { createFirmaProvider } from "@/lib/firma/provider";
import { getHomeContent } from "@/lib/editorial/store";
import { CATEGORIES } from "@/config/categories";
import { STATUS_COLORS } from "@/config/status";
import AdminSyncButton from "./AdminSyncButton";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminPropertyList from "./AdminPropertyList";
import AdminHomeContent from "./AdminHomeContent";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const provider = createFirmaProvider();
    const allProperties = await provider.getAllProperties();
    const overridesList = allProperties.map((p) => ({
      propertyId: p.id,
      visible: p.editorial.visible,
      featured: p.editorial.featured,
      editorialStatus: p.editorial.editorialStatus,
      sortOrder: p.editorial.sortOrder,
      internalNote: p.editorial.internalNote,
      updatedAt: p.editorial.updatedAt,
    }));

    const overrideMap = new Map(
      overridesList.map((o) => [o.propertyId, o]),
    );

    const categories = CATEGORIES.map((cat) => {
      const catProps = allProperties.filter((p) => cat.tokkoTypes.includes(p.type));
      const visibleCatProps = catProps.filter((p) => {
        const o = overrideMap.get(p.id);
        return o ? o.visible : true;
      });
      return {
        label: cat.pluralLabel,
        total: catProps.length,
        visible: visibleCatProps.length,
      };
    });

    const totalVisible = allProperties.filter((p) => {
      const o = overrideMap.get(p.id);
      return o ? o.visible : true;
    }).length;

    const totalHidden = allProperties.length - totalVisible;

    const totalFeatured = allProperties.filter((p) => {
      const o = overrideMap.get(p.id);
      return o ? o.featured : false;
    }).length;

    const totalReserved = allProperties.filter((p) => {
      const o = overrideMap.get(p.id);
      return o ? o.editorialStatus === "reserved" : false;
    }).length;

    const totalSold = allProperties.filter((p) => {
      const o = overrideMap.get(p.id);
      return o ? o.editorialStatus === "sold" : false;
    }).length;

    // Raw properties (without editorial merge) for the property list
    const rawProperties = allProperties.map(({ editorial: _editorial, ...rest }) => rest);

    // Home content configuration
    const homeContent = await getHomeContent();

    return {
      connected: true,
      branchId: provider.getBranchId(),
      totalProperties: allProperties.length,
      totalVisible,
      totalHidden,
      totalFeatured,
      totalReserved,
      totalSold,
      categories,
      properties: rawProperties,
      overrides: overridesList,
      homeContent,
      lastFetch: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      branchId: parseInt(process.env.TOKKO_BRANCH_ID || "85101", 10),
      totalProperties: 0,
      totalVisible: 0,
      totalHidden: 0,
      totalFeatured: 0,
      totalReserved: 0,
      totalSold: 0,
      categories: CATEGORIES.map((cat) => ({ label: cat.pluralLabel, total: 0, visible: 0 })),
      properties: [],
      overrides: [],
      homeContent: { heroPropertyId: null, featuredPropertyIds: [] },
      lastFetch: null,
      error: "Error al conectar con Tokko. Verificá la configuración.",
    };
  }
}

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const data = await getData();

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-12 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-caption tracking-widest text-[var(--color-brand-gold)]">
              ADMIN
            </p>
            <h1
              className="mt-4 font-display text-3xl"
              style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
            >
              Panel de Administración
            </h1>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <AdminNav />
            <AdminLogoutButton />
          </div>
        </div>

        {/* Status Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="TOKKO"
            value={data.connected ? "Conectado" : "Desconectado"}
            color={data.connected ? STATUS_COLORS.available : "#EF4444"}
          />
          <StatusCard label="TOTAL" value={String(data.totalProperties)} />
          <StatusCard label="VISIBLES" value={String(data.totalVisible)} color={STATUS_COLORS.available} />
          <StatusCard label="OCULTAS" value={String(data.totalHidden)} color="#EF4444" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatusCard label="DESTACADAS" value={String(data.totalFeatured)} color="var(--color-brand-gold)" />
          <StatusCard label="RESERVADAS" value={String(data.totalReserved)} color={STATUS_COLORS.reserved} />
          <StatusCard label="VENDIDAS" value={String(data.totalSold)} color={STATUS_COLORS.sold} />
        </div>

        {/* Categories */}
        <div
          className="mt-8 rounded-xl p-6"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
            CATEGORÍAS
          </span>
          <div className="mt-3 space-y-2">
            {data.categories.map((cat) => (
              <div key={cat.label} className="flex justify-between text-body-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>{cat.label}</span>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {cat.visible} / {cat.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {data.error && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <p className="text-body-sm" style={{ color: "#EF4444" }}>{data.error}</p>
          </div>
        )}

        {data.lastFetch && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
              ÚLTIMA ACTUALIZACIÓN: {new Date(data.lastFetch).toLocaleString("es-AR")}
            </span>
          </div>
        )}

        <div className="mt-8">
          <AdminSyncButton />
        </div>

        {/* Home Content Section */}
        <div className="mt-12">
          <AdminHomeContent
            properties={data.properties}
            homeContent={data.homeContent}
          />
        </div>

        {/* Property List */}
        <div className="mt-12">
          <h2
            className="font-display text-2xl"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
          >
            Propiedades
          </h2>
          <AdminPropertyList
            properties={data.properties}
            overrides={data.overrides}
          />
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
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <span className="text-caption" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <p
        className="mt-2 font-display text-xl"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

import type { Property } from "@/types/property";

interface PropertyInformationProps {
  property: Property;
}

function formatNumber(n: number | undefined): string | null {
  if (n === undefined || n === null) return null;
  return new Intl.NumberFormat("es-AR").format(n);
}

const OPERATIONS: Record<string, string> = {
  sale: "Venta",
  rent: "Alquiler",
  temporary_rent: "Alquiler temporario",
};

export default function PropertyInformation({ property }: PropertyInformationProps) {
  const { features, type, operation } = property;

  const infoItems: { label: string; value: string | null }[] = [];

  if (type) {
    const typeLabels: Record<string, string> = {
      house: "Casa",
      land: "Terreno",
      business_permit: "Complejo",
      countryside: "Campo",
      apartment: "Departamento",
      other: "Propiedad",
    };
    infoItems.push({ label: "Tipo", value: typeLabels[type] || type });
  }

  if (operation) {
    infoItems.push({ label: "Operación", value: OPERATIONS[operation] || operation });
  }

  if (features.bedrooms !== undefined) {
    infoItems.push({ label: "Dormitorios", value: formatNumber(features.bedrooms) });
  }
  if (features.suites !== undefined && features.suites > 0) {
    infoItems.push({ label: "Suites", value: formatNumber(features.suites) });
  }
  if (features.bathrooms !== undefined) {
    infoItems.push({ label: "Baños", value: formatNumber(features.bathrooms) });
  }
  if (features.halfBaths !== undefined && features.halfBaths > 0) {
    infoItems.push({ label: "Toilettes", value: formatNumber(features.halfBaths) });
  }
  if (features.rooms !== undefined && features.rooms > 0) {
    infoItems.push({ label: "Ambientes", value: formatNumber(features.rooms) });
  }
  if (features.livingRooms !== undefined && features.livingRooms > 0) {
    infoItems.push({ label: "Salas", value: formatNumber(features.livingRooms) });
  }
  if (features.diningRooms !== undefined && features.diningRooms > 0) {
    infoItems.push({ label: "Comedor", value: formatNumber(features.diningRooms) });
  }
  if (features.tvRooms !== undefined && features.tvRooms > 0) {
    infoItems.push({ label: "Living", value: formatNumber(features.tvRooms) });
  }
  if (features.parking !== undefined) {
    infoItems.push({ label: "Cocheras", value: formatNumber(features.parking) });
  }
  if (features.coveredParking !== undefined && features.coveredParking > 0) {
    infoItems.push({ label: "Cocheras cubiertas", value: formatNumber(features.coveredParking) });
  }
  if (features.uncoveredParking !== undefined && features.uncoveredParking > 0) {
    infoItems.push({ label: "Cocheras descubiertas", value: formatNumber(features.uncoveredParking) });
  }
  if (features.coveredArea !== undefined) {
    infoItems.push({ label: "Superficie cubierta", value: `${formatNumber(features.coveredArea)} m²` });
  }
  if (features.totalArea !== undefined) {
    infoItems.push({ label: "Superficie total", value: `${formatNumber(features.totalArea)} m²` });
  }
  if (features.landArea !== undefined) {
    infoItems.push({ label: "Superficie del terreno", value: `${formatNumber(features.landArea)} m²` });
  }
  if (features.floors !== undefined && features.floors > 0) {
    infoItems.push({ label: "Pisos", value: formatNumber(features.floors) });
  }

  if (infoItems.length === 0) return null;

  return (
    <div className="w-full min-w-0 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {infoItems.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 flex-col items-center overflow-hidden rounded-lg p-2 text-center"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <span
            className="font-display text-base md:text-xl"
            style={{ color: "var(--color-brand-gold)" }}
          >
            {item.value}
          </span>
          <span
            className="mt-0.5 text-[10px] md:text-caption"
            style={{ color: "var(--color-text-muted)" }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

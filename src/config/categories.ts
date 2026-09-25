import type { PropertyType } from "@/types/property";

export interface FirmaCategory {
  slug: string;
  label: string;
  pluralLabel: string;
  description: string;
  tokkoTypes: PropertyType[];
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORIES: FirmaCategory[] = [
  {
    slug: "casas",
    label: "Casa",
    pluralLabel: "Casas",
    description:
      "Casas en venta en el Valle de Calamuchita. Desde quintas familiares hasta propiedades de lujo frente al lago.",
    tokkoTypes: ["house"],
    metaTitle: "Casas en Calamuchita",
    metaDescription:
      "Casas en venta en Villa Rumipal, Embalse, Villa General Belgrano y el Valle de Calamuchita, Córdoba.",
  },
  {
    slug: "departamentos",
    label: "Departamento",
    pluralLabel: "Departamentos",
    description:
      "Departamentos en venta en el Valle de Calamuchita. Opciones frente al lago y en el centro de cada localidad.",
    tokkoTypes: ["apartment"],
    metaTitle: "Departamentos en Calamuchita",
    metaDescription:
      "Departamentos en venta en el Valle de Calamuchita, Córdoba. Frente al lago y zona céntrica.",
  },
  {
    slug: "terrenos",
    label: "Terreno",
    pluralLabel: "Terrenos",
    description:
      "Terrenos y lotes en venta en el Valle de Calamuchita. Superficies desde 500 m² hasta hectáreas.",
    tokkoTypes: ["land"],
    metaTitle: "Terrenos en Calamuchita",
    metaDescription:
      "Terrenos y lotes en venta en Villa Rumipal, Embalse y el Valle de Calamuchita, Córdoba.",
  },
  {
    slug: "complejos",
    label: "Complejo",
    pluralLabel: "Complejos",
    description:
      "Complejos turísticos y cabañas con amenities. Inversiones en el Valle de Calamuchita.",
    tokkoTypes: ["business_permit"],
    metaTitle: "Complejos en Calamuchita",
    metaDescription:
      "Complejos turísticos y cabañas en venta en el Valle de Calamuchita, Córdoba.",
  },
  {
    slug: "campos",
    label: "Campo",
    pluralLabel: "Campos",
    description:
      "Campos y hectáreas en venta en el Valle de Calamuchita. Propiedades rurales con amplia superficie.",
    tokkoTypes: ["countryside"],
    metaTitle: "Campos en Calamuchita",
    metaDescription:
      "Campos y hectáreas en venta en el Valle de Calamuchita, Córdoba.",
  },
];

export function getCategoryBySlug(slug: string): FirmaCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByTokkoType(
  type: PropertyType,
): FirmaCategory | undefined {
  return CATEGORIES.find((c) => c.tokkoTypes.includes(type));
}

export function getCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}

import type { Metadata } from "next";
import { createFirmaProvider } from "@/lib/firma/provider";
import { getCategoryBySlug } from "@/config/categories";
import PropertyCategoryPage from "@/components/property/PropertyCategoryPage";

const category = getCategoryBySlug("complejos")!;

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  openGraph: {
    title: `${category.metaTitle} — FIRMA`,
    description: category.metaDescription,
  },
};

export const revalidate = 1800;

export default async function ComplejosPage() {
  const provider = createFirmaProvider();
  const properties = await provider.getPropertiesByType(category.tokkoTypes[0]);

  return <PropertyCategoryPage category={category} properties={properties} />;
}

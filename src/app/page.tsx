import Hero from "@/components/sections/Hero";
import CategoryCards from "@/components/sections/CategoryCards";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import Territory from "@/components/sections/Territory";
import Services from "@/components/sections/Services";
import SellCTA from "@/components/sections/SellCTA";
import FinalCTA from "@/components/sections/FinalCTA";
import { createFirmaProvider } from "@/lib/firma/provider";
import { getUniqueLocalities } from "@/lib/filters";
import SucursalesPreview from "@/components/sections/SucursalesPreview";

export const revalidate = 1800;

// Ficha info identification — hash from https://ficha.info/p/0641fec0171245d7bb3c067568be3d03?v=1768337450324
const FICHA_HASH = "0641fec0171245d7bb3c067568be3d03";

async function getData() {
  try {
    const provider = createFirmaProvider();
    const [heroProperty, featuredProperties, allProperties] = await Promise.all([
      provider.getHeroProperty(),
      provider.getHomeFeaturedProperties(),
      provider.getPublicProperties(),
    ]);

    // Fallback hero: if editorial hero fails, try ficha hash, then first property
    let hero = heroProperty;
    if (!hero) {
      hero = allProperties.find((p) => p.urls?.fichaHash === FICHA_HASH)
        ?? allProperties.find((p) => p.type === "house" && p.prices.some((pr) => pr.amount >= 100000))
        ?? allProperties[0]
        ?? null;
    }

    // Fallback featured: if editorial featured is empty, use first 5 excluding hero
    let featured = featuredProperties;
    if (featured.length === 0) {
      featured = allProperties.filter((p) => p.id !== hero?.id).slice(0, 5);
    }

    // Server-side extraction — client only ever receives this string[].
    const availableLocations = getUniqueLocalities(allProperties);

    return { hero, featured, availableLocations };
  } catch {
    return { hero: null, featured: [], availableLocations: [] };
  }
}

export default async function HomePage() {
  const { hero, featured, availableLocations } = await getData();

  return (
    <>
      <Hero property={hero} availableLocations={availableLocations} />
      <CategoryCards />
      <SucursalesPreview />
      <FeaturedProperties properties={featured} />
      <Territory />
      <Services />
      <SellCTA />
      <FinalCTA />
    </>
  );
}

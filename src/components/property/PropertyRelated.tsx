import type { Property } from "@/types/property";
import { resolveEditorialStatus } from "@/config/status";
import PropertyCard from "./PropertyCard";

interface PropertyRelatedProps {
  properties: Property[];
}

export default function PropertyRelated({ properties }: PropertyRelatedProps) {
  if (properties.length === 0) return null;

  return (
    <section className="w-full min-w-0">
      <h2
        className="font-display text-xl"
        style={{ color: "var(--color-text-primary)" }}
      >
        PROPIEDADES RELACIONADAS
      </h2>
      <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            variant="editorial"
            editorialStatus={resolveEditorialStatus(property)}
          />
        ))}
      </div>
    </section>
  );
}

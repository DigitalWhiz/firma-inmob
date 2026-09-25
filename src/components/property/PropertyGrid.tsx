import PropertyCard from "./PropertyCard";
import type { Property } from "@/types/property";
import { resolveEditorialStatus } from "@/config/status";

interface PropertyGridProps {
  properties: Property[];
  variant?: "editorial" | "featured" | "compact";
}

export default function PropertyGrid({
  properties,
  variant = "editorial",
}: PropertyGridProps) {
  if (properties.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            variant="compact"
            editorialStatus={resolveEditorialStatus(property)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          variant={variant}
          editorialStatus={resolveEditorialStatus(property)}
        />
      ))}
    </div>
  );
}

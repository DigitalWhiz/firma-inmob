"use client";

import { useState, useCallback } from "react";

interface Favorite {
  propertyId: number;
  slug: string;
  addedAt: string;
}

const STORAGE_KEY = "firma-favorites";

function loadFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: Favorite[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage full or unavailable
  }
}

interface FavoriteButtonProps {
  propertyId: number;
  slug: string;
}

export default function FavoriteButton({ propertyId, slug }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === "undefined") return false;
    const favorites = loadFavorites();
    return favorites.some((f) => f.propertyId === propertyId);
  });

  const toggle = useCallback(() => {
    const favorites = loadFavorites();
    const index = favorites.findIndex((f) => f.propertyId === propertyId);

    if (index >= 0) {
      favorites.splice(index, 1);
      setIsFavorite(false);
    } else {
      favorites.push({
        propertyId,
        slug,
        addedAt: new Date().toISOString(),
      });
      setIsFavorite(true);
    }

    saveFavorites(favorites);
  }, [propertyId, slug]);

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-caption transition-all duration-200"
      style={{
        borderColor: isFavorite ? "var(--color-brand-gold)" : "var(--color-border)",
        color: isFavorite ? "var(--color-brand-gold)" : "var(--color-text-muted)",
      }}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      {isFavorite ? "GUARDADO" : "GUARDAR"}
    </button>
  );
}

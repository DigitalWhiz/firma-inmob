"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/types/property";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const mainImage = images[selectedIndex] || images[0];

  const goTo = useCallback(
    (index: number) => {
      setSelectedIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex]);
  const prev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex]);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="w-full min-w-0 relative aspect-[4/3] overflow-hidden bg-black/5">
        <Image
          src={mainImage.imageUrl}
          alt={mainImage.alt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 60vw"
          priority
        />
        {images.length > 1 && (
          <button
            onClick={() => setFullscreen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            {images.length} fotos
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className="relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors duration-200"
              style={{
                borderColor:
                  i === selectedIndex
                    ? "var(--color-brand-gold)"
                    : "transparent",
              }}
            >
              <Image
                src={img.thumbnailUrl}
                alt={img.alt || `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[500] flex flex-col bg-black"
          onClick={() => setFullscreen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-white/70">
              {selectedIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="text-white/70 transition-colors duration-200 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/20"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/20"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

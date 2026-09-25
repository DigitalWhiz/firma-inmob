"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/types/property";

interface PropertyMediaGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function PropertyMediaGallery({
  images,
  title,
}: PropertyMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [fullscreen]);

  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="w-full min-w-0 relative aspect-[16/10] overflow-hidden bg-black/5 md:aspect-[16/9] border-8 rounded-2xl border-black/5">
        <Image
          src={mainImage.imageUrl}
          alt={mainImage.alt || title}
          fill
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
        />
        {images.length > 1 && (
          <button
            onClick={() => setFullscreen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            {images.length} fotos
          </button>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/30 md:left-4"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/30 md:right-4"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-4 rounded-lg px-3 py-1.5 text-body-sm text-white backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className="relative h-16 w-20 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 md:h-20 md:w-24 rounded-md"
              style={{
                borderColor:
                  i === selectedIndex
                    ? "var(--color-brand-gold)"
                    : "transparent",
                opacity: i === selectedIndex ? 1 : 0.7,
              }}
            >
              <Image
                src={img.thumbnailUrl}
                alt={img.alt || `${title} ${i + 1}`}
                fill
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[500] flex flex-col bg-black"
          onClick={() => setFullscreen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-white/70">
              {selectedIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="text-white/70 transition-colors duration-200 hover:text-white md:hidden"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="text-white/70 transition-colors duration-200 hover:text-white md:hidden"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="text-white/70 transition-colors duration-200 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/20 md:flex"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.alt || title}
              fill
              placeholder="blur"
              className="object-contain"
              sizes="100vw"
            />
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/20 md:flex"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {images.length > 1 && (
            <div className="flex gap-1 overflow-x-auto px-4 py-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                  className="relative h-12 w-16 flex-shrink-0 overflow-hidden border-2 transition-all duration-200"
                  style={{
                    borderColor: i === selectedIndex ? "var(--color-brand-gold)" : "transparent",
                    opacity: i === selectedIndex ? 1 : 0.5,
                  }}
                >
                  <Image
                    src={img.thumbnailUrl}
                    alt={img.alt || `${title} ${i + 1}`}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+v8/AxgB/7w/4yQAAAABJRU5ErkJggg=="
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

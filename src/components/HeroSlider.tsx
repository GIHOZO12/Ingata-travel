"use client";

// Client Component: needs state (current slide) and a timer (autoplay).
// The hero text is passed in as `children` from the server page, so only the
// slider logic ships as JavaScript, not the copy.

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import gorillaPortrait from "@/assets/bob-brewer-lV5PT7R-RuE-unsplash.jpg";
import gorillaFamily from "@/assets/johnny-africa-BDWnIpExrvY-unsplash.jpg";
import lakeLife from "@/assets/ifeoluwa-b-OYeYN7TmU-g-unsplash.jpg";

// Importing an image file gives Next.js its width/height at build time and lets
// <Image> resize + compress it automatically (the originals are 5000px+ wide).
const slides = [
  {
    image: gorillaPortrait,
    alt: "Close-up portrait of a young mountain gorilla in the forest",
    caption: "Gorilla Trekking",
  },
  {
    image: gorillaFamily,
    alt: "A gorilla holding her baby among green forest leaves",
    caption: "Wildlife Encounters",
  },
  {
    image: lakeLife,
    alt: "Wooden fishing boats and a passenger boat on a lake with green hills behind",
    caption: "Lakes & Local Life",
  },
];

const INTERVAL_MS = 5000;

export default function HeroSlider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
 
  const reducedMotion = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setTimeout(
      () => setCurrent((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => clearTimeout(id);
  }, [current, paused, reducedMotion]);

  const go = (delta: number) =>
    setCurrent((i) => (i + delta + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured travel experiences"
      className="relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden bg-zinc-900 text-white sm:min-h-[40rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* All slides are stacked; only the current one has opacity 1 (crossfade). */}
      {slides.map((slide, index) => (
        <Image
          key={slide.caption}
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="100vw"
          placeholder="blur"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          aria-hidden={index !== current}
          className={`-z-20 object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark gradient so white text stays readable on any photo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="px-6 py-24 text-center">{children}</div>

      {/* Caption of the current photo */}
      <p
        aria-live="polite"
        className="absolute bottom-16 left-6 text-xs font-medium uppercase tracking-widest text-white/80 sm:bottom-8"
      >
        {slides[current].caption}
      </p>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur transition-colors hover:bg-white/30 sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur transition-colors hover:bg-white/30 sm:flex"
      >
        ›
      </button>

      <div className="absolute bottom-6 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.caption}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.caption}`}
            aria-current={index === current}
            className={`h-2.5 rounded-full transition-all ${
              index === current ? "w-8 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getTours } from "@/lib/api";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "Tours | Travel & Tour Company",
  description:
    "Browse our safaris, gorilla trekking, cultural tours and custom holidays across Africa.",
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  // Filters live in the URL (?category=...&q=...) so a filtered list can be
  // shared or bookmarked, and the page is rendered on the server.
  const { category, q } = await searchParams;
  // If the API can't be reached (e.g. no backend deployed yet), fall back to
  // an empty list — the page already shows "tours are being prepared" for that.
  const allTours = await getTours().catch(() => []);

  const categories = [...new Set(allTours.map((t) => t.category))].sort();
  const search = q?.trim().toLowerCase() ?? "";

  const tours = allTours.filter(
    (t) =>
      (!category || t.category === category) &&
      (!search ||
        [t.name, t.overview, t.destination.name, t.category]
          .join(" ")
          .toLowerCase()
          .includes(search)),
  );

  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm ${
      active ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
    }`;

  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Our Tours</h1>
        <p className="mt-2 text-zinc-600">
          Find the journey that fits your travel dreams.
        </p>

        {/* Search: a plain GET form, no JavaScript needed */}
        <form action="/tours" className="mt-6 flex max-w-md gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search tours or destinations…"
            aria-label="Search tours"
            className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Search
          </button>
        </form>

        {categories.length > 0 && (
          <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
            <Link href={q ? `/tours?q=${encodeURIComponent(q)}` : "/tours"} className={chip(!category)}>
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/tours?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={chip(category === c)}
              >
                {c}
              </Link>
            ))}
          </nav>
        )}

        {tours.length === 0 ? (
          <p className="mt-12 text-zinc-500">
            {allTours.length === 0
              ? "Our tours are being prepared. Please check back soon."
              : "No tours match your search. Try a different filter."}
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

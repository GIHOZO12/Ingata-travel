import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTour } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

// Sets the browser tab title and search-engine description for THIS tour (SRS §51).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: "Tour not found" };

  return {
    title: `${tour.name} | Travel & Tour Company`,
    description: tour.overview.slice(0, 160),
  };
}

function BulletList({ items, icon }: { items: string[]; icon: string }) {
  return (
    <ul className="mt-3 space-y-2 text-sm text-zinc-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true">{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function TourPage({ params }: Props) {
  // [slug] is a dynamic segment; in this Next.js version params is a Promise.
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const image = resolveImageUrl(tour.featuredImage);
  const price = formatPrice(tour.startingPrice, tour.currency);
  const gallery = tour.images.map(resolveImageUrl).filter((src): src is string => !!src);

  return (
    <div className="flex-1 bg-white text-zinc-900">
      {/* Header image with the tour title */}
      <section className="relative isolate flex min-h-[20rem] items-end bg-zinc-800 sm:min-h-[26rem]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={tour.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-black/10" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-8 text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-white/80">
            {tour.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-5xl">
            {tour.name}
          </h1>
          <p className="mt-2 text-white/90">
            <Link href={`/destinations`} className="underline-offset-2 hover:underline">
              {tour.destination.name}
            </Link>
            {" · "}
            {formatDuration(tour.durationDays, tour.durationNights)}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-zinc-700">{tour.overview}</p>
          </section>

          {tour.highlights.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Tour highlights</h2>
              <BulletList items={tour.highlights} icon="★" />
            </section>
          )}

          {tour.itineraryDays.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Itinerary</h2>
              {/* <details> gives an open/close accordion with no JavaScript */}
              <div className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
                {tour.itineraryDays.map((day, index) => (
                  <details key={day.id} open={index === 0} className="group p-4">
                    <summary className="cursor-pointer list-none font-medium">
                      <span className="mr-2 text-zinc-500">Day {day.dayNumber}</span>
                      {day.title}
                    </summary>
                    {day.activities.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-9 text-sm text-zinc-700">
                        {day.activities.map((activity) => (
                          <li key={activity}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </details>
                ))}
              </div>
            </section>
          )}

          {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
            <section className="grid gap-8 sm:grid-cols-2">
              {tour.inclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">What’s included</h2>
                  <BulletList items={tour.inclusions} icon="✓" />
                </div>
              )}
              {tour.exclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">What’s not included</h2>
                  <BulletList items={tour.exclusions} icon="✕" />
                </div>
              )}
            </section>
          )}

          {tour.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Requirements</h2>
              <BulletList items={tour.requirements} icon="•" />
            </section>
          )}

          {gallery.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Gallery</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src) => (
                  <li key={src} className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${tour.name} photo`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Booking card: sticks to the top while scrolling on large screens */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-zinc-200 p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              {price ? "Starting from" : "Price"}
            </p>
            <p className="text-3xl font-semibold">
              {price ?? "On request"}
            </p>
            {price && <p className="text-sm text-zinc-500">per person</p>}

            <dl className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Duration</dt>
                <dd>{formatDuration(tour.durationDays, tour.durationNights)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Destination</dt>
                <dd>{tour.destination.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Category</dt>
                <dd>{tour.category}</dd>
              </div>
            </dl>

            <Link
              href={`/book?tour=${tour.slug}`}
              className="mt-6 block rounded-full bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-zinc-700"
            >
              Book this tour
            </Link>
            <p className="mt-3 text-center text-xs text-zinc-500">
              Send a request now. We’ll confirm availability before any payment.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

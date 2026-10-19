import Link from "next/link";
import type { Tour } from "@/lib/types";
import { resolveImageUrl } from "@/lib/images";
import { formatDuration, formatPrice } from "@/lib/format";

// Card for one tour (SRS §13 / §23): image, name, destination, duration,
// category, starting price and the View Details / Book Now buttons.
export default function TourCard({ tour }: { tour: Tour }) {
  // Falls back to the first gallery photo when no main photo was set.
  const image = resolveImageUrl(tour.featuredImage || tour.images?.[0]);
  const price = formatPrice(tour.startingPrice, tour.currency);

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-900">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-200 to-zinc-300">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={tour.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-800">
          {tour.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{tour.name}</h3>
        <p className="text-sm text-zinc-500">
          {tour.destination.name} · {formatDuration(tour.durationDays, tour.durationNights)}
        </p>
        <p className="mt-3 line-clamp-3 text-sm text-zinc-600">{tour.overview}</p>

        <div className="mt-auto pt-5">
          <p className="text-sm text-zinc-500">
            {price ? (
              <>
                From <span className="text-lg font-semibold text-zinc-900">{price}</span>{" "}
                per person
              </>
            ) : (
              "Contact us for a quote"
            )}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/tour/${tour.slug}`}
              className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              View Details
            </Link>
            <Link
              href={`/book?tour=${tour.slug}`}
              className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

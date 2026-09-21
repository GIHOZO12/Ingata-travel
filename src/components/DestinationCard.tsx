import type { Destination } from "@/lib/types";
import { resolveImageUrl } from "@/lib/images";

// A reusable card: it receives data through "props" and just renders it.
// Used on both the homepage and the /destinations page.
export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  const image = resolveImageUrl(destination.heroImage);

  return (
    <li className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-200 to-zinc-300">
        {image && (
          // A plain <img> on purpose: admins can paste image links from any
          // website, and next/image only works for domains listed in next.config.ts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${destination.name}, ${destination.country}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium text-zinc-900">{destination.name}</h3>
        <p className="text-sm text-zinc-500">{destination.country}</p>
        <p className="mt-3 line-clamp-3 text-sm text-zinc-600">
          {destination.overview}
        </p>
      </div>
    </li>
  );
}

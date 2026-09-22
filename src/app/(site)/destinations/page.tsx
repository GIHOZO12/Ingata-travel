import { getDestinations } from "@/lib/api";
import DestinationCard from "@/components/DestinationCard";

export default async function DestinationsPage() {
  // If the API can't be reached (e.g. no backend deployed yet), show the
  // existing "no destinations" empty state instead of crashing the page.
  const destinations = await getDestinations().catch(() => []);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Destinations
      </h1>
      <p className="mt-2 text-zinc-600">
        {destinations.length} destination{destinations.length === 1 ? "" : "s"} to
        explore.
      </p>

      {destinations.length === 0 ? (
        <p className="mt-10 text-zinc-500">No destinations published yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </ul>
      )}
    </div>
  );
}

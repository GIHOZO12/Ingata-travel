import Link from "next/link";
import { getDestinations } from "@/lib/api";
import TourForm from "../TourForm";
import { saveTour } from "../actions";

export default async function NewTourPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Add tour</h1>

      {destinations.length === 0 ? (
        <p className="text-sm text-zinc-600">
          A tour belongs to a destination.{" "}
          <Link href="/admin/destinations/new" className="underline">
            Add a destination first
          </Link>
          .
        </p>
      ) : (
        <TourForm action={saveTour.bind(null, null)} destinations={destinations} />
      )}
    </div>
  );
}

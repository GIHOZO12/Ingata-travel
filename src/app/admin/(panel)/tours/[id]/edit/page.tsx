import { notFound } from "next/navigation";
import { getDestinations, getTour, getTours } from "@/lib/api";
import TourForm from "../../TourForm";
import { saveTour } from "../../actions";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tourId = Number(id);

  // The API looks tours up by slug, so find this one in the list first, then
  // load the full tour (with its itinerary) by slug.
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);
  const summary = tours.find((t) => t.id === tourId);
  if (!summary) notFound();

  const tour = await getTour(summary.slug);
  if (!tour) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit {tour.name}</h1>
      <TourForm
        action={saveTour.bind(null, tour.id)}
        destinations={destinations}
        tour={tour}
      />
    </div>
  );
}

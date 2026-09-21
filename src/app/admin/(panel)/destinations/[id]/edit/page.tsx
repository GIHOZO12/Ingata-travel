import { notFound } from "next/navigation";
import { getDestinations } from "@/lib/api";
import DestinationForm from "../../DestinationForm";
import { saveDestination } from "../../actions";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // [id] is a dynamic segment; in this Next.js version params is a Promise.
  const { id } = await params;
  const destinationId = Number(id);

  // The API can fetch one destination by slug (not id), so we find it in the list.
  const destinations = await getDestinations();
  const destination = destinations.find((d) => d.id === destinationId);

  if (!destination) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Edit {destination.name}
      </h1>
      <DestinationForm
        action={saveDestination.bind(null, destination.id)}
        destination={destination}
      />
    </div>
  );
}

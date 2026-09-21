import Link from "next/link";
import { getDestinations } from "@/lib/api";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteDestination, toggleFeatured } from "./actions";

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const destinations = await getDestinations();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Destinations</h1>
        <Link
          href="/admin/destinations/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add destination
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {destinations.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No destinations yet. Add your first one.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
          {destinations.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {d.name}
                  {d.isFeatured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-sm text-zinc-500">{d.country}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <form action={toggleFeatured}>
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="isFeatured" value={String(!d.isFeatured)} />
                  <button type="submit" className="text-zinc-600 hover:underline">
                    {d.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                </form>
                <Link
                  href={`/admin/destinations/${d.id}/edit`}
                  className="text-zinc-600 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteDestination}>
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton
                    message={`Delete "${d.name}"? This cannot be undone.`}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { getTours } from "@/lib/api";
import { formatDuration, formatPrice } from "@/lib/format";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteTour, toggleTourFeatured } from "./actions";

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const tours = await getTours();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Tours</h1>
        <Link
          href="/admin/tours/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add tour
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {tours.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No tours yet. Add a destination first, then add your first tour.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
          {tours.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {t.name}
                  {t.isFeatured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-sm text-zinc-500">
                  {t.destination.name} · {t.category} ·{" "}
                  {formatDuration(t.durationDays, t.durationNights)}
                  {formatPrice(t.startingPrice, t.currency) &&
                    ` · from ${formatPrice(t.startingPrice, t.currency)}`}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/tour/${t.slug}`}
                  className="text-zinc-600 hover:underline"
                >
                  View
                </Link>
                <form action={toggleTourFeatured}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="isFeatured" value={String(!t.isFeatured)} />
                  <button type="submit" className="text-zinc-600 hover:underline">
                    {t.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                </form>
                <Link
                  href={`/admin/tours/${t.id}/edit`}
                  className="text-zinc-600 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteTour}>
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmButton
                    message={`Delete "${t.name}"? This cannot be undone.`}
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

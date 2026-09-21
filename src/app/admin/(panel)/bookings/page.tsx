import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { BOOKING_STATUSES, type BookingRequest } from "@/lib/types";
import StatusBadge, { statusLabel } from "@/components/admin/StatusBadge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteBooking, updateBookingStatus } from "./actions";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // In this Next.js version searchParams is a Promise, so it must be awaited.
  const { status } = await searchParams;
  const activeStatus = BOOKING_STATUSES.find((s) => s === status);

  const bookings = await adminFetch<BookingRequest[]>(
    `/booking-requests${activeStatus ? `?status=${activeStatus}` : ""}`,
  );

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Booking requests</h1>

      {/* Status filter: plain links that change the ?status= part of the URL */}
      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/bookings"
          className={`rounded-full px-3 py-1 text-sm ${
            !activeStatus ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
          }`}
        >
          All
        </Link>
        {BOOKING_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`rounded-full px-3 py-1 text-sm ${
              activeStatus === s ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
            }`}
          >
            {statusLabel(s)}
          </Link>
        ))}
      </nav>

      {bookings.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No booking requests{activeStatus ? " with this status" : " yet"}.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Tour</th>
                <th className="px-4 py-3">Travel</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 align-top">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{b.fullName}</p>
                    <a href={`mailto:${b.email}`} className="text-zinc-600 hover:underline">
                      {b.email}
                    </a>
                    <p className="text-zinc-600">{b.phone}</p>
                    {b.nationality && (
                      <p className="text-zinc-500">{b.nationality}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-800">{b.tour.name}</td>
                  <td className="px-4 py-3 text-zinc-800">
                    <p>{formatDate(b.travelDate)}</p>
                    <p className="text-zinc-500">
                      {b.numberOfTravelers} traveler
                      {b.numberOfTravelers === 1 ? "" : "s"}
                    </p>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-zinc-600">
                    {b.accommodationPref && <p>Stay: {b.accommodationPref}</p>}
                    {b.specialRequests && <p>{b.specialRequests}</p>}
                    <p className="mt-1 text-xs text-zinc-400">
                      Received {formatDate(b.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                    <form action={updateBookingStatus} className="mt-2 flex gap-1">
                      <input type="hidden" name="id" value={b.id} />
                      <select
                        name="status"
                        defaultValue={b.status}
                        aria-label={`Status for ${b.fullName}`}
                        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900"
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={deleteBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmButton
                        message={`Delete the booking request from ${b.fullName}? This cannot be undone.`}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

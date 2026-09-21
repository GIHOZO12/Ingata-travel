import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { getDestinations } from "@/lib/api";
import type { BookingRequest } from "@/lib/types";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminOverviewPage() {
  // Promise.all runs both requests at the same time instead of one after the other.
  const [bookings, destinations] = await Promise.all([
    adminFetch<BookingRequest[]>("/booking-requests"),
    getDestinations(),
  ]);

  const stats = [
    { label: "Total bookings", value: bookings.length },
    {
      label: "New bookings",
      value: bookings.filter((b) => b.status === "NEW").length,
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "CONFIRMED").length,
    },
    { label: "Destinations", value: destinations.length },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>

      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm">
            <dt className="text-sm text-zinc-500">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-semibold text-zinc-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            Latest booking requests
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
          >
            View all →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No booking requests yet. They will appear here when visitors submit
            the booking form.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
            {bookings.slice(0, 5).map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-zinc-900">{booking.fullName}</p>
                  <p className="text-sm text-zinc-500">{booking.tour.name}</p>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

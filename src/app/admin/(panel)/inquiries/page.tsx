import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import { INQUIRY_STATUSES, type Inquiry, type InquiryStatus } from "@/lib/types";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteInquiry, updateInquiryStatus } from "./actions";

const label = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase();

const badge: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  CLOSED: "bg-zinc-200 text-zinc-800",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = INQUIRY_STATUSES.find((s) => s === status);

  const inquiries = await adminFetch<Inquiry[]>(
    `/inquiries${activeStatus ? `?status=${activeStatus}` : ""}`,
  );

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Inquiries</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Messages from the contact form and the “Plan your trip” form.
      </p>

      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries"
          className={`rounded-full px-3 py-1 text-sm ${
            !activeStatus ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
          }`}
        >
          All
        </Link>
        {INQUIRY_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${s}`}
            className={`rounded-full px-3 py-1 text-sm ${
              activeStatus === s ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
            }`}
          >
            {label(s)}
          </Link>
        ))}
      </nav>

      {inquiries.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No inquiries{activeStatus ? " with this status" : " yet"}.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {inquiries.map((i) => (
            <li key={i.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-900">{i.fullName}</p>
                  <p className="text-sm text-zinc-600">
                    <a href={`mailto:${i.email}`} className="hover:underline">
                      {i.email}
                    </a>
                    {i.phone && ` · ${i.phone}`}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Received {formatDate(i.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge[i.status]}`}
                >
                  {label(i.status)}
                </span>
              </div>

              {(i.tour || i.destinationName || i.preferredDate || i.numberOfTravelers) && (
                <p className="mt-3 text-sm text-zinc-700">
                  {[
                    i.tour && `Tour: ${i.tour.name}`,
                    i.destinationName && `Destination: ${i.destinationName}`,
                    i.preferredDate && `Date: ${formatDate(i.preferredDate)}`,
                    i.numberOfTravelers &&
                      `${i.numberOfTravelers} traveler${i.numberOfTravelers === 1 ? "" : "s"}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {i.message && (
                <p className="mt-3 whitespace-pre-line rounded-md bg-zinc-50 p-3 text-sm text-zinc-800">
                  {i.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <form action={updateInquiryStatus} className="flex gap-1">
                  <input type="hidden" name="id" value={i.id} />
                  <select
                    name="status"
                    defaultValue={i.status}
                    aria-label={`Status for ${i.fullName}`}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900"
                  >
                    {INQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
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
                <form action={deleteInquiry}>
                  <input type="hidden" name="id" value={i.id} />
                  <ConfirmButton
                    message={`Delete the inquiry from ${i.fullName}? This cannot be undone.`}
                    className="text-xs text-red-600 hover:underline"
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

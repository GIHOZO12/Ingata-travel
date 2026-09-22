import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import type { Testimonial } from "@/lib/types";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteTestimonial, toggleApproved } from "./actions";

export default async function AdminTestimonialsPage() {
  // "/all" includes testimonials that are not approved yet.
  const testimonials = await adminFetch<Testimonial[]>("/testimonials/all");

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No testimonials yet. Add real feedback from your travelers.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
          {testimonials.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-start justify-between gap-4 px-5 py-4"
            >
              <div className="max-w-xl">
                <p className="font-medium text-zinc-900">
                  {t.customerName}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {t.isApproved ? "Approved" : "Pending"}
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  {[t.country, t.category].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-700">{t.content}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <form action={toggleApproved}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="isApproved" value={String(!t.isApproved)} />
                  <button type="submit" className="text-zinc-600 hover:underline">
                    {t.isApproved ? "Unapprove" : "Approve"}
                  </button>
                </form>
                <Link
                  href={`/admin/testimonials/${t.id}/edit`}
                  className="text-zinc-600 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmButton
                    message={`Delete the testimonial from ${t.customerName}? This cannot be undone.`}
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

import Link from "next/link";
import { getFAQs } from "@/lib/api";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteFaq } from "./actions";

export default async function AdminFaqsPage() {
  const faqs = await getFAQs();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">FAQs</h1>
        <Link
          href="/admin/faqs/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No FAQs yet. Suggested topics: destinations offered, what is
          included, booking, payment, cancellation and travel documents.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
          {faqs.map((faq) => (
            <li
              key={faq.id}
              className="flex flex-wrap items-start justify-between gap-4 px-5 py-4"
            >
              <div className="max-w-xl">
                <p className="font-medium text-zinc-900">{faq.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{faq.answer}</p>
                <p className="mt-1 text-xs text-zinc-400">Order: {faq.order}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/admin/faqs/${faq.id}/edit`}
                  className="text-zinc-600 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteFaq}>
                  <input type="hidden" name="id" value={faq.id} />
                  <ConfirmButton
                    message="Delete this FAQ? This cannot be undone."
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

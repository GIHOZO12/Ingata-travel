import type { Metadata } from "next";
import Link from "next/link";
import { getFAQs } from "@/lib/api";

export const metadata: Metadata = {
  title: "FAQs | Travel & Tour Company",
  description: "Answers to common questions about our tours, booking, payment and travel requirements.",
};

export default async function FaqsPage() {
  // If the API can't be reached (e.g. no backend deployed yet), show the
  // existing "no questions published" empty state instead of crashing.
  const faqs = await getFAQs().catch(() => []);

  // Structured data so search engines can show these questions in results
  // (SRS §54: FAQPage). "<" is escaped so an answer can never close the script tag.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Frequently asked questions
        </h1>
        <p className="mt-2 text-zinc-600">
          Can’t find your answer?{" "}
          <Link href="/contact" className="underline">
            Contact us
          </Link>
          .
        </p>

        {faqs.length === 0 ? (
          <p className="mt-10 text-zinc-500">
            No questions have been published yet.
          </p>
        ) : (
          <>
            {/* <details> gives an open/close accordion with no JavaScript */}
            <div className="mt-10 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
              {faqs.map((faq) => (
                <details key={faq.id} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="text-xl text-zinc-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-sm text-zinc-700">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonLd }}
            />
          </>
        )}
      </div>
    </div>
  );
}

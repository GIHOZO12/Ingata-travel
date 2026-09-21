import type { Metadata } from "next";
import Link from "next/link";
import { getTours } from "@/lib/api";
import { tomorrowISO } from "@/lib/format";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a Tour | Travel & Tour Company",
  description: "Send a booking request and our team will confirm availability.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  // /book?tour=some-slug pre-selects that tour (the "Book Now" buttons use it).
  const { tour: tourSlug } = await searchParams;
  const tours = await getTours();
  const selected = tours.find((t) => t.slug === tourSlug);


  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Book your tour</h1>
        <p className="mt-2 text-zinc-600">
          Tell us your plans. We’ll check availability and reply with a
          quotation.
        </p>

        <div className="mt-10">
          {tours.length === 0 ? (
            <p className="text-zinc-500">
              Our tours are being prepared. In the meantime, please{" "}
              <Link href="/contact" className="underline">
                contact us
              </Link>
              .
            </p>
          ) : (
            <BookingForm
              tours={tours.map((t) => ({ id: t.id, name: t.name }))}
              defaultTourId={selected?.id}
              minDate={tomorrowISO()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

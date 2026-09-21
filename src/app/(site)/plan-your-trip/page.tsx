import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { getTours } from "@/lib/api";
import { tomorrowISO } from "@/lib/format";

export const metadata: Metadata = {
  title: "Plan Your Trip | Travel & Tour Company",
  description: "Tell us about your dream trip and we’ll design an itinerary around it.",
};

export default async function PlanYourTripPage() {
  // The tour list is only used for the optional "tour you're interested in"
  // dropdown, so if the API is down the form still works without it.
  const tours = await getTours().catch(() => []);

  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Plan your trip</h1>
        <p className="mt-2 text-zinc-600">
          Tell us where you’d like to go and what you’d love to do. We’ll design
          an itinerary and quotation around you. Already know the tour you
          want?{" "}
          <Link href="/book" className="underline">
            Send a booking request
          </Link>
          .
        </p>

        <div className="mt-10">
          <InquiryForm
            showTripFields
            tours={tours.map((t) => ({ id: t.id, name: t.name }))}
            messageLabel="Tell us about your dream trip (activities, budget, who’s travelling…)"
            minDate={tomorrowISO()}
          />
        </div>
      </div>
    </div>
  );
}

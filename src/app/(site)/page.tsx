import Link from "next/link";
import { getDestinations, getTours } from "@/lib/api";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import HeroSlider from "@/components/HeroSlider";
import type { Destination, Tour } from "@/lib/types";

// Static content for the sections (SRS §15 and §38). Final wording must be
// approved by the company, so it lives in plain arrays that are easy to edit.
const whyChooseUs = [
  {
    title: "Local Expertise",
    text: "Our local knowledge helps travelers discover destinations beyond the ordinary.",
  },
  {
    title: "Personalized Experiences",
    text: "We design travel around your interests, preferences and schedule.",
  },
  {
    title: "Professional Service",
    text: "Organized, customer-focused support throughout your journey.",
  },
  {
    title: "Safety & Reliability",
    text: "Responsible planning, reliable service and traveler support.",
  },
];

const howItWorks = [
  { title: "Explore", text: "Browse destinations and available tours." },
  { title: "Choose", text: "Pick what matches your travel interests." },
  { title: "Enquire", text: "Send an inquiry or request a custom itinerary." },
  { title: "Plan", text: "Agree dates, activities and accommodation." },
  { title: "Confirm", text: "Review the itinerary, quotation and terms." },
  { title: "Book", text: "Confirm your trip with our booking process." },
  { title: "Travel", text: "Enjoy your journey with our support." },
];

// Featured destinations come from the API. If the API is down we still want
// the homepage to load, so we catch the error and show the rest of the page.
async function getFeaturedDestinations(): Promise<Destination[]> {
  try {
    const all = await getDestinations();
    const featured = all.filter((d) => d.isFeatured);
    // Fall back to the first three if nothing is marked featured yet.
    return (featured.length > 0 ? featured : all).slice(0, 3);
  } catch {
    return [];
  }
}

// Same idea for tours (SRS §13): featured ones first, otherwise the newest.
async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const all = await getTours();
    const featured = all.filter((t) => t.isFeatured);
    return (featured.length > 0 ? featured : all).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [featured, featuredTours] = await Promise.all([
    getFeaturedDestinations(),
    getFeaturedTours(),
  ]);

  return (
    <>
      {/* Hero (SRS §11) */}
      <HeroSlider>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover Extraordinary Journeys Across Africa
          </h1>
          <p className="mt-6 text-lg text-white ">
            Explore unforgettable destinations, wildlife experiences, cultural
            adventures and personalized tours designed around your travel
            dreams.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/tours"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Explore Our Tours
            </Link>
            <Link
              href="/plan-your-trip"
              className="rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Plan Your Trip
            </Link>
          </div>
          <p className="mt-10 text-sm text-zinc-300">
            Your Journey. Our Expertise. Unforgettable Memories.
          </p>
        </div>
      </HeroSlider>

      {/* Featured destinations (SRS §12) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Featured Destinations
          </h2>
          <Link
            href="/destinations"
            className="text-sm font-medium text-white hover:text-zinc-900"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-8 text-zinc-500">
            Destinations are not available right now. Please check back soon.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </ul>
        )}
      </section>

      {/* Featured tours (SRS §13) - hidden until at least one tour exists */}
      {featuredTours.length > 0 && (
        <section className="bg-white px-6 py-16 text-zinc-900">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-semibold tracking-tight">
                Featured Tours
              </h2>
              <Link
                href="/tours"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                View all →
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Why choose us (SRS §15) */}
      <section className="bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Why Choose Us
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title}>
                <h3 className="font-medium text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (SRS §38) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          How It Works
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact call-to-action (SRS §9 item 14) */}
      <section className="bg-zinc-900 px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to plan your trip?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-300">
          Tell us what you have in mind and our team will get back to you.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          Contact Us
        </Link>
      </section>
    </>
  );
}

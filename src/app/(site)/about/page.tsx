import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}, our mission, vision and the values behind every journey we organise.`,
};

// Proposed wording from the SRS (§14-20). The company must approve the final text.
const values = [
  { title: "Integrity", text: "We are honest about what a tour includes, what it costs and what to expect." },
  { title: "Customer Focus", text: "Your interests, pace and questions shape the trip we plan with you." },
  { title: "Professionalism", text: "Organised planning and clear communication from first inquiry to return home." },
  { title: "Reliability", text: "We do what we say, and we are there when plans change." },
  { title: "Adventure", text: "We love wild places and help you explore them with confidence." },
  { title: "Respect", text: "For travelers, local communities, cultures and wildlife." },
  { title: "Sustainability", text: "We encourage responsible travel that protects the places we visit." },
  { title: "Authenticity", text: "Real people, real places and experiences beyond the ordinary." },
];

export default function AboutPage() {
  return (
    <div className="flex-1 bg-white text-zinc-900">
      <section className="bg-zinc-900 px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          About {siteConfig.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
          {siteConfig.tagline}
        </p>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
        <section>
          <h2 className="text-2xl font-semibold">Who we are</h2>
          <div className="mt-4 space-y-4 text-zinc-700">
            <p>
              {siteConfig.name} is a travel and tour company providing
              professionally organised travel experiences for individuals,
              couples, families, groups and corporate customers.
            </p>
            <p>
              Our services can include tour packages, safaris, cultural
              experiences, adventure travel, accommodation coordination,
              transportation arrangements and customised itineraries. Our goal
              is to make travel planning simple while helping you discover
              remarkable destinations and experiences.
            </p>
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl bg-zinc-50 p-6">
            <h2 className="text-xl font-semibold">Our mission</h2>
            <p className="mt-3 text-zinc-700">
              To create memorable and responsible travel experiences by
              connecting travelers with exceptional destinations, cultures and
              experiences through professional and customer-focused tourism
              services.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-6">
            <h2 className="text-xl font-semibold">Our vision</h2>
            <p className="mt-3 text-zinc-700">
              To become a trusted and leading travel partner for travelers
              seeking authentic, memorable and responsible experiences in
              Africa and beyond.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Our values</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <li key={value.title}>
                <h3 className="font-medium">{value.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{value.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-zinc-900 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">Ready to plan your journey?</h2>
          <p className="mx-auto mt-2 max-w-lg text-zinc-300">
            Browse our tours, or tell us your ideas and we will design a trip
            around you.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tours"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
            >
              Explore our tours
            </Link>
            <Link
              href="/plan-your-trip"
              className="rounded-full border border-white px-6 py-3 text-sm font-medium hover:bg-white/10"
            >
              Plan your trip
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

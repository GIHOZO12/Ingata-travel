import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Travel Information | ${siteConfig.name}`,
  description: "Practical tips for planning your trip: visas, health, money, weather, safety, packing and more.",
};

// General guidance only (SRS §39). Country-specific facts change often, so
// each section points travelers to official sources instead of quoting rules.
const sections = [
  {
    title: "Passports & visas",
    points: [
      "Check that your passport is valid for the whole trip, and often for several months after; requirements differ by country.",
      "Visa rules depend on your nationality and destination. Always confirm with the embassy or official immigration website before you book flights.",
    ],
  },
  {
    title: "Health & vaccinations",
    points: [
      "Talk to a doctor or travel clinic well before departure about recommended vaccinations and any malaria prevention.",
      "Carry any personal medication in its original packaging, with a copy of the prescription.",
    ],
  },
  {
    title: "Money & payments",
    points: [
      "Carry some local currency for small purchases and tips; cards are not accepted everywhere, especially in rural areas.",
      "Tell us your budget and we will explain what is included in your tour and what to pay for yourself.",
    ],
  },
  {
    title: "Weather & best time to go",
    points: [
      "Weather varies by region and altitude, and wildlife and trekking conditions change with the seasons.",
      "Tell us your dates and we will suggest what to expect, or a better time to travel.",
    ],
  },
  {
    title: "Getting around",
    points: [
      "Most of our tours include transport with a driver-guide. We can also arrange airport transfers and domestic transfers on request.",
    ],
  },
  {
    title: "Safety",
    points: [
      "Follow your guide's instructions, especially around wildlife and on trails.",
      "Keep valuables secure, share your itinerary with someone at home and keep emergency numbers handy.",
    ],
  },
  {
    title: "Culture & etiquette",
    points: [
      "Greet people politely, ask before taking photographs of people, and dress modestly in villages and places of worship.",
    ],
  },
  {
    title: "What to pack",
    points: [
      "Comfortable walking shoes, layers for changing temperatures, rain protection, sun protection, insect repellent and a reusable water bottle.",
      "Neutral-coloured clothing is best for safaris. Your tour details list any specific requirements.",
    ],
  },
  {
    title: "Travel insurance",
    points: [
      "We strongly recommend insurance covering medical care, emergency evacuation, cancellation and belongings.",
    ],
  },
];

export default function TravelInformationPage() {
  return (
    <ContentPage
      title="Travel information"
      intro="Practical tips to help you prepare for your trip."
      notice={
        <>
          This is general guidance and can change. It does not replace official
          government or health advice: always confirm current requirements with
          the relevant authorities. See our{" "}
          <Link href="/travel-disclaimer" className="underline">
            travel disclaimer
          </Link>
          .
        </>
      }
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-zinc-700">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </ContentPage>
  );
}

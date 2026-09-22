import { siteConfig } from "@/lib/site";

// DRAFT legal texts (SRS §77). They are general templates, NOT legal advice.
// Anything in [square brackets] is a decision the company must make. The
// company's legal or management team must review and approve all of this
// before it is relied on (then set legalApproved: true in lib/site.ts).

export interface LegalPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; paragraphs: string[] }[];
}

const name = siteConfig.name;
const email = siteConfig.email;

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: `How ${name} collects, uses and protects your personal information.`,
    sections: [
      {
        heading: "Who we are",
        paragraphs: [
          `${name} is a travel and tour company. This policy explains what personal information we collect through this website, why we collect it and how we look after it. You can contact us about it at ${email}.`,
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "When you send a booking request, inquiry or contact message we collect the details you enter: your name, email address, phone number, nationality (where asked), preferred travel dates, number of travelers, accommodation preferences, special requests (which may include dietary or accessibility needs) and your message.",
          "We only ask for information we reasonably need to answer your inquiry or organise your trip.",
        ],
      },
      {
        heading: "How we use your information",
        paragraphs: [
          "To reply to your inquiry, check availability, prepare quotations, confirm and manage your booking, and keep you informed about your trip. We may also send you confirmation emails about your request.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "Only with people and businesses that help us deliver your trip, such as lodges and hotels, guides, transport providers and payment providers, and only the information they need. We may also share information where the law requires it.",
        ],
      },
      {
        heading: "How we protect it",
        paragraphs: [
          "Our website uses encrypted connections (HTTPS) in production, access to booking information is limited to authorised staff who sign in, and we keep our software up to date. No system is perfectly secure, but we take reasonable steps to protect your information.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "[Company to confirm the retention period, for example: booking records for X years for accounting and legal reasons; inquiries that do not lead to a booking for X months.]",
        ],
      },
      {
        heading: "Third-party services",
        paragraphs: [
          "Our contact page shows a Google Map. Loading it may send information such as your IP address to Google under Google's own privacy policy. [Company to list any other services it uses, such as analytics, email or payment providers.]",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You can ask us to show you the personal information we hold about you, correct it or delete it, subject to any legal duty we have to keep it. Email ${email} and we will respond.`,
        ],
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    description: `The terms for using the ${name} website and booking with us.`,
    sections: [
      {
        heading: "Using this website",
        paragraphs: [
          `By using this website you agree to these terms. The website is provided by ${name} to share information about our destinations and tours and to let you send inquiries and booking requests.`,
        ],
      },
      {
        heading: "Booking requests",
        paragraphs: [
          "A booking request sent through this website is a request only. A booking is confirmed only when we confirm it to you in writing after checking availability and agreeing the itinerary, price and payment terms with you.",
        ],
      },
      {
        heading: "Prices and availability",
        paragraphs: [
          "Prices shown are starting prices per person unless stated otherwise and may change with season, group size and options. We show what is included and not included for each tour; please read it carefully. [Company to state which taxes and fees are included.]",
        ],
      },
      {
        heading: "Accuracy of information",
        paragraphs: [
          "We work to keep tour, price and travel information accurate, but it can change. Nothing on this website replaces official government or health guidance.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "[Company's legal representative to insert the limitation of liability and force majeure wording appropriate to the company's country and services.]",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "[Company to state the country whose laws apply and where disputes are handled.]",
        ],
      },
      {
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time. The version on this page is the current one.",
        ],
      },
    ],
  },
  {
    slug: "booking-policy",
    title: "Booking Policy",
    description: "How booking a tour with us works, step by step.",
    sections: [
      {
        heading: "How booking works",
        paragraphs: [
          "1. Choose a tour or send us a custom trip inquiry.",
          "2. Send a booking request with your preferred date and number of travelers.",
          "3. We check availability and send you a quotation and the applicable terms.",
          "4. When you accept, we confirm your booking in writing and tell you how to pay.",
        ],
      },
      {
        heading: "Payment",
        paragraphs: [
          "[Company to state the deposit amount or percentage, when the balance is due and the accepted payment methods, for example bank transfer or mobile money.]",
        ],
      },
      {
        heading: "Traveler responsibilities",
        paragraphs: [
          "You are responsible for having a valid passport, any visas or permits required, and suitable travel insurance. Please check official sources for the latest requirements.",
        ],
      },
      {
        heading: "Changes to your booking",
        paragraphs: [
          "Contact us as early as possible if you want to change dates, travelers or options. Changes depend on availability and may change the price. See also our Cancellation Policy.",
        ],
      },
    ],
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    description: "What happens if you or we need to cancel a booking.",
    sections: [
      {
        heading: "If you cancel",
        paragraphs: [
          "[Company to insert the cancellation schedule, for example the charge that applies at different numbers of days before departure. Some costs, such as gorilla or park permits, may be non-refundable once purchased. State this clearly.]",
          "Please tell us in writing as soon as you know you need to cancel.",
        ],
      },
      {
        heading: "If we need to cancel or change your tour",
        paragraphs: [
          "Sometimes weather, safety, park closures or other events beyond our control mean a tour must change. We will tell you as soon as we can and offer suitable alternatives, or a refund as described in our Refund Policy.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "When and how refunds are made.",
    sections: [
      {
        heading: "Eligibility",
        paragraphs: [
          "[Company to describe when refunds apply, based on the Cancellation Policy, and which amounts are non-refundable.]",
        ],
      },
      {
        heading: "How refunds are made",
        paragraphs: [
          "[Company to state how long refunds take and the method used, for example the original payment method or bank transfer, and who pays any transfer fees.]",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [`If you have a question about a refund, email ${email} with your name and the tour you booked.`],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "How this website uses cookies.",
    sections: [
      {
        heading: "What cookies are",
        paragraphs: [
          "Cookies are small files a website stores in your browser to remember things between pages.",
        ],
      },
      {
        heading: "How we use them",
        paragraphs: [
          "This website currently uses only strictly necessary cookies. The only one is used to keep our staff signed in to the admin area; visitors do not receive it.",
          "Our contact page embeds a Google Map, and Google may set its own cookies when the map loads.",
          "If we add analytics or marketing tools in the future, we will update this policy and ask for your consent where the law requires it.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can delete or block cookies in your browser settings. Blocking necessary cookies will not affect browsing the public website.",
        ],
      },
    ],
  },
  {
    slug: "responsible-tourism",
    title: "Responsible Tourism",
    description: "How we ask travelers to protect wildlife, nature and local communities.",
    sections: [
      {
        heading: "Our approach",
        paragraphs: [
          "[Company to describe its real commitments and practices, for example environmental protection, support for local businesses and community partnerships. Only include statements the company can back up.]",
        ],
      },
      {
        heading: "What we ask of travelers",
        paragraphs: [
          "Follow your guide's instructions and park rules, especially around wildlife. Keep the required distance from animals, never feed them, and keep noise low.",
          "Take your rubbish with you, stay on marked trails, and avoid single-use plastic where you can.",
          "Ask before photographing people, dress respectfully in communities and places of worship, and buy from local businesses where possible.",
        ],
      },
    ],
  },
  {
    slug: "travel-disclaimer",
    title: "Travel Disclaimer",
    description: "Important information about travel information on this website.",
    sections: [
      {
        heading: "General information only",
        paragraphs: [
          "Travel information on this website, including visas, health, weather, safety and costs, is general guidance and can change. It does not replace official government or health advice. Always confirm current requirements with the relevant authorities before you travel.",
        ],
      },
      {
        heading: "Nature and wildlife",
        paragraphs: [
          "Wildlife and nature are unpredictable. Sightings cannot be guaranteed, and itineraries may change because of weather, road or park conditions, or for your safety.",
        ],
      },
      {
        heading: "Travel insurance",
        paragraphs: [
          "We strongly recommend comprehensive travel insurance that covers medical care, emergency evacuation, trip cancellation and your belongings.",
        ],
      },
    ],
  },
];

export const getLegalPage = (slug: string) =>
  legalPages.find((page) => page.slug === slug);

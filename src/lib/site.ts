// Single source of truth for company details and navigation.
// Customising this template for a new travel company = edit this file
// (SRS: "reusable website template to be customized when needed").
// TODO: replace placeholder contact details with the company's approved ones.

export const siteConfig = {
  name: "Ingata Travel",
  tagline: "Your Journey. Our Expertise. Unforgettable Memories.",
  phone: "+250 000 000 000",
  email: "info@example.com",
  address: "Kigali, Rwanda",
};

// SRS §10 recommended navigation. "Book Now" is handled separately as a CTA button.
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Travel Info", href: "/travel-information" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

// SRS §50 footer groups.
export const footerNav = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  Explore: [
    { label: "Destinations", href: "/destinations" },
    { label: "Tours", href: "/tours" },
    { label: "Plan Your Trip", href: "/plan-your-trip" },
  ],
  Resources: [
    { label: "Travel Information", href: "/travel-information" },
    { label: "FAQs", href: "/faqs" },
    { label: "Travel Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Booking Policy", href: "/booking-policy" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
  ],
};

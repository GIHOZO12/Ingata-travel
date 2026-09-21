import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | Travel & Tour Company",
  description: "Get in touch with our travel team by phone, WhatsApp, email or the contact form.",
};

export default function ContactPage() {
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;

  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-2 max-w-xl text-zinc-600">
          Questions about a tour or planning a trip? Send us a message and we’ll
          get back to you.
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="contact-form">
            <h2 id="contact-form" className="sr-only">
              Contact form
            </h2>
            <InquiryForm />
          </section>

          <section aria-labelledby="contact-details" className="space-y-8">
            <div>
              <h2 id="contact-details" className="text-xl font-semibold">
                Get in touch
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-zinc-500">Phone</dt>
                  <dd>
                    <a href={phoneHref} className="text-zinc-900 hover:underline">
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">WhatsApp</dt>
                  <dd>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-900 hover:underline"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">Email</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.email}`} className="text-zinc-900 hover:underline">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">Office</dt>
                  <dd>{siteConfig.address}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">Business hours</dt>
                  <dd>{siteConfig.hours}</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                <iframe
                  title={`Map showing ${siteConfig.address}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
              >
                Get directions →
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

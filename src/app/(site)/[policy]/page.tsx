import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getLegalPage, legalPages } from "@/lib/legal";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ policy: string }> };

// One template serves all legal pages: /privacy-policy, /terms-and-conditions,
// /booking-policy, /cancellation-policy, /refund-policy, /cookie-policy, ...
// generateStaticParams lists the allowed addresses; anything else is a 404.
export function generateStaticParams() {
  return legalPages.map((page) => ({ policy: page.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy } = await params;
  const page = getLegalPage(policy);
  if (!page) return {};
  return {
    title: `${page.title} | ${siteConfig.name}`,
    description: page.description,
  };
}

export default async function PolicyPage({ params }: Props) {
  const { policy } = await params;
  const page = getLegalPage(policy);
  if (!page) notFound();

  return (
    <ContentPage
      title={page.title}
      notice={
        !siteConfig.legalApproved && (
          <>
            <strong>Draft.</strong> This text is a template and is being
            reviewed. It may change before it is final.
          </>
        )
      }
    >
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <div className="mt-2 space-y-3 text-zinc-700">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </ContentPage>
  );
}

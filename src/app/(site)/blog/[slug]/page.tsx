import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { getBlogPost } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const plainExcerpt = (content: string) =>
  content
    .replace(/^#{2,3} /gm, "")
    .replace(/^- /gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

// Per-article title, description and social-sharing image (SRS §47/§51).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };

  const image = resolveImageUrl(post.featuredImage);
  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: plainExcerpt(post.content),
    openGraph: {
      title: post.title,
      description: plainExcerpt(post.content),
      type: "article",
      ...(image && { images: [image] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const image = resolveImageUrl(post.featuredImage);
  const date = post.publishedAt ?? post.createdAt;

  // Structured data for search engines (SRS §54: Article). "<" is escaped so
  // article text can never close the script tag.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: date,
    dateModified: post.updatedAt,
    ...(post.author && { author: { "@type": "Person", name: post.author } }),
    ...(image && { image }),
  }).replace(/</g, "\\u003c");

  return (
    <article className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Back to blog
        </Link>

        <p className="mt-6 text-xs uppercase tracking-wide text-zinc-500">
          {[post.category, formatDate(date), post.author && `By ${post.author}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {image && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <RichText text={post.content} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 rounded-xl bg-zinc-900 p-6 text-center text-white">
          <p className="text-lg font-semibold">Ready to plan your own trip?</p>
          <Link
            href="/plan-your-trip"
            className="mt-4 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Plan your trip
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </article>
  );
}

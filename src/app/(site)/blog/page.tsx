import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Travel Blog | ${siteConfig.name}`,
  description: "Destination guides, safari tips, packing lists and travel stories.",
};

// First paragraph of the article, trimmed, for the card preview.
const excerpt = (content: string) =>
  content
    .replace(/^#{2,3} /gm, "")
    .replace(/^- /gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

export default async function BlogPage() {
  // If the API can't be reached (e.g. no backend deployed yet), show the
  // existing "articles coming soon" empty state instead of crashing.
  const posts = await getBlogPosts().catch(() => []);

  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Travel blog</h1>
        <p className="mt-2 text-zinc-600">
          Guides, tips and stories to help you plan your journey.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-zinc-500">
            Our first articles are coming soon. Please check back.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = resolveImageUrl(post.featuredImage);
              return (
                <li key={post.id} className="overflow-hidden rounded-lg border border-zinc-200">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-200 to-zinc-300">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={post.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {[post.category, formatDate(post.publishedAt ?? post.createdAt)]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                        {excerpt(post.content)}
                      </p>
                      <p className="mt-4 text-sm font-medium">Read more →</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

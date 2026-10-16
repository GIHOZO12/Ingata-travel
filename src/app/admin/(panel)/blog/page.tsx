import Link from "next/link";
import { getBlogPosts } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { verifyAdmin } from "@/lib/admin-api";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteBlogPost } from "./actions";

export default async function AdminBlogPage() {
  // Staff can create/edit articles, but deleting stays admin-only — the
  // button is hidden for them rather than shown and then rejected by the API.
  const [posts, me] = await Promise.all([getBlogPosts(), verifyAdmin()]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + New article
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          No articles yet. Destination guides, safari tips and packing lists
          work well.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900">{post.title}</p>
                <p className="text-sm text-zinc-500">
                  {[post.category, formatDate(post.publishedAt ?? post.createdAt)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/blog/${post.slug}`} className="text-zinc-600 hover:underline">
                  View
                </Link>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-zinc-600 hover:underline"
                >
                  Edit
                </Link>
                {me.role === "ADMIN" && (
                  <form action={deleteBlogPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton
                      message={`Delete "${post.title}"? This cannot be undone.`}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

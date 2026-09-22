import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/api";
import BlogForm from "../../BlogForm";
import { saveBlogPost } from "../../actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit article</h1>
      <BlogForm action={saveBlogPost.bind(null, post.id)} post={post} />
    </div>
  );
}

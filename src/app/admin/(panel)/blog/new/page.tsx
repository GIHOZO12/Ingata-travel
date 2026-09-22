import BlogForm from "../BlogForm";
import { saveBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">New article</h1>
      <BlogForm action={saveBlogPost.bind(null, null)} />
    </div>
  );
}

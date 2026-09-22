"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import type { FormState } from "@/lib/form";
import { resolveImageUrl } from "@/lib/images";
import Field, { inputClass } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";

const CATEGORIES = [
  "Destination guide",
  "Travel tips",
  "Safari guide",
  "Cultural experiences",
  "Packing guide",
  "Wildlife",
  "Responsible tourism",
  "Company news",
];

export default function BlogForm({
  action,
  post,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  post?: BlogPost;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const text = (key: string, saved: string) =>
    typeof state?.values?.[key] === "string"
      ? (state.values[key] as string)
      : saved;
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field label="Title" name="title" error={errors.title}>
        <input
          id="title"
          name="title"
          required
          defaultValue={text("title", post?.title ?? "")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" name="category">
          <input
            id="category"
            name="category"
            list="blog-categories"
            defaultValue={text("category", post?.category ?? "")}
            className={inputClass}
          />
          <datalist id="blog-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Author" name="author">
          <input
            id="author"
            name="author"
            defaultValue={text("author", post?.author ?? "")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Tags" name="tags" hint="Separate with commas, e.g. safari, packing, rwanda">
        <input
          id="tags"
          name="tags"
          defaultValue={text("tags", post?.tags.join(", ") ?? "")}
          className={inputClass}
        />
      </Field>

      <Field
        label="Article"
        name="content"
        error={errors.content}
        hint="Blank line = new paragraph. Start a line with “## ” for a heading, “### ” for a smaller heading, or “- ” for a bullet list."
      >
        <textarea
          id="content"
          name="content"
          rows={16}
          required
          defaultValue={text("content", post?.content ?? "")}
          className={`${inputClass} font-mono`}
        />
      </Field>

      <fieldset className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <legend className="px-1 text-sm font-medium text-zinc-700">Featured photo</legend>
        <Field
          label="Photo"
          name="featuredImageFile"
          hint="JPG, PNG or WebP, up to 5 MB. Uploading replaces the current photo."
        >
          <ImagePicker
            id="featuredImageFile"
            name="featuredImageFile"
            currentUrl={resolveImageUrl(post?.featuredImage)}
          />
        </Field>
        <Field label="…or photo link" name="featuredImage" hint="Only used if you don't upload a file.">
          <input
            id="featuredImage"
            name="featuredImage"
            defaultValue={text("featuredImage", post?.featuredImage ?? "")}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : post ? "Save changes" : "Publish article"}
        </button>
        <Link
          href="/admin/blog"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

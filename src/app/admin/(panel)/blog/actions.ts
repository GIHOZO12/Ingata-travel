"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { uploadImages } from "@/lib/admin-uploads";
import { fieldErrorsFrom, type FormState } from "@/lib/form";

function refreshPages() {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

// Used for BOTH creating (id === null) and editing.
export async function saveBlogPost(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    title: get("title"),
    category: get("category"),
    author: get("author"),
    tags: get("tags"),
    content: get("content"),
    featuredImage: get("featuredImage"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.title) fieldErrors.title = "Title is required.";
  if (!values.content) fieldErrors.content = "The article text is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    const [uploaded] = await uploadImages([formData.get("featuredImageFile")!]);

    await adminFetch(id === null ? "/blog" : `/blog/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: JSON.stringify({
        title: values.title,
        category: values.category,
        author: values.author,
        // "safari, tips, packing" -> ["safari", "tips", "packing"]
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim().replace(/^#/, ""))
          .filter(Boolean),
        content: values.content,
        featuredImage: uploaded ?? values.featuredImage,
      }),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  refreshPages();
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid article.");

  await adminFetch(`/blog/${id}`, { method: "DELETE" });
  refreshPages();
}

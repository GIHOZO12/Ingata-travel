"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { uploadImages } from "@/lib/admin-uploads";
import { fieldErrorsFrom, type FormState } from "@/lib/form";

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

// Used for BOTH creating (id === null) and editing.
export async function saveTestimonial(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    customerName: get("customerName"),
    country: get("country"),
    category: get("category"),
    content: get("content"),
    photo: get("photo"),
    isApproved: formData.get("isApproved") === "on",
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.customerName) fieldErrors.customerName = "Customer name is required.";
  if (!values.content) fieldErrors.content = "The testimonial text is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    const [uploadedPhoto] = await uploadImages([formData.get("photoFile")!]);

    await adminFetch(id === null ? "/testimonials" : `/testimonials/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: JSON.stringify({
        customerName: values.customerName,
        country: values.country,
        category: values.category,
        content: values.content,
        photo: uploadedPhoto ?? values.photo,
        isApproved: values.isApproved,
      }),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  refreshPages();
  redirect("/admin/testimonials");
}

export async function toggleApproved(formData: FormData) {
  const id = Number(formData.get("id"));
  const isApproved = formData.get("isApproved") === "true";
  if (!Number.isInteger(id)) throw new Error("Invalid testimonial.");

  await adminFetch(`/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isApproved }),
  });
  refreshPages();
}

export async function deleteTestimonial(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid testimonial.");

  await adminFetch(`/testimonials/${id}`, { method: "DELETE" });
  refreshPages();
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { fieldErrorsFrom, type FormState } from "@/lib/form";

function refreshPages() {
  revalidatePath("/faqs");
  revalidatePath("/admin/faqs");
}

// Used for BOTH creating (id === null) and editing.
export async function saveFaq(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    question: get("question"),
    answer: get("answer"),
    order: get("order") || "0",
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.question) fieldErrors.question = "Question is required.";
  if (!values.answer) fieldErrors.answer = "Answer is required.";
  if (!Number.isInteger(Number(values.order))) {
    fieldErrors.order = "Enter a whole number.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    await adminFetch(id === null ? "/faqs" : `/faqs/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: JSON.stringify({
        question: values.question,
        answer: values.answer,
        order: Number(values.order),
      }),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  refreshPages();
  redirect("/admin/faqs");
}

export async function deleteFaq(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid FAQ.");

  await adminFetch(`/faqs/${id}`, { method: "DELETE" });
  refreshPages();
}

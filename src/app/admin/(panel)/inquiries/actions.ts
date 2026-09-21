"use server";

import { revalidatePath } from "next/cache";
import { adminFetch } from "@/lib/admin-api";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/lib/types";

export async function updateInquiryStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  // Never trust form data: check it before sending it on.
  if (!Number.isInteger(id) || !INQUIRY_STATUSES.includes(status as InquiryStatus)) {
    throw new Error("Invalid inquiry update.");
  }

  await adminFetch(`/inquiries/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid inquiry.");

  await adminFetch(`/inquiries/${id}`, { method: "DELETE" });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

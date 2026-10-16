"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { ADMIN_ROLES, type AdminRole } from "@/lib/types";
import { fieldErrorsFrom, type FormState } from "@/lib/form";

// No password field: the backend generates the account with a placeholder
// nobody knows and emails the new person a "set your own password" link.
export async function createStaff(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    role: String(formData.get("role") ?? "STAFF"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = "Name is required.";
  if (!values.email) fieldErrors.email = "Email is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    await adminFetch("/auth/admins", {
      method: "POST",
      body: JSON.stringify(values),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

// Promote/demote — one button per row on the Staff list, not a form field,
// so there's no separate "edit" page for this.
export async function changeRole(formData: FormData) {
  const id = Number(formData.get("id"));
  const role = String(formData.get("role"));

  if (!Number.isInteger(id) || !ADMIN_ROLES.includes(role as AdminRole)) {
    throw new Error("Invalid role change.");
  }

  await adminFetch(`/auth/admins/${id}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });

  revalidatePath("/admin/staff");
}

// For an account that hasn't followed its invite link yet — generates a
// fresh link (the old one stops working) and re-sends the email.
export async function resendInvite(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid account.");

  await adminFetch(`/auth/admins/${id}/resend-invite`, { method: "POST" });

  revalidatePath("/admin/staff");
}

export async function deleteStaff(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid account.");

  await adminFetch(`/auth/admins/${id}`, { method: "DELETE" });

  revalidatePath("/admin/staff");
}

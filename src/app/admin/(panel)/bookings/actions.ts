"use server";

import { revalidatePath } from "next/cache";
import { adminFetch } from "@/lib/admin-api";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/types";

export async function updateBookingStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  // Never trust form data: check it before sending it on.
  if (!Number.isInteger(id) || !BOOKING_STATUSES.includes(status as BookingStatus)) {
    throw new Error("Invalid booking update.");
  }

  await adminFetch(`/booking-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  // Tell Next.js these pages have stale data so they re-fetch.
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteBooking(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid booking.");

  await adminFetch(`/booking-requests/${id}`, { method: "DELETE" });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { uploadImages } from "@/lib/admin-uploads";
import { fieldErrorsFrom, lines, type FormState } from "@/lib/form";

// The public site's pages show destination data, so refresh them after changes.
function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/destinations");
  revalidatePath("/tours");
  revalidatePath("/admin/destinations");
  revalidatePath("/admin");
}

// Used for BOTH creating (id === null) and editing. `id` is pre-filled with
// .bind() in the page, so useActionState only sees (prevState, formData).
export async function saveDestination(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    overview: String(formData.get("overview") ?? "").trim(),
    attractions: String(formData.get("attractions") ?? ""),
    activities: String(formData.get("activities") ?? ""),
    bestTimeToVisit: String(formData.get("bestTimeToVisit") ?? "").trim(),
    heroImage: String(formData.get("heroImage") ?? "").trim(),
    images: String(formData.get("images") ?? ""),
    isFeatured: formData.get("isFeatured") === "on",
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = "Name is required.";
  if (!values.country) fieldErrors.country = "Country is required.";
  if (!values.overview) fieldErrors.overview = "Overview is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    // Files first: an uploaded hero image wins over a pasted URL.
    const [uploadedHero] = await uploadImages([formData.get("heroImageFile")!]);
    const uploadedGallery = await uploadImages(formData.getAll("imageFiles"));

    await adminFetch(id === null ? "/destinations" : `/destinations/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: JSON.stringify({
        name: values.name,
        country: values.country,
        overview: values.overview,
        attractions: lines(values.attractions),
        activities: lines(values.activities),
        bestTimeToVisit: values.bestTimeToVisit,
        heroImage: uploadedHero ?? values.heroImage,
        images: [...lines(values.images), ...uploadedGallery],
        isFeatured: values.isFeatured,
      }),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  refreshPublicPages();
  redirect("/admin/destinations"); // redirect() must be outside try/catch
}

export async function deleteDestination(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid destination.");

  let message: string | null = null;
  try {
    await adminFetch(`/destinations/${id}`, { method: "DELETE" });
  } catch (error) {
    // e.g. 409: the destination still has tours attached.
    if (error instanceof AdminApiError) message = error.message;
    else throw error;
  }

  refreshPublicPages();
  if (message) redirect(`/admin/destinations?error=${encodeURIComponent(message)}`);
}

export async function toggleFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const isFeatured = formData.get("isFeatured") === "true";
  if (!Number.isInteger(id)) throw new Error("Invalid destination.");

  await adminFetch(`/destinations/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isFeatured }),
  });

  refreshPublicPages();
}

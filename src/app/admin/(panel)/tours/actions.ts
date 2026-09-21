"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { uploadImages } from "@/lib/admin-uploads";
import { fieldErrorsFrom, lines, type FormState } from "@/lib/form";

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/book");
  revalidatePath("/plan-your-trip");
  revalidatePath("/destinations");
  revalidatePath("/admin/tours");
}

// One line per day: "Title | activity one; activity two"
// Day numbers come from the line order (1, 2, 3, ...).
function parseItinerary(text: string) {
  return lines(text)
    .map((line, index) => {
      const [title, rest = ""] = line.split("|");
      return {
        dayNumber: index + 1,
        title: title.trim(),
        activities: rest
          .split(";")
          .map((activity) => activity.trim())
          .filter(Boolean),
      };
    })
    .filter((day) => day.title);
}

// Used for BOTH creating (id === null) and editing (id = the tour's id).
export async function saveTour(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const text = (key: string) => String(formData.get(key) ?? "").trim();

  const values = {
    name: text("name"),
    destinationId: text("destinationId"),
    category: text("category"),
    durationDays: text("durationDays"),
    durationNights: text("durationNights"),
    startingPrice: text("startingPrice"),
    currency: text("currency").toUpperCase() || "USD",
    overview: text("overview"),
    highlights: String(formData.get("highlights") ?? ""),
    inclusions: String(formData.get("inclusions") ?? ""),
    exclusions: String(formData.get("exclusions") ?? ""),
    requirements: String(formData.get("requirements") ?? ""),
    itinerary: String(formData.get("itinerary") ?? ""),
    featuredImage: text("featuredImage"),
    images: String(formData.get("images") ?? ""),
    isFeatured: formData.get("isFeatured") === "on",
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = "Name is required.";
  if (!values.destinationId) fieldErrors.destinationId = "Choose a destination.";
  if (!values.category) fieldErrors.category = "Category is required.";
  if (!values.overview) fieldErrors.overview = "Overview is required.";
  if (!(Number(values.durationDays) >= 1))
    fieldErrors.durationDays = "Enter the number of days (1 or more).";
  if (!(Number(values.durationNights) >= 1))
    fieldErrors.durationNights = "Enter the number of nights (1 or more).";
  if (values.startingPrice && !(Number(values.startingPrice) >= 0))
    fieldErrors.startingPrice = "Enter a valid price, e.g. 1200.";
  if (!/^[A-Z]{3}$/.test(values.currency))
    fieldErrors.currency = "Use a 3-letter code such as USD.";
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  try {
    const [uploadedFeatured] = await uploadImages([
      formData.get("featuredImageFile")!,
    ]);
    const uploadedGallery = await uploadImages(formData.getAll("imageFiles"));

    await adminFetch(id === null ? "/tours" : `/tours/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: JSON.stringify({
        name: values.name,
        destinationId: Number(values.destinationId),
        category: values.category,
        durationDays: Number(values.durationDays),
        durationNights: Number(values.durationNights),
        // Only send a price when one was typed (the API can't store "empty").
        ...(values.startingPrice ? { startingPrice: values.startingPrice } : {}),
        currency: values.currency,
        overview: values.overview,
        highlights: lines(values.highlights),
        inclusions: lines(values.inclusions),
        exclusions: lines(values.exclusions),
        requirements: lines(values.requirements),
        featuredImage: uploadedFeatured ?? values.featuredImage,
        images: [...lines(values.images), ...uploadedGallery],
        isFeatured: values.isFeatured,
        // The API only reads the itinerary when CREATING a tour.
        ...(id === null ? { itineraryDays: parseItinerary(values.itinerary) } : {}),
      }),
    });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return { error: error.message, fieldErrors: fieldErrorsFrom(error), values };
    }
    throw error;
  }

  refreshPublicPages();
  redirect("/admin/tours");
}

export async function deleteTour(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid tour.");

  let message: string | null = null;
  try {
    await adminFetch(`/tours/${id}`, { method: "DELETE" });
  } catch (error) {
    // e.g. 409: booking requests still reference this tour.
    if (error instanceof AdminApiError) message = error.message;
    else throw error;
  }

  refreshPublicPages();
  if (message) redirect(`/admin/tours?error=${encodeURIComponent(message)}`);
}

export async function toggleTourFeatured(formData: FormData) {
  const id = Number(formData.get("id"));
  const isFeatured = formData.get("isFeatured") === "true";
  if (!Number.isInteger(id)) throw new Error("Invalid tour.");

  await adminFetch(`/tours/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isFeatured }),
  });

  refreshPublicPages();
}

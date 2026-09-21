"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Destination, TourDetail } from "@/lib/types";
import type { FormState } from "@/lib/form";
import { resolveImageUrl } from "@/lib/images";
import Field, { inputClass } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";

const CATEGORIES = [
  "Wildlife Safari",
  "Gorilla Trekking",
  "Cultural Tour",
  "City Tour",
  "Adventure Tour",
  "Beach Holiday",
  "Honeymoon",
  "Family Holiday",
  "Photography Tour",
  "Customized Tour",
];

export default function TourForm({
  action,
  destinations,
  tour,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  destinations: Destination[];
  tour?: TourDetail;
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tour name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            required
            defaultValue={text("name", tour?.name ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Destination" name="destinationId" error={errors.destinationId}>
          <select
            id="destinationId"
            name="destinationId"
            required
            defaultValue={text("destinationId", tour ? String(tour.destinationId) : "")}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a destination…
            </option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.country})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Field
            label="Category"
            name="category"
            error={errors.category}
            hint="Pick a suggestion or type your own."
          >
            <input
              id="category"
              name="category"
              list="tour-categories"
              required
              defaultValue={text("category", tour?.category ?? "")}
              className={inputClass}
            />
            <datalist id="tour-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="Days" name="durationDays" error={errors.durationDays}>
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            required
            defaultValue={text("durationDays", tour ? String(tour.durationDays) : "")}
            className={inputClass}
          />
        </Field>
        <Field label="Nights" name="durationNights" error={errors.durationNights}>
          <input
            id="durationNights"
            name="durationNights"
            type="number"
            min={1}
            required
            defaultValue={text("durationNights", tour ? String(tour.durationNights) : "")}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <Field
            label="Starting price (per person)"
            name="startingPrice"
            error={errors.startingPrice}
            hint="Leave empty to show “Contact us for a quote”."
          >
            <input
              id="startingPrice"
              name="startingPrice"
              inputMode="decimal"
              defaultValue={text("startingPrice", tour?.startingPrice ?? "")}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Currency" name="currency" error={errors.currency}>
          <input
            id="currency"
            name="currency"
            maxLength={3}
            defaultValue={text("currency", tour?.currency ?? "USD")}
            className={`${inputClass} uppercase`}
          />
        </Field>
      </div>

      <Field label="Overview" name="overview" error={errors.overview}>
        <textarea
          id="overview"
          name="overview"
          rows={4}
          required
          defaultValue={text("overview", tour?.overview ?? "")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Highlights" name="highlights" hint="One per line.">
          <textarea
            id="highlights"
            name="highlights"
            rows={4}
            defaultValue={text("highlights", tour?.highlights.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Requirements" name="requirements" hint="One per line.">
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            defaultValue={text("requirements", tour?.requirements.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="What's included" name="inclusions" hint="One per line.">
          <textarea
            id="inclusions"
            name="inclusions"
            rows={4}
            defaultValue={text("inclusions", tour?.inclusions.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="What's not included" name="exclusions" hint="One per line.">
          <textarea
            id="exclusions"
            name="exclusions"
            rows={4}
            defaultValue={text("exclusions", tour?.exclusions.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
      </div>

      {tour ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-700">Itinerary</p>
          <p className="mt-1 text-xs text-zinc-500">
            The API can’t edit an existing itinerary yet. To change it, delete
            the tour and create it again.
          </p>
          <ol className="mt-3 space-y-1 text-sm text-zinc-700">
            {tour.itineraryDays.map((day) => (
              <li key={day.id}>
                <span className="font-medium">Day {day.dayNumber}:</span> {day.title}
                {day.activities.length > 0 && (
                  <span className="text-zinc-500"> — {day.activities.join(", ")}</span>
                )}
              </li>
            ))}
            {tour.itineraryDays.length === 0 && (
              <li className="text-zinc-500">No itinerary saved.</li>
            )}
          </ol>
        </div>
      ) : (
        <Field
          label="Itinerary"
          name="itinerary"
          hint="One line per day, in order: Title | activity; activity; activity"
        >
          <textarea
            id="itinerary"
            name="itinerary"
            rows={6}
            placeholder={
              "Arrival & Kigali city tour | Airport pickup; Hotel check-in; City tour\nGorilla trekking | Breakfast; Trek in Volcanoes National Park; Return to lodge"
            }
            defaultValue={text("itinerary", "")}
            className={inputClass}
          />
        </Field>
      )}

      <fieldset className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <legend className="px-1 text-sm font-medium text-zinc-700">Photos</legend>

        <Field
          label="Main photo"
          name="featuredImageFile"
          hint="JPG, PNG or WebP, up to 5 MB. Uploading replaces the current photo."
        >
          <ImagePicker
            id="featuredImageFile"
            name="featuredImageFile"
            currentUrl={resolveImageUrl(tour?.featuredImage)}
          />
        </Field>
        <Field
          label="…or main photo link"
          name="featuredImage"
          hint="Only used if you don't upload a file."
        >
          <input
            id="featuredImage"
            name="featuredImage"
            defaultValue={text("featuredImage", tour?.featuredImage ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Add gallery photos" name="imageFiles" hint="You can choose several at once.">
          <ImagePicker id="imageFiles" name="imageFiles" multiple />
        </Field>
        <Field
          label="Gallery photo links"
          name="images"
          hint="One per line. Delete a line to remove that photo."
        >
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={text("images", tour?.images.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={
            typeof state?.values?.isFeatured === "boolean"
              ? state.values.isFeatured
              : (tour?.isFeatured ?? false)
          }
          className="h-4 w-4"
        />
        Feature on the homepage
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : tour ? "Save changes" : "Add tour"}
        </button>
        <Link
          href="/admin/tours"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

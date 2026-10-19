"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Destination } from "@/lib/types";
import type { FormState } from "@/lib/form";
import { resolveImageUrl } from "@/lib/images";
import Field, { inputClass } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";

// Reused for "add" and "edit". `action` is the Server Action with the id
// already bound; `destination` is only passed when editing.
export default function DestinationForm({
  action,
  destination,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  destination?: Destination;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  // After a failed submit, show what the admin typed; otherwise the saved values.
  const text = (key: string, saved: string) =>
    typeof state?.values?.[key] === "string"
      ? (state.values[key] as string)
      : saved;
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            required
            defaultValue={text("name", destination?.name ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Country" name="country" error={errors.country}>
          <input
            id="country"
            name="country"
            required
            defaultValue={text("country", destination?.country ?? "")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Overview" name="overview" error={errors.overview}>
        <textarea
          id="overview"
          name="overview"
          rows={4}
          required
          defaultValue={text("overview", destination?.overview ?? "")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Key attractions"
          name="attractions"
          hint="One per line."
          error={errors.attractions}
        >
          <textarea
            id="attractions"
            name="attractions"
            rows={4}
            defaultValue={text("attractions", destination?.attractions.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
        <Field
          label="Popular activities"
          name="activities"
          hint="One per line."
          error={errors.activities}
        >
          <textarea
            id="activities"
            name="activities"
            rows={4}
            defaultValue={text("activities", destination?.activities.join("\n") ?? "")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Best time to visit" name="bestTimeToVisit">
        <input
          id="bestTimeToVisit"
          name="bestTimeToVisit"
          defaultValue={text("bestTimeToVisit", destination?.bestTimeToVisit ?? "")}
          className={inputClass}
        />
      </Field>

      <fieldset className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <legend className="px-1 text-sm font-medium text-zinc-700">Photos</legend>

        <Field
          label="Main photo"
          name="heroImageFile"
          hint="JPG, PNG or WebP, up to 5 MB. Uploading replaces the current photo."
        >
          <ImagePicker
            id="heroImageFile"
            name="heroImageFile"
            currentUrl={resolveImageUrl(destination?.heroImage)}
          />
        </Field>

        <Field
          label="…or main photo link"
          name="heroImage"
          hint="Only used if you don't upload a file."
        >
          <input
            id="heroImage"
            name="heroImage"
            defaultValue={text("heroImage", destination?.heroImage ?? "")}
            className={inputClass}
          />
        </Field>

        <Field
          label="Add gallery photos"
          name="imageFiles"
          hint="You can choose several at once."
        >
          <ImagePicker id="imageFiles" name="imageFiles" multiple />
        </Field>

        <Field
          label="Gallery photo links"
          name="images"
          hint="One per line (or separated by commas). Delete a link to remove that photo."
        >
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={text("images", destination?.images.join("\n") ?? "")}
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
              : (destination?.isFeatured ?? false)
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
          {pending ? "Saving…" : destination ? "Save changes" : "Add destination"}
        </button>
        <Link
          href="/admin/destinations"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

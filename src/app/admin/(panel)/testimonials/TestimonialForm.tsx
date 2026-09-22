"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Testimonial } from "@/lib/types";
import type { FormState } from "@/lib/form";
import { resolveImageUrl } from "@/lib/images";
import Field, { inputClass } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";

const CATEGORIES = ["Family", "Honeymoon", "Corporate", "Solo traveler", "Group", "Adventure"];

export default function TestimonialForm({
  action,
  testimonial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  testimonial?: Testimonial;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

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

      <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Only add real feedback from real customers, with their permission
        (especially for photos). Fabricated reviews are not allowed.
      </p>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Customer name" name="customerName" error={errors.customerName}>
          <input
            id="customerName"
            name="customerName"
            required
            defaultValue={text("customerName", testimonial?.customerName ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Country" name="country">
          <input
            id="country"
            name="country"
            defaultValue={text("country", testimonial?.country ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Traveler type" name="category">
          <input
            id="category"
            name="category"
            list="testimonial-categories"
            defaultValue={text("category", testimonial?.category ?? "")}
            className={inputClass}
          />
          <datalist id="testimonial-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Testimonial" name="content" error={errors.content}>
        <textarea
          id="content"
          name="content"
          rows={5}
          required
          defaultValue={text("content", testimonial?.content ?? "")}
          className={inputClass}
        />
      </Field>

      <Field
        label="Photo (optional)"
        name="photoFile"
        hint="Only with the customer's permission. Uploading replaces the current photo."
      >
        <ImagePicker
          id="photoFile"
          name="photoFile"
          currentUrl={resolveImageUrl(testimonial?.photo)}
        />
      </Field>
      <Field label="…or photo link" name="photo" hint="Only used if you don't upload a file.">
        <input
          id="photo"
          name="photo"
          defaultValue={text("photo", testimonial?.photo ?? "")}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="isApproved"
          defaultChecked={
            typeof state?.values?.isApproved === "boolean"
              ? state.values.isApproved
              : (testimonial?.isApproved ?? false)
          }
          className="h-4 w-4"
        />
        Approved: show on the website
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : testimonial ? "Save changes" : "Add testimonial"}
        </button>
        <Link
          href="/admin/testimonials"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

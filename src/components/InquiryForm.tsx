"use client";

import { useActionState } from "react";
import Link from "next/link";
import Field, { inputClass } from "@/components/FormField";
import { submitInquiry } from "@/app/(site)/contact/actions";

// Used on /contact (simple version) and /plan-your-trip (with trip details).
export default function InquiryForm({
  tours = [],
  showTripFields = false,
  messageLabel = "How can we help?",
  minDate,
}: {
  tours?: { id: number; name: string }[];
  showTripFields?: boolean;
  messageLabel?: string;
  minDate?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, undefined);

  // Success message (SRS §36)
  if (state?.success) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-semibold text-emerald-900">Thank you</h2>
        <p className="mx-auto mt-3 max-w-md text-emerald-800">
          Your travel inquiry has been received successfully. A member of our
          team will review your request and contact you using the information
          you provided.
        </p>
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Browse our tours
        </Link>
      </div>
    );
  }

  const value = (key: string) => state?.values?.[key] ?? "";
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            defaultValue={value("fullName")}
            className={inputClass}
          />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={value("email")}
            className={inputClass}
          />
        </Field>
        <Field label="Phone / WhatsApp" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={value("phone")}
            className={inputClass}
          />
        </Field>

        {showTripFields && (
          <Field label="Where would you like to go?" name="destinationName" error={errors.destinationName}>
            <input
              id="destinationName"
              name="destinationName"
              placeholder="e.g. Rwanda, Uganda, Zanzibar…"
              defaultValue={value("destinationName")}
              className={inputClass}
            />
          </Field>
        )}
      </div>

      {showTripFields && (
        <>
          {tours.length > 0 && (
            <Field label="Tour you’re interested in (optional)" name="tourId" error={errors.tourId}>
              <select
                id="tourId"
                name="tourId"
                defaultValue={value("tourId")}
                className={inputClass}
              >
                <option value="">Not sure yet</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Preferred travel date" name="preferredDate" error={errors.preferredDate}>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                min={minDate}
                defaultValue={value("preferredDate")}
                className={inputClass}
              />
            </Field>
            <Field label="Number of travelers" name="numberOfTravelers" error={errors.numberOfTravelers}>
              <input
                id="numberOfTravelers"
                name="numberOfTravelers"
                type="number"
                min={1}
                max={50}
                defaultValue={value("numberOfTravelers")}
                className={inputClass}
              />
            </Field>
          </div>
        </>
      )}

      <Field label={messageLabel} name="message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          required
          defaultValue={value("message")}
          className={inputClass}
        />
      </Field>

      {/* Honeypot for spam bots: hidden from people, but bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

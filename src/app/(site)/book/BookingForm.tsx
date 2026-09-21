"use client";

import { useActionState } from "react";
import Link from "next/link";
import Field, { inputClass } from "@/components/FormField";
import { submitBooking } from "./actions";

export default function BookingForm({
  tours,
  defaultTourId,
  minDate,
}: {
  tours: { id: number; name: string }[];
  defaultTourId?: number;
  minDate: string;
}) {
  const [state, action, pending] = useActionState(submitBooking, undefined);

  // Success message (SRS §36)
  if (state?.success) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-semibold text-emerald-900">Thank you</h2>
        <p className="mx-auto mt-3 max-w-md text-emerald-800">
          Your booking request has been received successfully. A member of our
          team will review your request and contact you using the information
          you provided to confirm availability.
        </p>
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Browse more tours
        </Link>
      </div>
    );
  }

  const value = (key: string, fallback = "") => state?.values?.[key] ?? fallback;
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field label="Tour" name="tourId" required error={errors.tourId}>
        <select
          id="tourId"
          name="tourId"
          required
          defaultValue={value("tourId", defaultTourId ? String(defaultTourId) : "")}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a tour…
          </option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.name}
            </option>
          ))}
        </select>
      </Field>

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
        <Field label="Nationality" name="nationality" error={errors.nationality}>
          <input
            id="nationality"
            name="nationality"
            defaultValue={value("nationality")}
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
        <Field label="Phone / WhatsApp" name="phone" required error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            defaultValue={value("phone")}
            className={inputClass}
          />
        </Field>
        <Field label="Travel date" name="travelDate" required error={errors.travelDate}>
          <input
            id="travelDate"
            name="travelDate"
            type="date"
            min={minDate}
            required
            defaultValue={value("travelDate")}
            className={inputClass}
          />
        </Field>
        <Field
          label="Number of travelers"
          name="numberOfTravelers"
          required
          error={errors.numberOfTravelers}
        >
          <input
            id="numberOfTravelers"
            name="numberOfTravelers"
            type="number"
            min={1}
            max={50}
            required
            defaultValue={value("numberOfTravelers", "2")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Accommodation preference" name="accommodationPref" error={errors.accommodationPref}>
        <select
          id="accommodationPref"
          name="accommodationPref"
          defaultValue={value("accommodationPref")}
          className={inputClass}
        >
          <option value="">No preference</option>
          <option value="Budget">Budget</option>
          <option value="Mid-range">Mid-range</option>
          <option value="Luxury">Luxury</option>
        </select>
      </Field>

      <Field
        label="Special requests (dietary needs, celebrations, accessibility…)"
        name="specialRequests"
        error={errors.specialRequests}
      >
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={4}
          maxLength={2000}
          defaultValue={value("specialRequests")}
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
        {pending ? "Sending…" : "Send booking request"}
      </button>
      <p className="text-center text-xs text-zinc-500">
        This is a request, not a payment. We’ll contact you to confirm
        availability, the quotation and payment details.
      </p>
    </form>
  );
}

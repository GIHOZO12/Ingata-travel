"use server";

export type InquiryState =
  | {
      success?: boolean;
      error?: string;
      fieldErrors?: Record<string, string>;
      values?: Record<string, string>;
    }
  | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s\-()]{5,}$/;

// PUBLIC action for the contact form and the "plan your trip" form (SRS §34).
// Validates everything itself, then forwards to POST /api/inquiries.
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: hidden from people, filled in by bots.
  if (String(formData.get("website") ?? "").trim()) {
    return { success: true };
  }

  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    fullName: get("fullName"),
    email: get("email"),
    phone: get("phone"),
    tourId: get("tourId"),
    destinationName: get("destinationName"),
    preferredDate: get("preferredDate"),
    numberOfTravelers: get("numberOfTravelers"),
    message: get("message"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.fullName) fieldErrors.fullName = "Please complete this field.";
  if (!EMAIL.test(values.email)) fieldErrors.email = "Please enter a valid email address.";
  if (values.phone && !PHONE.test(values.phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  if (!values.message) fieldErrors.message = "Please tell us how we can help.";
  if (values.message.length > 2000) {
    fieldErrors.message = "Please keep your message under 2000 characters.";
  }
  if (values.preferredDate) {
    const date = new Date(values.preferredDate);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      fieldErrors.preferredDate = "Please select a valid date in the future.";
    }
  }
  if (values.numberOfTravelers) {
    const travelers = Number(values.numberOfTravelers);
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
      fieldErrors.numberOfTravelers = "Enter a number of travelers from 1 to 50.";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      // The API rejects empty strings for dates/numbers, so optional fields
      // are only sent when they were filled in.
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        message: values.message,
        ...(values.phone && { phone: values.phone }),
        ...(values.tourId && { tourId: Number(values.tourId) }),
        ...(values.destinationName && { destinationName: values.destinationName }),
        ...(values.preferredDate && { preferredDate: values.preferredDate }),
        ...(values.numberOfTravelers && {
          numberOfTravelers: Number(values.numberOfTravelers),
        }),
      }),
    });
  } catch {
    return {
      error:
        "We were unable to process your request. Please try again or contact our support team.",
      values,
    };
  }

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const apiFieldErrors: Record<string, string> = {};
    for (const detail of json?.details ?? []) {
      if (detail.path && detail.msg) apiFieldErrors[detail.path] = detail.msg;
    }
    return {
      error:
        res.status === 400
          ? "Please check the highlighted fields and try again."
          : "We were unable to process your request. Please try again or contact our support team.",
      fieldErrors: apiFieldErrors,
      values,
    };
  }

  return { success: true };
}

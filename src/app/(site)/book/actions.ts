"use server";

export type BookingState =
  | {
      success?: boolean;
      error?: string;
      fieldErrors?: Record<string, string>;
      // Sent back so the form keeps what the visitor typed after an error.
      values?: Record<string, string>;
    }
  | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s\-()]{5,}$/;

// A PUBLIC action: any visitor can call it, so it validates everything itself
// (never trust the browser) and then forwards to the API, which validates again.
export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot: real people never see or fill this hidden field, bots do.
  // Pretend it worked so the bot learns nothing.
  if (String(formData.get("website") ?? "").trim()) {
    return { success: true };
  }

  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    tourId: get("tourId"),
    fullName: get("fullName"),
    email: get("email"),
    phone: get("phone"),
    nationality: get("nationality"),
    travelDate: get("travelDate"),
    numberOfTravelers: get("numberOfTravelers"),
    accommodationPref: get("accommodationPref"),
    specialRequests: get("specialRequests"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.tourId) fieldErrors.tourId = "Please choose a tour.";
  if (!values.fullName) fieldErrors.fullName = "Please complete this field.";
  if (!EMAIL.test(values.email)) fieldErrors.email = "Please enter a valid email address.";
  if (!PHONE.test(values.phone)) fieldErrors.phone = "Please enter a valid phone number.";

  const travelDate = new Date(values.travelDate);
  if (Number.isNaN(travelDate.getTime()) || travelDate <= new Date()) {
    fieldErrors.travelDate = "Please select a valid travel date in the future.";
  }

  const travelers = Number(values.numberOfTravelers);
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 50) {
    fieldErrors.numberOfTravelers = "Enter a number of travelers from 1 to 50.";
  }
  if (values.specialRequests.length > 2000) {
    fieldErrors.specialRequests = "Please keep this under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        tourId: Number(values.tourId),
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        travelDate: values.travelDate,
        numberOfTravelers: travelers,
        // Optional fields are only sent when filled in.
        ...(values.nationality && { nationality: values.nationality }),
        ...(values.accommodationPref && { accommodationPref: values.accommodationPref }),
        ...(values.specialRequests && { specialRequests: values.specialRequests }),
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

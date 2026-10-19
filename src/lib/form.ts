import type { AdminApiError } from "@/lib/admin-api";

// Shared by the admin forms (destinations, tours) and their Server Actions.
export type FormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string>;
      // Sent back so the form can keep what the admin typed after an error.
      values?: Record<string, string | boolean>;
    }
  | undefined;

// One item per line in a textarea -> array of strings for the API.
export const lines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// Image links -> array of URLs. Like lines(), but also splits links pasted on
// one line, separated by spaces or commas (a URL never contains a space).
// Commas are only treated as separators right before another http(s) link,
// since some image URLs contain commas themselves (e.g. "w_300,h_200").
export const imageLinks = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(/\s+|,(?=\s*https?:\/\/)/)
    .map((link) => link.trim().replace(/,$/, ""))
    .filter(Boolean);

// Maps the API's validation details onto the matching form fields.
export function fieldErrorsFrom(error: AdminApiError) {
  const result: Record<string, string> = {};
  for (const detail of error.details) {
    if (detail.path && detail.msg) result[detail.path] = detail.msg;
  }
  return result;
}

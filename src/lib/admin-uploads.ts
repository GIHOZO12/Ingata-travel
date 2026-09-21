import { AdminApiError, adminFetch } from "@/lib/admin-api";

const MAX_SIZE = 5 * 1024 * 1024; // matches the backend limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Sends each chosen file to the API's POST /uploads and returns the saved
// paths (e.g. "/uploads/abc.jpg"). Empty file inputs (no file chosen) are
// skipped. Checks happen here first so the admin gets a clear message.
export async function uploadImages(
  entries: FormDataEntryValue[],
): Promise<string[]> {
  const urls: string[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File) || entry.size === 0) continue;

    if (!ALLOWED_TYPES.includes(entry.type)) {
      throw new AdminApiError(400, `"${entry.name}" is not a JPG, PNG or WebP image.`);
    }
    if (entry.size > MAX_SIZE) {
      throw new AdminApiError(400, `"${entry.name}" is larger than 5 MB.`);
    }

    const body = new FormData();
    body.append("file", entry);
    const { url } = await adminFetch<{ url: string }>("/uploads", {
      method: "POST",
      body,
    });
    urls.push(url);
  }

  return urls;
}

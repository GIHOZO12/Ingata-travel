// Uploaded images are stored in the database as a path like
// "/uploads/abc.jpg" (so the data isn't tied to one server address). This turns
// that path into a full URL pointing at the API server. Links pasted from other
// websites (https://...) are returned unchanged.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");

export function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null;
  return src.startsWith("/uploads/") ? `${API_ORIGIN}${src}` : src;
}

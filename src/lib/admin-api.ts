import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";
import type { AdminUser, ApiResponse } from "@/lib/types";
import { cache } from "react";
import { API_TIMEOUT_MS } from "@/lib/api-timeout";

// Error type so Server Actions can show the backend's message to the admin.
export class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string,
    // express-validator details: [{ path: "name", msg: "Destination name is required" }]
    public details: { path?: string; msg?: string }[] = [],
  ) {
    super(message);
  }
}

// Calls the Express API with the admin's token attached. Server-side only.
export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  if (!token) redirect("/admin/login");

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...init,
      cache: "no-store", // admin data must always be fresh
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      headers: {
        // JSON bodies get a JSON content type. For file uploads (FormData) we
        // must NOT set it: fetch adds the multipart boundary itself.
        ...(typeof init.body === "string"
          ? { "Content-Type": "application/json" }
          : {}),
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    });
  } catch {
    throw new AdminApiError(
      503,
      "Cannot reach the API. Is the backend running on port 5000?",
    );
  }

  // Expired or invalid token -> back to the login page.
  if (res.status === 401) redirect("/admin/login");

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AdminApiError(
      res.status,
      json?.message ?? `Request failed (${res.status})`,
      json?.details ?? [],
    );
  }
  return (json as ApiResponse<T>).data;
}

// Confirms the token is real by asking the backend who we are. Call this in
// every admin layout/page: the proxy only checks that a cookie EXISTS, not
// that it is valid. cache() means it runs once per request even if called often.
export const verifyAdmin = cache(() => adminFetch<AdminUser>("/auth/me"));

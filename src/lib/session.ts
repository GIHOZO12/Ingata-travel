import { cookies } from "next/headers";

// The admin's login token (a JWT issued by the Express API) lives in an
// httpOnly cookie: browser JavaScript can't read it, so an XSS bug can't steal
// it. Only server code (Server Components / Server Actions) touches it.
export const SESSION_COOKIE = "admin_token";

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setToken(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // backend JWT_EXPIRES_IN defaults to 7d
  });
}

export async function clearToken() {
  (await cookies()).delete(SESSION_COOKIE);
}

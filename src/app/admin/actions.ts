"use server";

// "use server" marks every exported function here as a Server Action: it runs
// on the server, but forms in the browser can call it directly.

import { redirect } from "next/navigation";
import { clearToken, setToken } from "@/lib/session";
import { API_TIMEOUT_MS } from "@/lib/api-timeout";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // This runs on Vercel's server (a Server Action), so these logs land in
  // Vercel's function logs, not the browser console — check there, not
  // DevTools, when diagnosing a hosted login failure.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(`[admin login] attempting for "${email}" against ${apiUrl}`);

  let res: Response;
  try {
    res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch (error) {
    // Swallowed into a generic message for the visitor, but the real cause
    // (DNS failure, timeout, connection refused, TLS error, ...) is logged
    // here — this previously vanished entirely with no server-side trace.
    console.error(`[admin login] fetch to ${apiUrl} failed:`, error);
    return { error: "Cannot reach the server. Is the backend running?" };
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    console.log(`[admin login] backend rejected "${email}": ${res.status} ${json?.message}`);
    return {
      error:
        res.status === 401
          ? "Invalid email or password."
          : (json?.message ?? "Login failed. Please try again."),
    };
  }

  console.log(`[admin login] succeeded for "${email}"`);

  await setToken(json.data.token);
  redirect("/admin"); // redirect() must be called outside try/catch
}

export async function logout() {
  await clearToken();
  redirect("/admin/login");
}

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

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    return { error: "Cannot reach the server. Is the backend running?" };
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return {
      error:
        res.status === 401
          ? "Invalid email or password."
          : (json?.message ?? "Login failed. Please try again."),
    };
  }

  await setToken(json.data.token);
  redirect("/admin"); // redirect() must be called outside try/catch
}

export async function logout() {
  await clearToken();
  redirect("/admin/login");
}

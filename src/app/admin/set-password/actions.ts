"use server";

import { redirect } from "next/navigation";
import { setToken } from "@/lib/session";
import { API_TIMEOUT_MS } from "@/lib/api-timeout";

export type SetPasswordState = { error?: string } | undefined;

export async function submitSetPassword(
  _prev: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "This link is missing its token. Ask an administrator to resend your invite." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    return { error: "Cannot reach the server. Please try again." };
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: json?.message ?? "This link is invalid or has expired." };
  }

  await setToken(json.data.token);
  redirect("/admin"); // redirect() must be called outside try/catch
}

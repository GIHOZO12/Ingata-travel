import type { Metadata } from "next";
import SetPasswordForm from "./SetPasswordForm";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

// Reached only via the emailed invite link: /admin/set-password?token=...
// Public route — proxy.ts explicitly allows it through without a login.
export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Set your password</h1>
        {token ? (
          <>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a password for your admin account. You&apos;ll be signed in
              right after.
            </p>
            <SetPasswordForm token={token} />
          </>
        ) : (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            This link is missing its token. Use the link from your invite email,
            or ask an administrator to resend it.
          </p>
        )}
      </div>
    </div>
  );
}

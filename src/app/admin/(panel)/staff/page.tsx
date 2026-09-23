import Link from "next/link";
import { adminFetch, verifyAdmin } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/lib/types";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { changeRole, deleteStaff } from "./actions";

export default async function StaffPage() {
  // verifyAdmin() tells us who's currently logged in, so the page can hide
  // "change my own role" / "delete myself" controls on that one row — the
  // backend blocks those anyway, but hiding them avoids a confusing error.
  const [me, accounts] = await Promise.all([
    verifyAdmin(),
    adminFetch<AdminUser[]>("/auth/admins"),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Staff accounts</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administrators have full access. Staff can only manage bookings and
            inquiries.
          </p>
        </div>
        <Link
          href="/admin/staff/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add staff
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-zinc-100 rounded-lg bg-white shadow-sm">
        {accounts.map((account) => {
          const isSelf = account.id === me.id;
          return (
            <li
              key={account.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {account.name}
                  {isSelf && <span className="ml-2 text-xs text-zinc-400">(you)</span>}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      account.role === "ADMIN"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {account.role === "ADMIN" ? "Administrator" : "Staff"}
                  </span>
                </p>
                <p className="text-sm text-zinc-500">{account.email}</p>
                <p className="text-xs text-zinc-400">
                  Added {formatDate(account.createdAt)}
                </p>
              </div>

              {!isSelf && (
                <div className="flex items-center gap-4 text-sm">
                  <form action={changeRole}>
                    <input type="hidden" name="id" value={account.id} />
                    <input
                      type="hidden"
                      name="role"
                      value={account.role === "ADMIN" ? "STAFF" : "ADMIN"}
                    />
                    <button type="submit" className="text-zinc-600 hover:underline">
                      {account.role === "ADMIN" ? "Make staff" : "Make administrator"}
                    </button>
                  </form>
                  <form action={deleteStaff}>
                    <input type="hidden" name="id" value={account.id} />
                    <ConfirmButton
                      message={`Remove ${account.name}'s account? They will no longer be able to sign in.`}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </ConfirmButton>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

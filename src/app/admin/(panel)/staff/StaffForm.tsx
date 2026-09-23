"use client";

import { useActionState } from "react";
import Link from "next/link";
import Field, { inputClass } from "@/components/admin/Field";
import { createStaff } from "./actions";

export default function StaffForm() {
  const [state, formAction, pending] = useActionState(createStaff, undefined);

  const text = (key: string) =>
    typeof state?.values?.[key] === "string" ? (state.values[key] as string) : "";
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-md space-y-5">
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field label="Name" name="name" error={errors.name}>
        <input id="name" name="name" required defaultValue={text("name")} className={inputClass} />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={text("email")}
          className={inputClass}
        />
      </Field>

      <Field
        label="Temporary password"
        name="password"
        error={errors.password}
        hint="At least 8 characters. Share it with them privately — there's no invite email yet."
      >
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </Field>

      <Field label="Role" name="role">
        <select id="role" name="role" defaultValue="STAFF" className={inputClass}>
          <option value="STAFF">Staff — bookings &amp; inquiries only</option>
          <option value="ADMIN">Administrator — full access</option>
        </select>
      </Field>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add account"}
        </button>
        <Link
          href="/admin/staff"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

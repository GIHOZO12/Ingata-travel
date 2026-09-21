"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FAQ } from "@/lib/types";
import type { FormState } from "@/lib/form";
import Field, { inputClass } from "@/components/admin/Field";

export default function FaqForm({
  action,
  faq,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  faq?: FAQ;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const text = (key: string, saved: string) =>
    typeof state?.values?.[key] === "string"
      ? (state.values[key] as string)
      : saved;
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field label="Question" name="question" error={errors.question}>
        <input
          id="question"
          name="question"
          required
          defaultValue={text("question", faq?.question ?? "")}
          className={inputClass}
        />
      </Field>

      <Field label="Answer" name="answer" error={errors.answer}>
        <textarea
          id="answer"
          name="answer"
          rows={6}
          required
          defaultValue={text("answer", faq?.answer ?? "")}
          className={inputClass}
        />
      </Field>

      <div className="max-w-[10rem]">
        <Field
          label="Display order"
          name="order"
          error={errors.order}
          hint="Lower numbers appear first."
        >
          <input
            id="order"
            name="order"
            type="number"
            defaultValue={text("order", String(faq?.order ?? 0))}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : faq ? "Save changes" : "Add FAQ"}
        </button>
        <Link
          href="/admin/faqs"
          className="rounded-md px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

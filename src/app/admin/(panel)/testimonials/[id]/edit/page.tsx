import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";
import type { Testimonial } from "@/lib/types";
import TestimonialForm from "../../TestimonialForm";
import { saveTestimonial } from "../../actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const all = await adminFetch<Testimonial[]>("/testimonials/all");
  const testimonial = all.find((t) => t.id === Number(id));

  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit testimonial</h1>
      <TestimonialForm
        action={saveTestimonial.bind(null, testimonial.id)}
        testimonial={testimonial}
      />
    </div>
  );
}

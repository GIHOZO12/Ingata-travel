import TestimonialForm from "../TestimonialForm";
import { saveTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Add testimonial</h1>
      <TestimonialForm action={saveTestimonial.bind(null, null)} />
    </div>
  );
}

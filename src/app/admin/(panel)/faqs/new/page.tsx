import FaqForm from "../FaqForm";
import { saveFaq } from "../actions";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Add FAQ</h1>
      <FaqForm action={saveFaq.bind(null, null)} />
    </div>
  );
}

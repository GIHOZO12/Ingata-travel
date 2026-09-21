import { notFound } from "next/navigation";
import { getFAQs } from "@/lib/api";
import FaqForm from "../../FaqForm";
import { saveFaq } from "../../actions";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faqs = await getFAQs();
  const faq = faqs.find((f) => f.id === Number(id));

  if (!faq) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit FAQ</h1>
      <FaqForm action={saveFaq.bind(null, faq.id)} faq={faq} />
    </div>
  );
}

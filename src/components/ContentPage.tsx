// Shared wrapper for text pages (legal, travel info): consistent width, heading
// and explicit colors so they stay readable in the browser's dark mode.
export default function ContentPage({
  title,
  intro,
  notice,
  children,
}: {
  title: string;
  intro?: string;
  notice?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-2 text-zinc-600">{intro}</p>}
        {notice && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {notice}
          </div>
        )}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}

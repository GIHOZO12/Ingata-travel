import type { Metadata } from "next";

// Keep the admin area out of search engines.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The admin panel is always light. Without explicit text-zinc-900 the text
  // inherits the page's dark-mode colour (near-white) and becomes invisible on
  // the white fields. [color-scheme:light] keeps native controls (dropdowns,
  // date pickers) light too.
  return (
    <div className="flex flex-1 flex-col bg-zinc-100 text-zinc-900 [color-scheme:light]">
      {children}
    </div>
  );
}

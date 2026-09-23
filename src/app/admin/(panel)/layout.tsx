import Link from "next/link";
import { verifyAdmin } from "@/lib/admin-api";
import { logout } from "@/app/admin/actions";

const links = [
  { label: "Overview", href: "/admin", adminOnly: false },
  { label: "Bookings", href: "/admin/bookings", adminOnly: false },
  { label: "Inquiries", href: "/admin/inquiries", adminOnly: false },
  { label: "Destinations", href: "/admin/destinations", adminOnly: true },
  { label: "Tours", href: "/admin/tours", adminOnly: true },
  { label: "FAQs", href: "/admin/faqs", adminOnly: true },
  { label: "Testimonials", href: "/admin/testimonials", adminOnly: true },
  { label: "Blog", href: "/admin/blog", adminOnly: true },
  { label: "Staff", href: "/admin/staff", adminOnly: true },
];


export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdmin();
  const visibleLinks = links.filter((link) => !link.adminOnly || admin.role === "ADMIN");

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b border-zinc-200 bg-black/90 md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-6 py-4 md:block">
          <p className="font-semibold text-white">Admin</p>
          <p className="text-xs text-white">{admin.name}</p>
          <p className="text-xs text-zinc-400">
            {admin.role === "ADMIN" ? "Administrator" : "Staff"}
          </p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 px-3 pb-3 md:flex-col md:pb-0">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-white hover:bg-zinc-100 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 md:mt-4"
          >
            ← View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-100"
            >
              Sign out
            </button>
          </form>
        </nav>
      </aside>

      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}

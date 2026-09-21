import Link from "next/link";
import { verifyAdmin } from "@/lib/admin-api";
import { logout } from "@/app/admin/actions";

const links = [
  { label: "Overview", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Destinations", href: "/admin/destinations" },
  { label: "Tours", href: "/admin/tours" },
  { label: "FAQs", href: "/admin/faqs" },
];

// Everything inside app/admin/(panel)/ is wrapped by this layout, and every
// page in it is only reachable with a valid login: verifyAdmin() asks the API
// "is this token real?" and redirects to /admin/login if not.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdmin();

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b border-zinc-200 bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-6 py-4 md:block">
          <p className="font-semibold text-zinc-900">Admin</p>
          <p className="text-xs text-zinc-500">{admin.name}</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 px-3 pb-3 md:flex-col md:pb-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
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

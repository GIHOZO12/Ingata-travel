"use client";

// This is a Client Component because it needs state (is the mobile menu open?)
// and the current URL (to highlight the active link). Server Components can't
// use useState or usePathname.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, siteConfig } from "@/lib/site";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // "/" must match exactly, otherwise it would be "active" on every page.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          {siteConfig.name}
        </Link>

        {/* Desktop navigation: hidden below the lg breakpoint */}
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-zinc-900 ${
                isActive(item.href)
                  ? "font-medium text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Staff Login
          </Link>
          <Link
            href="/plan-your-trip"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile menu button: hidden from lg upwards */}
        <button
          type="button"
          className="rounded-md p-2 text-zinc-900 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t border-zinc-200 bg-white px-6 py-4 lg:hidden"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-md px-3 py-3 text-base ${
                isActive(item.href)
                  ? "bg-zinc-100 font-medium text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full border border-zinc-300 px-5 py-3 text-center text-sm font-medium text-zinc-700"
          >
            Staff Login
          </Link>
          <Link
            href="/plan-your-trip"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}

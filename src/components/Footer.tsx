// No "use client" here: the footer has no interactivity, so it stays a
// Server Component and sends no JavaScript to the browser.

import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="text-lg font-semibold text-zinc-900">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-zinc-600">{siteConfig.tagline}</p>
          <ul className="mt-4 space-y-1 text-sm text-zinc-600">
            <li>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>

        {Object.entries(footerNav).map(([group, links]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-zinc-900">{group}</h3>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}

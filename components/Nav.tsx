"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GradePilotLogo } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/app", label: "Planner" },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="transition-transform group-hover:scale-105">
            <GradePilotLogo size={36} />
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-slate-900 leading-none">GradePilot</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mt-0.5">Study Smarter</p>
          </div>
        </Link>

        {/* Links + CTA */}
        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = path === link.href || (link.href !== "/" && path.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <Link href="/app" className="sm:hidden inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-md shadow-indigo-200">
          Planner
        </Link>
      </div>
    </nav>
  );
}

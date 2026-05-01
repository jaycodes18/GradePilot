"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { LexiconMark } from "./LexiconLogo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/app", label: "App" },
  { href: "/pricing", label: "Pricing" },
  { href: "/research", label: "Research" },
  { href: "/future", label: "Future" },
  { href: "/inspiration", label: "Inspiration" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="shadow-neo-xs group-hover:shadow-neo group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-100 flex-shrink-0">
              <LexiconMark size={38} />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg uppercase tracking-tight leading-none text-black">
                LEXICON
              </div>
              <div className="neo-label text-[9px] text-black/50 mt-0.5">
                CONTRACT INTELLIGENCE
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {LINKS.map((l) => {
              const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`neo-label px-3 py-2 text-[11px] border-4 transition-all duration-100 ${
                    active
                      ? "bg-neo-black text-white border-neo-black shadow-neo-xs"
                      : "border-transparent text-black hover:border-black hover:bg-neo-secondary hover:shadow-neo-xs"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right — dark toggle + CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-10 h-10 border-4 border-black flex items-center justify-center shadow-neo-xs hover:bg-neo-secondary hover:shadow-neo transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              {theme === "dark" ? (
                <Sun strokeWidth={3} size={16} className="text-black" />
              ) : (
                <Moon strokeWidth={3} size={16} className="text-black" />
              )}
            </button>
            <Link href="/app" className="neo-btn bg-neo-accent text-white px-5 py-2 text-sm">
              Analyze Now
            </Link>
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-10 h-10 border-4 border-black flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Sun strokeWidth={3} size={14} className="text-black" />
              ) : (
                <Moon strokeWidth={3} size={14} className="text-black" />
              )}
            </button>
            <button
              className="w-12 h-12 border-4 border-black flex items-center justify-center shadow-neo-xs hover:bg-neo-secondary transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X strokeWidth={3} size={20} /> : <Menu strokeWidth={3} size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slides down smoothly */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-t-4 border-black ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-neo-bg">
          {LINKS.map((l) => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-6 py-4 neo-label border-b-4 border-black transition-colors ${
                  active ? "bg-neo-black text-white" : "text-black hover:bg-neo-secondary"
                }`}
              >
                {l.label}
                {active && <span>●</span>}
              </Link>
            );
          })}
          <div className="p-4">
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="neo-btn bg-neo-accent text-white w-full py-3 text-sm"
            >
              Analyze Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

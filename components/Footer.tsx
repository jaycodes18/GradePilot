import Link from "next/link";
import { LexiconMark } from "./LexiconLogo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/app", label: "App" },
  { href: "/pricing", label: "Pricing" },
  { href: "/research", label: "Research" },
  { href: "/future", label: "Future" },
  { href: "/inspiration", label: "Inspiration" },
];

export function Footer() {
  return (
    <footer className="bg-neo-black text-neo-white border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LexiconMark size={42} />
              <div>
                <div className="font-bold text-xl uppercase tracking-tight text-white leading-none">
                  LEXICON
                </div>
                <div className="neo-label text-[9px] text-white/40 mt-1">
                  CONTRACT INTELLIGENCE
                </div>
              </div>
            </div>
            <p className="font-bold text-sm text-white/70 leading-relaxed max-w-[28ch]">
              AI-powered contract analysis for startups and small businesses.
            </p>
            <div className="mt-4 inline-block bg-neo-accent border-4 border-white px-3 py-1">
              <span className="neo-label text-[10px] text-white">NOT LEGAL ADVICE</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="neo-label text-xs text-white/40 mb-4">Pages</p>
            <div className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-bold text-sm hover:text-neo-secondary transition-colors duration-100 w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="neo-label text-xs text-white/40 mb-4">Get Started</p>
            <p className="font-bold text-sm text-white/70 leading-relaxed mb-4">
              Upload a contract and get your first analysis in under 60 seconds.
            </p>
            <Link
              href="/app"
              className="neo-btn bg-neo-secondary text-black px-6 py-3 text-sm shadow-neo-white"
            >
              Try Demo Free
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-4 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="neo-label text-[10px] text-white/40">
            2026 LEXICON. HACKATHON PROTOTYPE. NOT LEGAL ADVICE.
          </p>
          <p className="neo-label text-[10px] text-white/40">
            BUILT FOR FOUNDERS, BY FOUNDERS.
          </p>
        </div>
      </div>
    </footer>
  );
}

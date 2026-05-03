import Link from "next/link";
import { GradePilotLogo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <GradePilotLogo size={32} />
            <div>
              <p className="font-extrabold tracking-tight text-slate-900">GradePilot</p>
              <p className="text-xs font-medium text-slate-500">GPA-optimized planning for students.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition">Home</Link>
            <Link href="/app" className="hover:text-slate-900 transition">Planner</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-1 sm:items-center sm:justify-between text-xs font-medium text-slate-400">
          <span>© 2026 GradePilot · IMSA.ai Hackathon Prototype</span>
          <span>Built for students 🎓</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CalendarDays, CheckSquare, GraduationCap, LayoutDashboard, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { GradePilotLogo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard",          icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/planner",  icon: BookOpen,         label: "Planner"  },
  { href: "/dashboard/gpa",      icon: TrendingUp,       label: "GPA"      },
  { href: "/dashboard/schedule", icon: CalendarDays,     label: "Schedule" },
  { href: "/dashboard/todo",     icon: CheckSquare,      label: "To-Do"    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-fuchsia-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-64 fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-slate-200 shadow-sm">

        {/* Logo area */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-105"><GradePilotLogo size={34} /></div>
            <div>
              <p className="font-extrabold text-slate-900 tracking-tight text-sm leading-none">GradePilot</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.12em] mt-0.5">Study Smarter</p>
            </div>
          </Link>
        </div>

        {/* User chip */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-fuchsia-50 rounded-2xl p-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-black grid place-items-center flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                <item.icon size={17} />
                {item.label}
                {active && (
                  <motion.div layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
            <GraduationCap size={17} /> About
          </Link>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="ml-64 flex-1 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.main key={path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="p-6 max-w-6xl mx-auto">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

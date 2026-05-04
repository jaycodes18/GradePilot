"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, CalendarDays, CheckSquare, GraduationCap,
  LayoutDashboard, LogOut, Menu, TrendingUp, X,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { GradePilotLogo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard",          icon: LayoutDashboard, label: "Overview"  },
  { href: "/dashboard/planner",  icon: BookOpen,         label: "Planner"   },
  { href: "/dashboard/gpa",      icon: TrendingUp,       label: "GPA"       },
  { href: "/dashboard/schedule", icon: CalendarDays,     label: "Schedule"  },
  { href: "/dashboard/todo",     icon: CheckSquare,      label: "To-Do"     },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <GradePilotLogo size={32} />
          <div>
            <p className="font-extrabold text-slate-900 text-sm leading-none">GradePilot</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.12em] mt-0.5">Study Smarter</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 grid place-items-center text-slate-500 hover:bg-slate-200 transition">
            <X size={15} />
          </button>
        )}
      </div>

      {/* User chip */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-fuchsia-50 rounded-2xl p-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-black grid place-items-center flex-shrink-0">
            {user?.avatar}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}>
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <Link href="/" onClick={onClose}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
          <GraduationCap size={17} /> About
        </Link>
        <button onClick={() => { logout(); router.push("/login"); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition">
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [path]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 shadow-sm z-30">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div key="overlay" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} />
            <motion.div key="drawer" className="fixed inset-y-0 left-0 w-72 z-50 shadow-2xl lg:hidden"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}>
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 lg:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl bg-slate-100 grid place-items-center text-slate-700 hover:bg-slate-200 transition">
            <Menu size={18} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <GradePilotLogo size={28} />
            <span className="font-extrabold text-slate-900 text-sm">GradePilot</span>
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-black grid place-items-center">
            {user.avatar}
          </div>
        </div>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.main key={path}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

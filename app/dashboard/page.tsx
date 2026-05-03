"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, CheckSquare, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const CARDS = [
  { href: "/dashboard/planner",  icon: BookOpen,     label: "Study Planner",  desc: "GPA-optimized daily schedule",       color: "from-indigo-500 to-indigo-700",   bg: "bg-indigo-50" },
  { href: "/dashboard/gpa",      icon: TrendingUp,   label: "GPA Tracker",    desc: "Track grades & see your trajectory", color: "from-fuchsia-500 to-fuchsia-700", bg: "bg-fuchsia-50" },
  { href: "/dashboard/schedule", icon: CalendarDays, label: "Day Scheduler",  desc: "Block out your day hour by hour",    color: "from-cyan-500 to-cyan-700",       bg: "bg-cyan-50" },
  { href: "/dashboard/todo",     icon: CheckSquare,  label: "To-Do List",     desc: "Prioritize tasks and crush them",    color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50" },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-[0.14em] mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {user?.name?.split(" ")[0] ?? "Student"}&apos;s Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">What are you working on today?</p>
        </motion.div>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {CARDS.map((card, i) => (
          <motion.div key={card.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <Link href={card.href}
              className={`group flex items-center gap-4 ${card.bg} border border-slate-200/60 rounded-3xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white grid place-items-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <card.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">{card.label}</p>
                <p className="text-sm text-slate-500 font-medium">{card.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick tip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 mb-2">Quick Start</p>
        <p className="font-bold text-lg mb-3">Generate your optimized study plan in 60 seconds.</p>
        <Link href="/dashboard/planner"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-indigo-50 transition active:scale-95">
          Open Planner <ArrowRight size={15} />
        </Link>
      </motion.div>
    </div>
  );
}

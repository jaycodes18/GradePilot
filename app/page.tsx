"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Sparkles, Target, TrendingUp, Zap } from "lucide-react";

const APP_HREF = "/login";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-slate-900">
      <Nav />
      <main>
        <Hero />
        <Features />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/30 to-fuchsia-300/20 blur-3xl pointer-events-none"
        animate={{ x: [0, 20, -10, 0], y: [0, 12, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-300/25 to-indigo-200/20 blur-3xl pointer-events-none"
        animate={{ x: [0, -16, 10, 0], y: [0, -8, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <motion.div {...fadeUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-fuchsia-50 border border-indigo-100 rounded-full px-4 py-2 shadow-sm mb-6">
            <Sparkles size={13} className="text-fuchsia-500" />
            <span className="text-xs font-semibold text-indigo-700">Built for finals season 🎓</span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.05 }}
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-black tracking-tight leading-[0.95] mb-5">
            Study with a<br />
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
              GPA Game Plan
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium leading-relaxed max-w-[52ch] mb-8">
            GradePilot turns your grades, exam weights, and available hours into a
            mathematically prioritized study schedule — day by day, class by class.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3">
            <Link href={APP_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-7 py-3.5 font-semibold shadow-xl shadow-indigo-300/40 hover:brightness-110 active:scale-[.98] transition">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <a href="#features"
              className="inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200 px-7 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm">
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Right — preview card */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glow behind card */}
          <div className="absolute inset-4 bg-gradient-to-br from-indigo-300/30 to-fuchsia-300/20 blur-2xl rounded-3xl" />

          <div className="relative rounded-3xl border border-white/80 bg-white/90 backdrop-blur-xl p-5 shadow-2xl shadow-indigo-100/50">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm font-bold text-slate-700">Tonight&apos;s Plan</p>
              </div>
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">3.0h</span>
            </div>

            {[
              { name: "AP Calculus", time: "1.5h", task: "Timed derivatives set + corrections", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
              { name: "US History",  time: "1.0h", task: "Cold recall sprint + timeline review", color: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
              { name: "English",     time: "0.5h", task: "Essay paragraph polish", color: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
            ].map((item, i) => (
              <motion.div key={item.name}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className={`mb-3 rounded-2xl ${item.color.split(" ")[0]} p-3.5`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <p className={`font-semibold text-sm ${item.color.split(" ")[1]}`}>{item.name}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.time}</span>
                </div>
                <p className="text-xs text-slate-600">{item.task}</p>
              </motion.div>
            ))}

            {/* GPA lift badge */}
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-3.5 text-white">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} />
                <p className="text-xs font-bold">Projected GPA Lift</p>
              </div>
              <p className="font-black text-xl">3.42 → 3.71</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <motion.div {...fadeUp} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-4">
          <Zap size={12} className="text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-[0.12em]">How it works</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Three steps from stress to structure</h2>
        <p className="text-slate-500 font-medium max-w-[50ch] mx-auto">No generic tips. Just a prioritized plan built from your actual grades and time.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: <Target size={22} />,
            color: "from-indigo-500 to-indigo-700",
            bg: "bg-indigo-50",
            title: "Enter your classes",
            desc: "Current grade, final weight, difficulty, and exam date — takes about 60 seconds.",
          },
          {
            icon: <TrendingUp size={22} />,
            color: "from-fuchsia-500 to-fuchsia-700",
            bg: "bg-fuchsia-50",
            title: "Optimize by GPA impact",
            desc: "Allocates hours where each 30-minute chunk gives the strongest grade return per class.",
          },
          {
            icon: <CalendarCheck2 size={22} />,
            color: "from-cyan-500 to-cyan-700",
            bg: "bg-cyan-50",
            title: "Follow your calendar",
            desc: "Get a curated day-by-day plan you can actually stick to. Export to any calendar app.",
          },
        ].map((item, i) => (
          <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.07 }}
            className={`rounded-3xl border border-slate-200/70 ${item.bg} p-6 shadow-sm hover:shadow-md transition`}>
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} text-white grid place-items-center mb-4 shadow-lg`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <motion.div {...fadeUp}
        className="rounded-3xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-cyan-500 p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60 mb-3">Start free · No account needed</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Know exactly what to study tonight.</h2>
            <p className="text-white/75 font-medium leading-relaxed mb-6 max-w-[44ch]">
              Stop guessing which class needs your attention. GradePilot tells you.
            </p>
            <Link href={APP_HREF}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-indigo-700 px-7 py-3.5 font-bold shadow-xl hover:bg-indigo-50 active:scale-[.98] transition">
              Build My Plan <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "GPA Boundaries", value: "9 tracked" },
              { label: "Calendar Export", value: ".ics file" },
              { label: "Study Plan", value: "Day-by-day" },
              { label: "Setup Time", value: "60 seconds" },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xl font-black">{stat.value}</p>
                <p className="text-xs font-semibold text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

type ClassEntry = { id: string; name: string; grade: number; credits: number };
type Snapshot = { date: string; gpa: number; label: string };

function gpaPoint(g: number) {
  if (g >= 93) return 4.0; if (g >= 90) return 3.7; if (g >= 87) return 3.3;
  if (g >= 83) return 3.0; if (g >= 80) return 2.7; if (g >= 77) return 2.3;
  if (g >= 73) return 2.0; if (g >= 70) return 1.7; if (g >= 60) return 1.0;
  return 0;
}

function calcGPA(classes: ClassEntry[]) {
  const total = classes.reduce((s, c) => s + c.credits, 0);
  if (!total) return 0;
  return classes.reduce((s, c) => s + gpaPoint(c.grade) * c.credits, 0) / total;
}

function letterGrade(g: number) {
  if (g >= 93) return "A"; if (g >= 90) return "A−"; if (g >= 87) return "B+";
  if (g >= 83) return "B"; if (g >= 80) return "B−"; if (g >= 77) return "C+";
  if (g >= 73) return "C"; if (g >= 70) return "C−"; if (g >= 60) return "D";
  return "F";
}

const COLORS = ["indigo","rose","amber","emerald","fuchsia","cyan","orange"];
const DOT_COLORS: Record<string, string> = {
  indigo:"#6366f1", rose:"#f43f5e", amber:"#f59e0b",
  emerald:"#10b981", fuchsia:"#d946ef", cyan:"#06b6d4", orange:"#f97316"
};

export default function GPAPage() {
  const { user } = useAuth();
  const key = `gp:gpa:${user?.id}`;
  const histKey = `gp:gpa-history:${user?.id}`;

  const [classes, setClasses] = useState<ClassEntry[]>([
    { id: "1", name: "AP Calculus", grade: 79, credits: 1 },
    { id: "2", name: "AP Biology",  grade: 93, credits: 1 },
    { id: "3", name: "US History",  grade: 85, credits: 1 },
    { id: "4", name: "English",     grade: 88, credits: 1 },
  ]);
  const [history, setHistory] = useState<Snapshot[]>([]);

  // Load from localStorage
  useEffect(() => {
    if (!user) return;
    const c = localStorage.getItem(key);
    const h = localStorage.getItem(histKey);
    if (c) setClasses(JSON.parse(c));
    if (h) setHistory(JSON.parse(h));
  }, [user, key, histKey]);

  // Save on change
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(key, JSON.stringify(classes));
  }, [classes, user, key]);

  const currentGPA = useMemo(() => calcGPA(classes), [classes]);

  function addSnapshot() {
    const snap: Snapshot = {
      date: new Date().toISOString().slice(0, 10),
      gpa: parseFloat(currentGPA.toFixed(2)),
      label: new Date().toLocaleDateString("en", { month: "short", day: "numeric" }),
    };
    const next = [...history, snap];
    setHistory(next);
    localStorage.setItem(histKey, JSON.stringify(next));
  }

  function updateClass(id: string, patch: Partial<ClassEntry>) {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }
  function addClass() {
    setClasses(prev => [...prev, { id: crypto.randomUUID(), name: `Class ${prev.length + 1}`, grade: 85, credits: 1 }]);
  }
  function removeClass(id: string) {
    setClasses(prev => prev.filter(c => c.id !== id));
  }

  const gpaColor = currentGPA >= 3.5 ? "text-emerald-600" : currentGPA >= 3.0 ? "text-indigo-600" : currentGPA >= 2.5 ? "text-amber-600" : "text-rose-600";
  const gpaGrad  = currentGPA >= 3.5 ? "from-emerald-500 to-emerald-700" : currentGPA >= 3.0 ? "from-indigo-500 to-fuchsia-600" : "from-amber-500 to-rose-600";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Academic Overview</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">GPA Tracker</h1>
      </div>

      {/* GPA Hero */}
      <div className={`rounded-3xl bg-gradient-to-br ${gpaGrad} p-6 text-white shadow-xl`}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 mb-1">Current GPA</p>
        <motion.p key={currentGPA} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-black tracking-tight mb-1">{currentGPA.toFixed(2)}</motion.p>
        <p className="text-white/70 font-semibold text-sm">
          {currentGPA >= 3.7 ? "Dean&apos;s List territory 🏆" : currentGPA >= 3.0 ? "Solid — keep pushing 💪" : "Let&apos;s get it up 📈"}
        </p>
        <button onClick={addSnapshot}
          className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-semibold transition">
          <TrendingUp size={14} /> Save Snapshot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Class list */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-800">Your Classes</p>
            <button onClick={addClass}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {classes.map((c, i) => {
                const col = COLORS[i % COLORS.length];
                const letter = letterGrade(c.grade);
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DOT_COLORS[col] }} />
                    <input value={c.name} onChange={e => updateClass(c.id, { name: e.target.value })}
                      className="flex-1 text-sm font-semibold text-slate-800 bg-transparent focus:outline-none min-w-0" />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input type="number" min={0} max={100} value={c.grade}
                        onChange={e => updateClass(c.id, { grade: Number(e.target.value) })}
                        className="w-14 text-center rounded-lg border border-slate-200 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      <span className="text-xs font-bold text-slate-500 w-5">{letter}</span>
                      <button onClick={() => removeClass(c.id)} className="text-slate-300 hover:text-rose-500 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {/* GPA per class */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              {classes.map((c, i) => {
                const col = COLORS[i % COLORS.length];
                const pts = gpaPoint(c.grade);
                return (
                  <div key={c.id} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: DOT_COLORS[col] }} />
                    <span className="text-slate-600 truncate flex-1">{c.name}</span>
                    <span className="font-bold text-slate-800">{pts.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* GPA over time */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5">
          <p className="font-bold text-slate-800 mb-4">GPA Over Time</p>
          {history.length < 2 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp size={28} className="text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 font-medium">Save at least 2 snapshots<br />to see your trajectory.</p>
              <button onClick={addSnapshot}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">Save current GPA</button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip formatter={(v) => typeof v === "number" ? v.toFixed(2) : v} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <ReferenceLine y={3.0} stroke="#e2e8f0" strokeDasharray="4 4" />
                <ReferenceLine y={3.5} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

type Block = {
  id: string;
  startHour: number;
  endHour: number;
  label: string;
  type: "class" | "study" | "rest" | "activity" | "meal" | "free";
};

const TYPE_CONFIG = {
  class:    { label: "Class",    color: "bg-indigo-100 border-indigo-300 text-indigo-800",    dot: "bg-indigo-500" },
  study:    { label: "Study",    color: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800", dot: "bg-fuchsia-500" },
  rest:     { label: "Rest",     color: "bg-emerald-100 border-emerald-300 text-emerald-800", dot: "bg-emerald-500" },
  activity: { label: "Activity", color: "bg-amber-100 border-amber-300 text-amber-800",       dot: "bg-amber-400" },
  meal:     { label: "Meal",     color: "bg-orange-100 border-orange-300 text-orange-800",    dot: "bg-orange-400" },
  free:     { label: "Free",     color: "bg-slate-100 border-slate-300 text-slate-700",       dot: "bg-slate-400" },
};

const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 5am to 11pm

function fmt(h: number) {
  const ampm = h < 12 ? "AM" : "PM";
  const disp = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${disp}:00 ${ampm}`;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const key = `gp:schedule:${user?.id}`;
  const today = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });

  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", startHour: 8,  endHour: 15, label: "School",         type: "class"    },
    { id: "2", startHour: 15, endHour: 16, label: "Rest / Debrief", type: "rest"     },
    { id: "3", startHour: 16, endHour: 18, label: "AP Calc Study",  type: "study"    },
    { id: "4", startHour: 18, endHour: 19, label: "Dinner",         type: "meal"     },
    { id: "5", startHour: 19, endHour: 21, label: "US History + English", type: "study" },
    { id: "6", startHour: 21, endHour: 23, label: "Free time",      type: "free"     },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Block, "id">>({ startHour: 16, endHour: 17, label: "", type: "study" });

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(key);
    if (raw) setBlocks(JSON.parse(raw));
  }, [user, key]);

  function save(next: Block[]) {
    setBlocks(next);
    if (user) localStorage.setItem(key, JSON.stringify(next));
  }

  function addBlock() {
    if (!form.label.trim() || form.endHour <= form.startHour) return;
    save([...blocks, { ...form, id: crypto.randomUUID() }]);
    setShowForm(false);
    setForm({ startHour: 16, endHour: 17, label: "", type: "study" });
  }

  function removeBlock(id: string) { save(blocks.filter(b => b.id !== id)); }

  const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour);
  const totalStudy = blocks.filter(b => b.type === "study").reduce((s, b) => s + (b.endHour - b.startHour), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Daily Planner</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Day Schedule</h1>
          <p className="text-slate-500 font-medium mt-0.5 text-sm">{today}</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-200/50 hover:brightness-110 transition active:scale-95">
          <Plus size={15} /> Add Block
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Study Hours", value: `${totalStudy}h`, color: "text-fuchsia-600" },
          { label: "Class Hours", value: `${blocks.filter(b=>b.type==="class").reduce((s,b)=>s+(b.endHour-b.startHour),0)}h`, color: "text-indigo-600" },
          { label: "Rest + Free",  value: `${blocks.filter(b=>b.type==="rest"||b.type==="free").reduce((s,b)=>s+(b.endHour-b.startHour),0)}h`, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="font-bold text-slate-800">Timeline</p>
        </div>
        <div className="flex">
          {/* Hour labels */}
          <div className="w-16 flex-shrink-0 border-r border-slate-100">
            {HOURS.map(h => (
              <div key={h} className="h-12 flex items-center justify-end pr-3">
                <span className="text-[10px] font-semibold text-slate-400">{fmt(h).replace(":00","")}</span>
              </div>
            ))}
          </div>

          {/* Blocks */}
          <div className="flex-1 relative">
            {HOURS.map(h => (
              <div key={h} className="h-12 border-b border-slate-50" />
            ))}
            {/* Overlay blocks */}
            <div className="absolute inset-0 p-1">
              {sorted.map(block => {
                const cfg = TYPE_CONFIG[block.type];
                const top = (block.startHour - 5) * 48;
                const height = (block.endHour - block.startHour) * 48 - 4;
                return (
                  <motion.div key={block.id} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                    style={{ position: "absolute", top, left: 4, right: 4, height }}
                    className={`rounded-xl border-2 ${cfg.color} px-3 flex items-center justify-between gap-2 overflow-hidden cursor-default`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <span className="text-xs font-semibold truncate">{block.label}</span>
                      <span className="text-[10px] text-current/60 flex-shrink-0">{fmt(block.startHour)}–{fmt(block.endHour)}</span>
                    </div>
                    <button onClick={() => removeBlock(block.id)} className="opacity-40 hover:opacity-100 transition flex-shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add block form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div key="overlay" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)} />
            <motion.div key="modal" className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Add Time Block</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Label</label>
                    <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="e.g. AP Calc Study" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Start</label>
                      <select value={form.startHour} onChange={e => setForm(f => ({ ...f, startHour: Number(e.target.value) }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        {HOURS.map(h => <option key={h} value={h}>{fmt(h)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">End</label>
                      <select value={form.endHour} onChange={e => setForm(f => ({ ...f, endHour: Number(e.target.value) }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        {HOURS.map(h => <option key={h} value={h}>{fmt(h)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(TYPE_CONFIG) as Block["type"][]).map(t => (
                        <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                          className={`py-2 rounded-xl text-xs font-semibold border-2 transition ${form.type === t ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          {TYPE_CONFIG[t].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button onClick={addBlock}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-2.5 text-sm font-semibold hover:brightness-110 transition">
                    Add Block
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

type Priority = "high" | "medium" | "low";
type Todo = { id: string; text: string; priority: Priority; done: boolean; createdAt: string };

const P_CONFIG = {
  high:   { label: "High",   color: "bg-rose-100 text-rose-700 border-rose-200",   dot: "bg-rose-500" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  low:    { label: "Low",    color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

export default function TodoPage() {
  const { user } = useAuth();
  const key = `gp:todos:${user?.id}`;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(key);
    if (raw) setTodos(JSON.parse(raw));
  }, [user, key]);

  function save(next: Todo[]) {
    setTodos(next);
    if (user) localStorage.setItem(key, JSON.stringify(next));
  }

  function add() {
    if (!input.trim()) return;
    save([{ id: crypto.randomUUID(), text: input.trim(), priority, done: false, createdAt: new Date().toISOString() }, ...todos]);
    setInput("");
  }

  function toggle(id: string) { save(todos.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function remove(id: string)  { save(todos.filter(t => t.id !== id)); }

  const active = todos.filter(t => !t.done);
  const done   = todos.filter(t =>  t.done);
  const byPriority = (a: Todo, b: Todo) => {
    const order: Priority[] = ["high","medium","low"];
    return order.indexOf(a.priority) - order.indexOf(b.priority);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Task Manager</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">To-Do List</h1>
        <p className="text-slate-500 text-sm font-medium mt-0.5">{active.length} task{active.length !== 1 ? "s" : ""} remaining</p>
      </div>

      {/* Add task */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex gap-3 mb-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); }}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-400"
            placeholder="Add a task... (press Enter)" />
          <button onClick={add}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-4 py-2.5 hover:brightness-110 transition active:scale-95">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          {(["high","medium","low"] as Priority[]).map(p => (
            <button key={p} onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${priority === p ? P_CONFIG[p].color + " border-2" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
              {P_CONFIG[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Active tasks */}
      {active.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-800 text-sm">Active</p>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{active.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {[...active].sort(byPriority).map(todo => (
                <motion.div key={todo.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }} className="px-5 py-3.5 flex items-center gap-3 group">
                  <button onClick={() => toggle(todo.id)} className="flex-shrink-0 text-slate-300 hover:text-indigo-600 transition">
                    <Circle size={20} />
                  </button>
                  <p className="flex-1 text-sm font-medium text-slate-800 min-w-0">{todo.text}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${P_CONFIG[todo.priority].color}`}>
                      {P_CONFIG[todo.priority].label}
                    </span>
                    <button onClick={() => remove(todo.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Done tasks */}
      {done.length > 0 && (
        <div className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <p className="font-bold text-slate-500 text-sm">Completed</p>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{done.length} ✓</span>
          </div>
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {done.map(todo => (
                <motion.div key={todo.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-5 py-3 flex items-center gap-3 group">
                  <button onClick={() => toggle(todo.id)} className="flex-shrink-0 text-emerald-500 hover:text-slate-400 transition">
                    <CheckCircle2 size={20} />
                  </button>
                  <p className="flex-1 text-sm font-medium text-slate-400 line-through min-w-0">{todo.text}</p>
                  <button onClick={() => remove(todo.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">All clear! Add your first task above.</p>
        </div>
      )}
    </div>
  );
}

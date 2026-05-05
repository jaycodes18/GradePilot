"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlarmClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  LayoutList,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

type Priority = "high" | "medium" | "low";
type Category = "study" | "school" | "personal" | "exam";

type Todo = {
  id: string;
  text: string;
  priority: Priority;
  category: Category;
  dueDate?: string;
  notes?: string;
  done: boolean;
  createdAt: string;
};

type Tab = "all" | "active" | "done";

const P_CONFIG: Record<
  Priority,
  { label: string; color: string; dot: string }
> = {
  high: {
    label: "High",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Medium",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

const C_CONFIG: Record<
  Category,
  { label: string; stripe: string; chip: string }
> = {
  study: {
    label: "Study",
    stripe: "bg-indigo-500",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  school: {
    label: "School",
    stripe: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 border-sky-100",
  },
  personal: {
    label: "Personal",
    stripe: "bg-fuchsia-500",
    chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  },
  exam: {
    label: "Exam",
    stripe: "bg-orange-500",
    chip: "bg-orange-50 text-orange-800 border-orange-100",
  },
};

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function isOverdue(todo: Todo): boolean {
  if (todo.done || !todo.dueDate) return false;
  return parseLocalDate(todo.dueDate).getTime() < startOfToday().getTime();
}

function formatDue(iso: string): string {
  const d = parseLocalDate(iso);
  const t0 = startOfToday().getTime();
  const diff = Math.round((d.getTime() - t0) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < -1) return `${-diff}d overdue`;
  if (diff <= 7) return `In ${diff}d`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function migrateTodo(raw: unknown): Todo | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.text !== "string") return null;
  const priority = (["high", "medium", "low"] as const).includes(o.priority as Priority)
    ? (o.priority as Priority)
    : "medium";
  const category = (
    ["study", "school", "personal", "exam"] as const
  ).includes(o.category as Category)
    ? (o.category as Category)
    : "study";
  const due =
    typeof o.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.dueDate)
      ? o.dueDate
      : undefined;
  const notes = typeof o.notes === "string" ? o.notes : undefined;
  return {
    id: o.id,
    text: o.text,
    priority,
    category,
    dueDate: due,
    notes,
    done: Boolean(o.done),
    createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
  };
}

function compareActive(a: Todo, b: Todo): number {
  const ao = isOverdue(a) ? 0 : 1;
  const bo = isOverdue(b) ? 0 : 1;
  if (ao !== bo) return ao - bo;

  const da = a.dueDate ? parseLocalDate(a.dueDate).getTime() : Infinity;
  const db = b.dueDate ? parseLocalDate(b.dueDate).getTime() : Infinity;
  if (da !== db) return da - db;

  const order: Priority[] = ["high", "medium", "low"];
  return order.indexOf(a.priority) - order.indexOf(b.priority);
}

export default function TodoPage() {
  const { user } = useAuth();
  const key = `gp:todos:${user?.id}`;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("study");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const next = parsed.map(migrateTodo).filter((x): x is Todo => x !== null);
      setTodos(next);
    } catch {
      /* ignore */
    }
  }, [user, key]);

  function save(next: Todo[]) {
    setTodos(next);
    if (user) localStorage.setItem(key, JSON.stringify(next));
  }

  function add() {
    if (!input.trim()) return;
    const row: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
      done: false,
      createdAt: new Date().toISOString(),
    };
    save([row, ...todos]);
    setInput("");
    setDueDate("");
    setNotes("");
    setPriority("medium");
    setCategory("study");
  }

  function toggle(id: string) {
    save(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    save(todos.filter(t => t.id !== id));
    setExpanded(e => {
      const n = { ...e };
      delete n[id];
      return n;
    });
  }

  function clearCompleted() {
    save(todos.filter(t => !t.done));
  }

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = todos;
    if (tab === "active") list = list.filter(t => !t.done);
    if (tab === "done") list = list.filter(t => t.done);
    if (q)
      list = list.filter(
        t =>
          t.text.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          C_CONFIG[t.category].label.toLowerCase().includes(q),
      );
    return [...list].sort((a, b) => {
      if (tab === "done") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return compareActive(a, b);
    });
  }, [todos, tab, q]);

  const active = todos.filter(t => !t.done);
  const done = todos.filter(t => t.done);
  const overdue = active.filter(isOverdue);
  const pct =
    todos.length === 0 ? 0 : Math.round((done.length / todos.length) * 100);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">
            Task Manager
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            To-Do List
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            {active.length} active · {done.length} completed
            {overdue.length > 0 ? (
              <span className="text-rose-600 font-semibold">
                {" "}
                · {overdue.length} overdue
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm min-w-[220px]">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Progress
              </p>
              <p className="text-xs font-black text-slate-900">{pct}%</p>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {done.length}/{todos.length || 1} tasks done
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all" as Tab, label: "All", count: todos.length },
              { id: "active" as Tab, label: "Active", count: active.length },
              { id: "done" as Tab, label: "Done", count: done.length },
            ] as const
          ).map(row => (
            <button
              key={row.id}
              type="button"
              onClick={() => setTab(row.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border transition ${
                tab === row.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}>
              <LayoutList size={14} />
              {row.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  tab === row.id ? "bg-white/15" : "bg-slate-100 text-slate-500"
                }`}>
                {row.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, notes, categories…"
            className="w-full lg:w-72 rounded-2xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Composer */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                add();
              }
            }}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-400"
            placeholder="What needs to get done?"
          />
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-5 py-3 font-bold hover:brightness-110 transition active:scale-[0.98] shadow-lg shadow-indigo-200/60">
            <Plus size={18} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mr-1">
            Priority
          </span>
          {(["high", "medium", "low"] as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                priority === p
                  ? `${P_CONFIG[p].color} border-2`
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}>
              {P_CONFIG[p].label}
            </button>
          ))}
          <span className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 sm:ml-2">
            Category
          </span>
          {(["study", "school", "personal", "exam"] as Category[]).map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                category === c
                  ? `${C_CONFIG[c].chip} border-2`
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}>
              <span className={`w-2 h-2 rounded-full ${C_CONFIG[c].stripe}`} />
              {C_CONFIG[c].label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50/80">
            <CalendarDays size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Due date
              </p>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </label>
          <label className="flex items-start gap-2 rounded-2xl border border-dashed border-slate-200 px-3 py-2 bg-white">
            <Tag size={16} className="text-slate-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Notes (optional)
              </p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Links, reminders, checklist items…"
                className="w-full resize-none bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Done utilities */}
      {done.length > 0 && tab !== "done" && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={clearCompleted}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 underline-offset-4 hover:underline">
            Clear all completed ({done.length})
          </button>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-800 text-sm">
              {tab === "all"
                ? "All tasks"
                : tab === "active"
                  ? "Active tasks"
                  : "Completed"}
            </p>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            <AnimatePresence initial={false}>
              {filtered.map(todo => {
                const ov = isOverdue(todo);
                const open = !!expanded[todo.id];
                const hasNotes = !!todo.notes?.trim();

                return (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="relative flex gap-0 group">
                    <div
                      className={`w-1 flex-shrink-0 ${C_CONFIG[todo.category].stripe}`}
                    />
                    <div className="flex-1 px-4 py-3.5 sm:px-5">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggle(todo.id)}
                          className="flex-shrink-0 mt-0.5 text-slate-300 hover:text-indigo-600 transition">
                          {todo.done ? (
                            <CheckCircle2 size={22} className="text-emerald-500" />
                          ) : (
                            <Circle size={22} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                todo.done
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}>
                              {todo.text}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${P_CONFIG[todo.priority].color}`}>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${P_CONFIG[todo.priority].dot}`}
                              />
                              {P_CONFIG[todo.priority].label}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${C_CONFIG[todo.category].chip}`}>
                              {C_CONFIG[todo.category].label}
                            </span>
                            {todo.dueDate ? (
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  ov && !todo.done
                                    ? "bg-rose-50 text-rose-700 border-rose-100"
                                    : "bg-slate-50 text-slate-600 border-slate-100"
                                }`}>
                                <AlarmClock size={11} />
                                {formatDue(todo.dueDate)}
                              </span>
                            ) : null}
                          </div>

                          {hasNotes ? (
                            <button
                              type="button"
                              onClick={() =>
                                setExpanded(e => ({
                                  ...e,
                                  [todo.id]: !open,
                                }))
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                              <ChevronDown
                                size={14}
                                className={`transition ${open ? "rotate-180" : ""}`}
                              />
                              {open ? "Hide notes" : "Show notes"}
                            </button>
                          ) : null}

                          <AnimatePresence initial={false}>
                            {open && hasNotes ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden">
                                <p className="text-xs font-medium text-slate-600 whitespace-pre-wrap rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
                                  {todo.notes}
                                </p>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(todo.id)}
                          className="flex-shrink-0 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-6">
          <CheckCircle2 size={42} className="mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-700">
            {tab === "done"
              ? "No completed tasks yet."
              : q
                ? "No matches for that search."
                : tab === "active"
                  ? "You're all caught up on active tasks."
                  : "Nothing here yet."}
          </p>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {tab === "active" && !q
              ? "Drop something into the composer above."
              : "Try another tab or clear the search filter."}
          </p>
        </div>
      )}
    </div>
  );
}

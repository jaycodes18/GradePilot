"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays, ChevronLeft, ChevronRight, Clock3, Download,
  Plus, Target, Trash2, TrendingUp, X, Zap, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────
type Course = { id: string; name: string; currentGrade: number; finalWeight: number; credits: number; difficulty: number; examDate: string };
type Session = { courseId: string; courseName: string; hours: number; task: string };
type DayPlan = { date: string; totalHours: number; sessions: Session[] };
type CourseSummary = { id: string; name: string; allocatedHours: number; beforeGrade: number; projectedGrade: number; rationale: string; impactScore: number };
type PlanResult = { summaries: CourseSummary[]; dayPlans: DayPlan[]; totalHours: number; gpaBefore: number; gpaAfter: number };

// ── Constants ─────────────────────────────────────────────────────────────
const COLORS = [
  { bg:"bg-indigo-100",  text:"text-indigo-700",  dot:"bg-indigo-500",  bar:"bg-indigo-500",  badge:"bg-indigo-600 text-white"  },
  { bg:"bg-rose-100",    text:"text-rose-700",    dot:"bg-rose-500",    bar:"bg-rose-500",    badge:"bg-rose-600 text-white"    },
  { bg:"bg-amber-100",   text:"text-amber-700",   dot:"bg-amber-400",   bar:"bg-amber-400",   badge:"bg-amber-500 text-white"   },
  { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500", bar:"bg-emerald-500", badge:"bg-emerald-600 text-white" },
  { bg:"bg-fuchsia-100", text:"text-fuchsia-700", dot:"bg-fuchsia-500", bar:"bg-fuchsia-500", badge:"bg-fuchsia-600 text-white" },
  { bg:"bg-cyan-100",    text:"text-cyan-700",    dot:"bg-cyan-500",    bar:"bg-cyan-500",    badge:"bg-cyan-600 text-white"    },
  { bg:"bg-orange-100",  text:"text-orange-700",  dot:"bg-orange-400",  bar:"bg-orange-400",  badge:"bg-orange-500 text-white"  },
];
const BOUNDARIES = [60,70,73,77,80,83,87,90,93];
const BOUNDARY_LABELS: Record<number,string> = {60:"D",70:"C−",73:"C",77:"C+",80:"B−",83:"B",87:"B+",90:"A−",93:"A"};
const CHUNK = 0.5;
const TASKS = [
  "Target your weakest chapter and write a one-page summary.",
  "Timed mixed practice set and error log.",
  "Recall sprint without notes, then patch weak spots.",
  "Medium/hard problems first, basics after.",
  "Teach the topic out loud in five minutes.",
];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_HEADERS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── Pure helpers ──────────────────────────────────────────────────────────
const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parseISO = (iso: string) => new Date(`${iso}T00:00:00`);
const addDays = (base: string, n: number) => { const d = parseISO(base); d.setDate(d.getDate()+n); return toISO(d); };
const daysBetween = (a: string, b: string) => Math.max(0, Math.ceil((parseISO(b).getTime()-parseISO(a).getTime())/86400000));
const isWeekend = (iso: string) => { const d = parseISO(iso).getDay(); return d===0||d===6; };
const dateRange = (s: string, e: string) => { const out: string[] = []; let c = parseISO(s); const end = parseISO(e); while(c<=end){out.push(toISO(c));c=new Date(c.getTime()+86400000);} return out; };
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));
const prettyDate = (iso: string) => parseISO(iso).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});

function buildCalGrid(year: number, month: number): (string|null)[] {
  const first = new Date(year,month,1).getDay();
  const days  = new Date(year,month+1,0).getDate();
  const grid: (string|null)[] = Array(first).fill(null);
  for(let d=1;d<=days;d++) grid.push(`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`);
  while(grid.length%7!==0) grid.push(null);
  return grid;
}

function newCourse(today: string, days: number, name: string, grade: number): Course {
  return { id: crypto.randomUUID(), name, currentGrade: grade, finalWeight: 25, credits: 1, difficulty: 3, examDate: addDays(today, days) };
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const { user } = useAuth();
  const today = useMemo(() => toISO(new Date()), []);
  const storageKey = `gp:planner:${user?.id}`;

  const [weekdayH, setWeekdayH] = useState(2);
  const [weekendH, setWeekendH] = useState(4);
  const [targetGpa, setTargetGpa] = useState(3.7);
  const [courses, setCourses] = useState<Course[]>([
    newCourse(today,4,"AP Calculus",79),
    newCourse(today,6,"AP Biology",93),
    newCourse(today,8,"US History",85),
    newCourse(today,10,"English",88),
  ]);
  const [plan, setPlan]           = useState<PlanResult|null>(null);
  const [activeTab, setActiveTab] = useState<"plan"|"calendar">("plan");
  const [calDate, setCalDate]     = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string|null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      setCourses(saved.courses ?? courses);
      setWeekdayH(saved.weekdayH ?? 2);
      setWeekendH(saved.weekendH ?? 4);
      setTargetGpa(saved.targetGpa ?? 3.7);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save on change
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(storageKey, JSON.stringify({ courses, weekdayH, weekendH, targetGpa }));
  }, [courses, weekdayH, weekendH, targetGpa, user, storageKey]);

  // Live re-optimization
  const livePlan = useMemo(() => {
    const valid = courses.filter(c => c.name.trim() && c.examDate);
    if (!valid.length) return null;
    return buildPlan(valid, weekdayH, weekendH, targetGpa, today);
  }, [courses, weekdayH, weekendH, targetGpa, today]);

  const colorMap = useMemo(() => {
    const m = new Map<string,number>();
    courses.forEach((c,i) => m.set(c.id, i % COLORS.length));
    return m;
  }, [courses]);

  const examMap = useMemo(() => {
    const m = new Map<string,Course[]>();
    courses.forEach(c => { if(!m.has(c.examDate)) m.set(c.examDate,[]); m.get(c.examDate)!.push(c); });
    return m;
  }, [courses]);

  const dayPlanMap = useMemo(() => {
    const m = new Map<string,DayPlan>();
    livePlan?.dayPlans.forEach(d => m.set(d.date,d));
    return m;
  }, [livePlan]);

  function updateCourse(id: string, patch: Partial<Course>) {
    setCourses(prev => prev.map(c => c.id===id ? {...c,...patch} : c));
  }
  function addCourse() {
    setCourses(prev => [...prev, newCourse(today,7,`Class ${prev.length+1}`,82)]);
  }
  function removeCourse(id: string) {
    setCourses(prev => prev.filter(c => c.id!==id));
  }

  const generate = useCallback(() => {
    if (!livePlan || livePlan.totalHours <= 0) return;
    setPlan(livePlan);
    setActiveTab("plan");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
    // Jump calendar to first exam month
    const firstExam = courses.filter(c=>c.examDate).sort((a,b)=>a.examDate.localeCompare(b.examDate))[0];
    if (firstExam) setCalDate(parseISO(firstExam.examDate));
  }, [livePlan, courses]);

  const todayPlan = dayPlanMap.get(today);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Study Optimizer</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">GradePilot Planner</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Your data saves automatically.</p>
      </div>

      {/* Tonight banner */}
      {todayPlan && todayPlan.totalHours > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-5 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Zap size={14} className="fill-yellow-300 text-yellow-300" /> Tonight ·
          </div>
          {todayPlan.sessions.map(s => {
            const ci = colorMap.get(s.courseId) ?? 0;
            return <span key={s.courseId} className={`${COLORS[ci].bg} ${COLORS[ci].text} text-xs font-semibold px-2.5 py-1 rounded-full`}>{s.courseName} · {s.hours.toFixed(1)}h</span>;
          })}
          <span className="text-white/70 text-xs ml-auto">{todayPlan.totalHours.toFixed(1)}h total</span>
        </div>
      )}

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div key="toast" initial={{opacity:0,y:-20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.95}}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-200 font-semibold text-sm">
            <CheckCircle2 size={18} /> Plan generated! Check your calendar 📅
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-5 items-start">
        {/* Input panel */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-800">Inputs</span>
            <button onClick={addCourse}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition active:scale-95">
              <Plus size={12} /> Add Class
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Weekday h" value={weekdayH} min={0} max={10} step={0.5} onChange={setWeekdayH} />
              <Field label="Weekend h" value={weekendH} min={0} max={12} step={0.5} onChange={setWeekendH} />
              <Field label="Target GPA" value={targetGpa} min={0} max={4} step={0.1} onChange={setTargetGpa} />
            </div>

            <div className="space-y-3">
              {courses.map(c => {
                const ci = colorMap.get(c.id) ?? 0;
                return (
                  <div key={c.id} className={`rounded-2xl ${COLORS[ci].bg} p-3 space-y-2.5`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLORS[ci].dot}`} />
                      <input value={c.name} onChange={e => updateCourse(c.id,{name:e.target.value})}
                        className="flex-1 rounded-lg border border-white/60 bg-white px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      <button onClick={() => removeCourse(c.id)}
                        className="w-8 h-8 rounded-lg bg-white/80 grid place-items-center text-slate-400 hover:text-rose-500 transition flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <GradeBoundaryBar grade={c.currentGrade} colorIdx={ci} />
                    <div className="grid grid-cols-4 gap-1.5">
                      <Field label="Grade %" value={c.currentGrade} min={0} max={100} step={1} onChange={v => updateCourse(c.id,{currentGrade:v})} />
                      <Field label="Final %" value={c.finalWeight} min={5} max={60} step={1} onChange={v => updateCourse(c.id,{finalWeight:v})} />
                      <Field label="Diff." value={c.difficulty} min={1} max={5} step={1} onChange={v => updateCourse(c.id,{difficulty:v})} />
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 mb-1">Exam</div>
                        <input type="date" value={c.examDate} onChange={e => updateCourse(c.id,{examDate:e.target.value})}
                          className="w-full rounded-lg border border-white/60 bg-white px-1 py-1.5 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={generate}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-200/60 hover:brightness-110 active:scale-[.98] transition">
              Generate Optimized Plan ✦
            </button>
          </div>
        </section>

        {/* Output panel */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm min-h-[620px] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
              {(["plan","calendar"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab===tab?"bg-white shadow text-slate-900":"text-slate-500 hover:text-slate-700"}`}>
                  {tab==="calendar" ? "📅 Calendar" : "📊 Plan"}
                </button>
              ))}
            </div>
            {plan && (
              <button onClick={() => exportIcs(plan)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition">
                <Download size={12} /> .ics
              </button>
            )}
          </div>

          {!plan ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 grid place-items-center mx-auto mb-5">
                <Target size={32} className="text-indigo-400" />
              </div>
              <p className="font-bold text-xl mb-2">No plan yet</p>
              <p className="text-slate-500 text-sm max-w-[36ch]">Fill in your classes and click Generate to get a personalized study plan.</p>
            </div>
          ) : activeTab==="plan" ? (
            <PlanTab plan={plan} courses={courses} colorMap={colorMap} targetGpa={targetGpa} />
          ) : (
            <CalendarTab courses={courses} colorMap={colorMap} examMap={examMap} dayPlanMap={dayPlanMap}
              calDate={calDate} setCalDate={setCalDate} selectedDay={selectedDay}
              setSelectedDay={setSelectedDay} today={today} />
          )}
        </section>
      </div>

      {/* Day modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayModal day={selectedDay} dayPlan={dayPlanMap.get(selectedDay)??null}
            examCourses={examMap.get(selectedDay)??[]} colorMap={colorMap}
            onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Plan Tab ──────────────────────────────────────────────────────────────
function PlanTab({ plan, courses, colorMap, targetGpa }: { plan: PlanResult; courses: Course[]; colorMap: Map<string,number>; targetGpa: number }) {
  const courseMap = useMemo(() => new Map(courses.map(c=>[c.id,c])), [courses]);
  const today = toISO(new Date());
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Metric icon={<Clock3 size={15}/>} label="Study Hours" value={`${plan.totalHours.toFixed(1)}h`} />
        <Metric icon={<TrendingUp size={15}/>} label="GPA" value={`${plan.gpaBefore.toFixed(2)} → ${plan.gpaAfter.toFixed(2)}`} highlight />
        <Metric icon={<Target size={15}/>} label="Target" value={plan.gpaAfter>=targetGpa?"✓ On Track":`${(targetGpa-plan.gpaAfter).toFixed(2)} short`} good={plan.gpaAfter>=targetGpa} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 border-b border-slate-200">Priority Breakdown</div>
        <div className="divide-y divide-slate-100">
          {plan.summaries.map((s,rank) => {
            const ci = colorMap.get(s.id) ?? 0;
            const course = courseMap.get(s.id);
            const daysLeft = course ? daysBetween(today, course.examDate) : 0;
            return (
              <motion.div key={s.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:rank*0.04}} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${COLORS[ci].dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-sm">{s.name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLORS[ci].bg} ${COLORS[ci].text}`}>{s.allocatedHours.toFixed(1)}h</span>
                      {daysLeft<=3&&daysLeft>0&&<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Exam in {daysLeft}d 🔥</span>}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-slate-500">{s.beforeGrade.toFixed(0)}%</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${COLORS[ci].bar}`} initial={{width:0}} animate={{width:`${s.projectedGrade}%`}} transition={{duration:0.7,delay:rank*0.05}} />
                      </div>
                      <span className={`text-xs font-semibold ${COLORS[ci].text}`}>{s.projectedGrade.toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-500">{s.rationale}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Calendar Tab ──────────────────────────────────────────────────────────
function CalendarTab({ courses, colorMap, examMap, dayPlanMap, calDate, setCalDate, selectedDay, setSelectedDay, today }: {
  courses: Course[]; colorMap: Map<string,number>; examMap: Map<string,Course[]>;
  dayPlanMap: Map<string,DayPlan>; calDate: Date; setCalDate: (d:Date)=>void;
  selectedDay: string|null; setSelectedDay: (d:string|null)=>void; today: string;
}) {
  const year=calDate.getFullYear(), month=calDate.getMonth();
  const grid = useMemo(() => buildCalGrid(year,month), [year,month]);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCalDate(new Date(year,month-1,1))} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 grid place-items-center transition active:scale-90"><ChevronLeft size={16}/></button>
        <p className="font-bold text-slate-800">{MONTH_NAMES[month]} {year}</p>
        <button onClick={() => setCalDate(new Date(year,month+1,1))} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 grid place-items-center transition active:scale-90"><ChevronRight size={16}/></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d=><div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((iso,idx) => {
          if(!iso) return <div key={`e-${idx}`}/>;
          const dp=dayPlanMap.get(iso), exams=examMap.get(iso)??[];
          const isToday=iso===today, isSelected=iso===selectedDay, hasStudy=(dp?.totalHours??0)>0;
          return (
            <motion.button key={iso} whileHover={{scale:1.08}} whileTap={{scale:0.94}} onClick={()=>setSelectedDay(iso)}
              className={`relative rounded-xl p-1.5 min-h-[56px] flex flex-col items-center cursor-pointer transition
                ${isSelected?"ring-2 ring-indigo-400 bg-indigo-50":"hover:bg-slate-50"}
                ${isToday&&!isSelected?"ring-2 ring-fuchsia-400 bg-fuchsia-50":""}
                ${exams.length>0&&!isSelected&&!isToday?"bg-rose-50":""}`}>
              <span className={`text-xs font-bold mb-1 ${isToday?"text-fuchsia-600":"text-slate-700"}`}>{parseISO(iso).getDate()}</span>
              {exams.length>0&&<span className="text-[9px] font-bold px-1 rounded bg-rose-500 text-white mb-0.5">EXAM</span>}
              {hasStudy&&dp&&(
                <div className="flex flex-wrap justify-center gap-0.5 mt-auto">
                  {dp.sessions.slice(0,4).map(s=>{const ci=colorMap.get(s.courseId)??0;return<span key={s.courseId} className={`w-2 h-2 rounded-full ${COLORS[ci].dot}`}/>;})}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100">
        {courses.map(c=>{const ci=colorMap.get(c.id)??0;return(<div key={c.id} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${COLORS[ci].dot}`}/><span className="text-xs text-slate-600 font-medium">{c.name}</span></div>);})}
      </div>
    </div>
  );
}

// ── Day modal ─────────────────────────────────────────────────────────────
function DayModal({ day, dayPlan, examCourses, colorMap, onClose }: {
  day: string; dayPlan: DayPlan|null; examCourses: Course[]; colorMap: Map<string,number>; onClose: ()=>void;
}) {
  return (
    <>
      <motion.div key="bd" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none sm:p-6">
        <motion.div key="panel" className="pointer-events-auto w-full sm:w-[460px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style={{maxHeight:"88vh"}} initial={{opacity:0,y:60,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:30}} transition={{type:"spring",stiffness:340,damping:32}}>
          <div className="px-5 pt-5 pb-4 flex items-start justify-between border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-0.5"><CalendarDays size={15} className="text-indigo-500"/><p className="font-bold text-slate-900">{prettyDate(day)}</p></div>
              <p className="text-xs text-slate-500">{dayPlan?`${dayPlan.totalHours.toFixed(1)}h planned`:"Rest day — no sessions"}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 grid place-items-center hover:bg-slate-200 transition"><X size={15}/></button>
          </div>
          {examCourses.length>0&&(
            <div className="px-5 py-3 bg-rose-50 border-b border-rose-100 flex flex-wrap gap-2">
              {examCourses.map(c=>{const ci=colorMap.get(c.id)??0;return<span key={c.id} className={`text-xs font-bold px-3 py-1 rounded-full ${COLORS[ci].badge}`}>📝 EXAM · {c.name}</span>;})}
            </div>
          )}
          <div className="px-5 py-4 space-y-3 flex-1 overflow-y-auto overscroll-contain">
            {!dayPlan||dayPlan.sessions.length===0?(
              <div className="text-center py-6 text-slate-500 text-sm"><p className="text-2xl mb-2">😴</p>No study sessions scheduled — enjoy the break!</div>
            ):(
              dayPlan.sessions.map((s,i)=>{const ci=colorMap.get(s.courseId)??0;return(
                <motion.div key={`${s.courseId}-${i}`} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                  className={`rounded-2xl ${COLORS[ci].bg} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${COLORS[ci].dot}`}/><p className={`font-semibold text-sm ${COLORS[ci].text}`}>{s.courseName}</p></div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${COLORS[ci].badge}`}>{s.hours.toFixed(1)}h</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{s.task}</p>
                </motion.div>
              );})
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ── Grade boundary bar ────────────────────────────────────────────────────
function GradeBoundaryBar({ grade, colorIdx }: { grade: number; colorIdx: number }) {
  const next = BOUNDARIES.find(b => b > grade);
  const pct  = clamp(grade,50,100);
  const nPct = next ? clamp(next,50,100) : null;
  const gap  = next ? next - grade : 0;
  return (
    <div className="space-y-1">
      <div className="relative h-1.5 bg-white/50 rounded-full overflow-hidden">
        <motion.div className={`absolute left-0 top-0 h-full rounded-full ${COLORS[colorIdx].bar}`} style={{width:`${((pct-50)/50)*100}%`}} initial={{width:0}} animate={{width:`${((pct-50)/50)*100}%`}} transition={{duration:0.6}}/>
        {nPct&&<div className="absolute top-0 w-0.5 h-full bg-slate-400/50" style={{left:`${((nPct-50)/50)*100}%`}}/>}
      </div>
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className={COLORS[colorIdx].text}>{grade.toFixed(0)}%</span>
        {next&&gap>0&&<span className="text-slate-500">{gap.toFixed(0)}pt to {BOUNDARY_LABELS[next]}</span>}
        {!next&&<span className="text-emerald-600">Max grade ✓</span>}
      </div>
    </div>
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────
function Field({ label, value, min, max, step, onChange }: { label:string; value:number; min:number; max:number; step:number; onChange:(v:number)=>void }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 mb-1">{label}</div>
      <input type="number" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"/>
    </div>
  );
}

function Metric({ icon, label, value, highlight, good }: { icon:React.ReactNode; label:string; value:string; highlight?:boolean; good?:boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight?"border-indigo-200 bg-indigo-50":good===true?"border-emerald-200 bg-emerald-50":"border-slate-200 bg-white"}`}>
      <div className={`flex items-center gap-1.5 mb-1.5 ${highlight?"text-indigo-600":good===true?"text-emerald-600":"text-slate-500"}`}>{icon}<span className="text-[10px] font-bold uppercase tracking-[0.12em]">{label}</span></div>
      <p className={`text-sm font-bold ${highlight?"text-indigo-700":good===true?"text-emerald-700":"text-slate-800"}`}>{value}</p>
    </div>
  );
}

// ── Optimizer ─────────────────────────────────────────────────────────────
function buildPlan(courses: Course[], weekdayH: number, weekendH: number, targetGpa: number, today: string): PlanResult {
  const lastExam = courses.reduce((m,c)=>c.examDate>m?c.examDate:m,today);
  const days = dateRange(today,lastExam);
  const assigned = new Map(courses.map(c=>[c.id,0]));
  const dayPlans: DayPlan[] = [];

  for(const day of days) {
    let rem = isWeekend(day)?weekendH:weekdayH;
    const bucket = new Map<string,Session>();
    while(rem>=CHUNK) {
      let best: Course|null=null, bestScore=-1;
      for(const c of courses) {
        if(c.examDate<day) continue;
        const h=assigned.get(c.id)??0;
        const marginal=gain(c,h+CHUNK)-gain(c,h);
        if(marginal<=0.002) continue;
        const proj=clamp(c.currentGrade+gain(c,h),0,100);
        const urgency=1+Math.max(0,14-daysBetween(day,c.examDate))/18;
        const score=marginal*c.credits*urgency*boundaryBonus(proj)*(gpaPoint(proj)<targetGpa?1.12:0.95);
        if(score>bestScore){bestScore=score;best=c;}
      }
      if(!best) break;
      assigned.set(best.id,(assigned.get(best.id)??0)+CHUNK);
      rem-=CHUNK;
      if(!bucket.has(best.id)) bucket.set(best.id,{courseId:best.id,courseName:best.name,hours:0,task:""});
      bucket.get(best.id)!.hours+=CHUNK;
    }
    const sessions=Array.from(bucket.values()).sort((a,b)=>b.hours-a.hours)
      .map((s,i)=>({...s,task:buildTask(s.courseName,i,daysBetween(day,courses.find(c=>c.id===s.courseId)!.examDate))}));
    dayPlans.push({date:day,totalHours:sessions.reduce((sum,s)=>sum+s.hours,0),sessions});
  }

  const summaries=courses.map(c=>{
    const h=assigned.get(c.id)??0, before=clamp(c.currentGrade,0,100), after=clamp(c.currentGrade+gain(c,h),0,100);
    return{id:c.id,name:c.name,allocatedHours:h,beforeGrade:before,projectedGrade:after,impactScore:(gpaPoint(after)-gpaPoint(before))*c.credits,rationale:rationale(c,before,after,h)};
  }).sort((a,b)=>b.impactScore-a.impactScore);

  const gpaBefore=weighted(courses.map(c=>({points:gpaPoint(c.currentGrade),credits:c.credits})));
  const gpaAfter=weighted(courses.map(c=>({points:gpaPoint(clamp(c.currentGrade+gain(c,assigned.get(c.id)??0),0,100)),credits:c.credits})));
  return{summaries,dayPlans,totalHours:dayPlans.reduce((s,d)=>s+d.totalHours,0),gpaBefore,gpaAfter};
}

function gain(c: Course, h: number) { const max=clamp(27-c.difficulty*2.8,8,25),k=0.42/(1+c.difficulty*0.35); return max*(1-Math.exp(-k*h))*(c.finalWeight/100); }
function buildTask(name: string, idx: number, days: number) { if(days<=2) return`Exam sprint for ${name}: timed set, correction pass, confidence check.`; return`${name}: ${TASKS[idx%TASKS.length]}`; }
function rationale(c: Course, before: number, after: number, h: number) { const next=BOUNDARIES.find(b=>b>before); if(h<0.5) return"Already stable vs other classes."; if(next&&after>=next) return`Crosses the ${next}% boundary for a stronger GPA jump.`; if(c.currentGrade>=92) return"High grade — extra time capped to help lower classes."; return"Strong final weight and marginal gain at this level."; }
function boundaryBonus(g: number) { const next=BOUNDARIES.find(b=>b>g); if(!next) return 0.6; const gap=next-g; if(gap<=2) return 1.6; if(gap<=5) return 1.35; if(gap<=8) return 1.15; return 1; }
function weighted(v: {points:number,credits:number}[]) { const c=v.reduce((s,x)=>s+x.credits,0); return c?v.reduce((s,x)=>s+x.points*x.credits,0)/c:0; }
function gpaPoint(g: number) { if(g>=93) return 4;if(g>=90) return 3.7;if(g>=87) return 3.3;if(g>=83) return 3;if(g>=80) return 2.7;if(g>=77) return 2.3;if(g>=73) return 2;if(g>=70) return 1.7;if(g>=60) return 1;return 0; }
function exportIcs(plan: PlanResult) {
  const esc=(t:string)=>t.replaceAll("\\","\\\\").replaceAll(";","\\;").replaceAll(",","\\,").replaceAll("\n","\\n");
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//GradePilot//EN",
    ...plan.dayPlans.flatMap(d=>d.sessions.flatMap((s,i)=>{const dt=d.date.replaceAll("-",""),st=17+i*2,en=st+Math.max(1,Math.ceil(s.hours));
      return["BEGIN:VEVENT",`UID:${dt}-${i}-${s.courseId}@gp`,`DTSTAMP:${dt}T120000`,`DTSTART:${dt}T${String(st).padStart(2,"0")}0000`,`DTEND:${dt}T${String(en).padStart(2,"0")}0000`,`SUMMARY:Study - ${esc(s.courseName)}`,`DESCRIPTION:${esc(s.task)}`,"END:VEVENT"];})),"END:VCALENDAR"];
  const blob=new Blob([lines.join("\r\n")],{type:"text/calendar"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="gradepilot.ics";a.click();URL.revokeObjectURL(url);
}

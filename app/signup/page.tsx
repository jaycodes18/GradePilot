"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { GradePilotLogo } from "@/components/Logo";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);
    if (res.ok) router.push("/dashboard");
    else setError(res.error ?? "Signup failed.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-indigo-50 flex flex-col items-center justify-center px-4">
      <motion.div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-300/20 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="fixed -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-300/20 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative">

        <div className="flex flex-col items-center mb-8">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <GradePilotLogo size={56} />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-4">Create your account</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Start planning smarter. It&apos;s free.</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl shadow-fuchsia-100/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition placeholder:text-slate-400"
                placeholder="Alex Johnson" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition placeholder:text-slate-400"
                placeholder="you@school.edu" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition placeholder:text-slate-400"
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white py-3 font-semibold shadow-lg shadow-fuchsia-200/50 hover:brightness-110 active:scale-[.98] transition disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">GradePilot · IMSA.ai Hackathon 2026</p>
      </motion.div>
    </div>
  );
}

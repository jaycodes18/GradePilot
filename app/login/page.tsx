"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { GradePilotLogo } from "@/components/Logo";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address (e.g. you@school.edu).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) router.push("/dashboard");
    else setError(res.error ?? "Login failed.");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-10">
      {/* Subtle gradient top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4"><GradePilotLogo size={52} /></div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center">Login to your account.</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 text-center">Hello, welcome back to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative border-2 border-indigo-400 rounded-2xl px-4 pt-3 pb-2.5 focus-within:border-indigo-600 transition bg-white">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-indigo-500">E-mail</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              placeholder="example@email.com" />
          </div>

          {/* Password */}
          <div className="relative border-2 border-slate-200 rounded-2xl px-4 pt-3 pb-2.5 focus-within:border-indigo-400 transition bg-white">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-slate-500">Password</label>
            <div className="flex items-center gap-2">
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                placeholder="Your Password" />
              <button type="button" onClick={() => setShow(!show)} className="text-slate-400 hover:text-slate-700 flex-shrink-0">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded border-2 border-slate-300 bg-white flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-500">Remember me</span>
            </label>
            <button type="button" className="text-xs font-semibold text-indigo-500 hover:text-indigo-700">
              Forgot Password?
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 text-center">
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 text-white py-3.5 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[.98] transition disabled:opacity-70 flex items-center justify-center gap-2 text-sm">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400">or sign up with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social buttons (decorative for demo) */}
        <div className="flex items-center justify-center gap-4">
          {[
            { label: "G", color: "text-rose-500 border-rose-200 hover:bg-rose-50" },
            { label: "in", color: "text-blue-600 border-blue-200 hover:bg-blue-50" },
            { label: "🍎", color: "text-slate-900 border-slate-200 hover:bg-slate-50" },
          ].map(b => (
            <button key={b.label} type="button"
              className={`w-14 h-12 rounded-2xl border-2 ${b.color} font-bold text-sm transition flex items-center justify-center`}>
              {b.label}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-indigo-600 hover:underline">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { LexiconLoadingMark } from "./LexiconLogo";

const LETTERS = ["L", "E", "X", "I", "C", "O", "N"];

const STATUS_MESSAGES = [
  "Initializing contract engine...",
  "Loading clause detection models...",
  "Calibrating risk scoring...",
  "Preparing analysis workspace...",
  "Mounting jurisdiction library...",
  "System ready.",
];

export function LoadingScreen({ exiting }: { exiting: boolean }) {
  const [pct, setPct] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    // Drive the percentage counter over 6s
    const totalMs = 6000;
    const interval = 60;
    let elapsed = 0;

    const tick = setInterval(() => {
      elapsed += interval;
      const raw = elapsed / totalMs;
      // ease-in-out curve
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      setPct(Math.min(100, Math.round(eased * 100)));
      if (elapsed >= totalMs) clearInterval(tick);
    }, interval);

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    // Cycle status messages every ~950ms
    const delay = 950;
    const t = setInterval(() => {
      setStatusIdx((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, delay);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-neo-bg overflow-hidden flex flex-col ${
        exiting ? "loading-screen-exit" : ""
      }`}
    >
      {/* Top accent bar */}
      <div className="h-2 bg-neo-black flex-shrink-0">
        <div
          className="h-full bg-neo-accent transition-none"
          style={{ width: `${pct}%`, transition: "width 60ms linear" }}
        />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-3 border-b-4 border-black flex-shrink-0 neo-dots">
        <div className="flex items-center gap-3">
          <LexiconLoadingMark size={32} />
          <span className="neo-label text-xs text-black/60">LEXICON SYSTEM BOOT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neo-accent animate-blink" />
          <span className="neo-label text-xs text-black/60">LOADING</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Letters */}
        <div className="flex items-end gap-1 sm:gap-2 mb-5">
          {LETTERS.map((letter, i) => (
            <span
              key={letter}
              className="loading-letter font-bold text-[clamp(3.5rem,11vw,8rem)] tracking-tighter leading-none select-none text-black"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Red underline that draws in */}
        <div className="w-[min(90vw,680px)] h-[6px] bg-black/10 overflow-hidden mb-6">
          <div className="h-full bg-neo-accent loading-underline" style={{ width: 0 }} />
        </div>

        {/* Tagline */}
        <p
          className="neo-label tracking-[0.26em] text-sm text-black/50 mb-10 animate-fade-in"
          style={{ animationDelay: "1s", opacity: 0, animationFillMode: "forwards" }}
        >
          CONTRACT INTELLIGENCE FOR FOUNDERS
        </p>

        {/* Big percentage */}
        <div className="flex items-end gap-4 mb-6">
          <span className="font-bold text-[clamp(3rem,10vw,7rem)] leading-none tabular-nums text-black">
            {String(pct).padStart(2, "0")}
          </span>
          <span className="font-bold text-3xl text-black/40 mb-2">%</span>
        </div>

        {/* Status message */}
        <div className="border-4 border-black bg-white px-6 py-3 shadow-neo-sm min-w-[280px] text-center">
          <span className="neo-label text-xs text-black/70">
            {STATUS_MESSAGES[statusIdx]}
          </span>
        </div>
      </div>

      {/* Bottom progress bar (thick) */}
      <div className="flex-shrink-0">
        <div className="h-3 bg-black/10 border-t-4 border-black overflow-hidden">
          <div
            className="h-full bg-neo-black"
            style={{ width: `${pct}%`, transition: "width 60ms linear" }}
          />
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t-4 border-black/10 neo-dots">
          <span className="neo-label text-[10px] text-black/40">
            INITIALIZING WORKSPACE
          </span>
          <div className="flex items-center gap-3">
            <span className="neo-label text-[10px] text-black/40">MAY 2026</span>
            <span className="neo-label text-[10px] text-black/40">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Decorative rotating mark */}
      <div
        className="absolute top-20 right-16 hidden md:block animate-spin-slow select-none text-5xl text-black/10"
        aria-hidden
      >
        ✦
      </div>
      <div
        className="absolute bottom-32 left-12 hidden md:block w-14 h-14 border-4 border-neo-black bg-neo-accent/20"
        style={{ transform: "rotate(-12deg)" }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 right-8 hidden lg:block w-8 h-8 bg-neo-accent border-4 border-black"
        style={{ transform: "rotate(20deg) translateY(-50%)" }}
        aria-hidden
      />
    </div>
  );
}

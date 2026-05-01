"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  prefix?: string;
  target: number;
  suffix?: string;
  decimals?: number;
  label: string;
  desc: string;
  highlight?: boolean;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CounterStat({
  prefix = "",
  target,
  suffix = "",
  decimals = 0,
  label,
  desc,
  highlight = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(frame);
      else setCount(target);
    };
    requestAnimationFrame(frame);
  }, [started, target, decimals]);

  const display =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <div
      ref={ref}
      className={`p-8 border-b-4 md:border-b-0 md:border-r-4 border-black last:border-0 ${
        highlight ? "bg-neo-secondary/30" : "bg-white"
      }`}
    >
      <div className="font-bold text-5xl text-neo-accent mb-3 tabular-nums">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="font-bold text-base mb-2">{label}</div>
      <p className="font-bold text-sm text-black/60 leading-relaxed">{desc}</p>
    </div>
  );
}

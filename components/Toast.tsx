"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  show: boolean;
  message: string;
  sub?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ show, message, sub, onClose, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 350); }, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-4 border-4 border-black bg-neo-secondary shadow-neo-md px-5 py-4 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-8 bg-neo-black border-2 border-black flex items-center justify-center flex-shrink-0">
        <CheckCircle strokeWidth={3} size={16} className="text-neo-secondary" />
      </div>
      <div>
        <div className="font-bold text-sm text-black uppercase tracking-wide">{message}</div>
        {sub && <div className="font-bold text-xs text-black/60 mt-0.5">{sub}</div>}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 350); }}
        className="ml-2 w-7 h-7 border-2 border-black bg-black/10 flex items-center justify-center hover:bg-black/20 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X strokeWidth={3} size={12} />
      </button>
    </div>
  );
}

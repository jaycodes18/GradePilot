"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { ThemeProvider } from "./ThemeContext";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    const seen = sessionStorage.getItem("lex:seen");
    if (seen) {
      setPhase("done");
      return;
    }
    // Show loading screen for ~6.2s then slide it out over 0.55s
    const exit = setTimeout(() => setPhase("exiting"), 6200);
    const done = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("lex:seen", "1");
    }, 6800);
    return () => {
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, []);

  return (
    <ThemeProvider>
      {phase !== "done" && <LoadingScreen exiting={phase === "exiting"} />}
      <div style={{ visibility: phase === "done" ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}

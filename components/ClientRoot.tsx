"use client";

import { ThemeProvider } from "./ThemeContext";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

"use client";

import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

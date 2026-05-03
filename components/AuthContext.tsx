"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type GUser = {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials-based
  createdAt: string;
};

type AuthCtx = {
  user: GUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("gp:session");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
    setLoading(false);
  }, []);

  function save(u: GUser) {
    localStorage.setItem("gp:session", JSON.stringify(u));
    setUser(u);
  }

  async function login(email: string, password: string) {
    await delay(600);
    const raw = localStorage.getItem(`gp:user:${email.toLowerCase()}`);
    if (!raw) return { ok: false, error: "No account found. Sign up first." };
    const stored = JSON.parse(raw);
    if (stored.password !== btoa(password)) return { ok: false, error: "Incorrect password." };
    save(stored.user);
    return { ok: true };
  }

  async function signup(name: string, email: string, password: string) {
    await delay(700);
    const key = `gp:user:${email.toLowerCase()}`;
    if (localStorage.getItem(key)) return { ok: false, error: "Email already registered. Log in instead." };
    const u: GUser = {
      id: crypto.randomUUID(), name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: name.trim().slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify({ user: u, password: btoa(password) }));
    save(u);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem("gp:session");
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

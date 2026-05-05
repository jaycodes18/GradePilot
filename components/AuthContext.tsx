"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type GUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: () => {},
});

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.trim().slice(0, 2) || "?").toUpperCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("gp:session");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as GUser;
        const normalized: GUser = {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          avatar: parsed.avatar || initialsFromName(parsed.name),
          createdAt: parsed.createdAt || new Date().toISOString(),
        };
        setUser(normalized);
      } catch {
        /* ignore */
      }
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
    const stored = JSON.parse(raw) as { user: GUser; password?: string };
    if (!stored.password)
      return {
        ok: false,
        error: "No password on file for this email. Sign up with email and password.",
      };
    if (stored.password !== btoa(password)) return { ok: false, error: "Incorrect password." };
    const u: GUser = {
      id: stored.user.id,
      name: stored.user.name,
      email: stored.user.email,
      avatar: stored.user.avatar || initialsFromName(stored.user.name),
      createdAt: stored.user.createdAt || new Date().toISOString(),
    };
    save(u);
    return { ok: true };
  }

  async function signup(name: string, email: string, password: string) {
    await delay(700);
    const key = `gp:user:${email.toLowerCase()}`;
    if (localStorage.getItem(key)) return { ok: false, error: "Email already registered. Log in instead." };
    const u: GUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: initialsFromName(name.trim()),
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

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

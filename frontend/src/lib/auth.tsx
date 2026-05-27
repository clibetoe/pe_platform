"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { authApi } from "./api";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type JwtPayload = {
  exp?: number;
  role?: User["role"];
  full_name?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

function userFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.full_name || !payload.role) return null;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

  const parts = payload.full_name.trim().split(/\s+/);
  const first_name = parts[0] ?? "";
  const last_name = parts.slice(1).join(" ");

  return {
    id: "",
    email: "",
    first_name,
    last_name,
    full_name: payload.full_name,
    role: payload.role,
    school: null,
    school_name: null,
    avatar: null,
    created_at: "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const cachedUser = userFromToken(token);
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
      fetchMe();
      return;
    }

    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    Cookies.set("access_token", data.access, { expires: 1 });
    Cookies.set("refresh_token", data.refresh, { expires: 7 });
    setUser(data.user);
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
    window.location.href = "/login";
  };

  const isRole = (...roles: string[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

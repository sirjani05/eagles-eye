"use client";

import { useCallback, useContext, createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, logout, getSession } from "@/lib/api/authApi";
import type { User, UserRole } from "@/types/index";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    full_name?: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refetch = useCallback(async () => {
    try {
      const { data } = await getSession();
      setUser(data ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refetch();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [refetch]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await login({ email, password });
      if (error) throw new Error(error.message);
      setUser(data ?? null);
      router.push("/dashboard");
    },
    [router]
  );

  const handleRegister = useCallback(
    async ({ email, password, full_name, role }: { email: string; password: string; full_name?: string; role?: string }) => {
      const { data, error } = await register({
        email,
        password,
        full_name,
        role: (role as UserRole) || "learner",
      });
      if (error) throw new Error(error.message);
      setUser(data ?? null);
      router.push("/dashboard");
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

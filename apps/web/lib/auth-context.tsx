"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@talenthub/shared";
import { UserRole } from "@talenthub/shared";
import { ApiError, authApi, clearTokens, setTokens } from "@/lib/api";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string, role?: UserRole, intent?: "login" | "register") => Promise<void>;
  loginWithGoogleDev: (
    data: { email: string; name: string; role?: UserRole },
    intent?: "login" | "register",
  ) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser({
        id: me.id,
        email: me.email,
        name: me.name,
        role: me.role as AuthUser["role"],
        avatarUrl: me.avatarUrl ?? null,
      });
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    void refresh().finally(() => setLoading(false));
  }, [refresh]);

  const redirectByRole = useCallback(
    (role: AuthUser["role"]) => {
      if (role === UserRole.Employer) {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    },
    [router],
  );

  const applyAuth = useCallback((res: { user: AuthUser; tokens: { accessToken: string; refreshToken: string } }) => {
    setTokens(res.tokens.accessToken, res.tokens.refreshToken);
    setUser(res.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      applyAuth(res);
      redirectByRole(res.user.role);
    },
    [applyAuth, redirectByRole],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string, role: UserRole = UserRole.Candidate, intent: "login" | "register" = "login") => {
      const res = await authApi.googleLogin({ idToken, role });
      applyAuth(res);
      if (intent === "register" && res.user.role === UserRole.Candidate) {
        router.push("/candidate/resume/new");
      } else {
        redirectByRole(res.user.role);
      }
    },
    [applyAuth, redirectByRole, router],
  );

  const loginWithGoogleDev = useCallback(
    async (
      data: { email: string; name: string; role?: UserRole },
      intent: "login" | "register" = "login",
    ) => {
      const res = await authApi.googleDevLogin({
        email: data.email,
        name: data.name,
        role: data.role ?? UserRole.Candidate,
      });
      applyAuth(res);
      if (intent === "register" && res.user.role === UserRole.Candidate) {
        router.push("/candidate/resume/new");
      } else {
        redirectByRole(res.user.role);
      }
    },
    [applyAuth, redirectByRole, router],
  );

  const register = useCallback(
    async (data: { email: string; password: string; name: string; role: UserRole }) => {
      const res = await authApi.register(data);
      applyAuth(res);
      if (res.user.role === UserRole.Candidate) {
        router.push("/candidate/resume/new");
      } else {
        redirectByRole(res.user.role);
      }
    },
    [applyAuth, redirectByRole, router],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, loginWithGoogle, loginWithGoogleDev, register, logout, refresh }),
    [user, loading, login, loginWithGoogle, loginWithGoogleDev, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      router.replace("/auth/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(auth.user.role as UserRole)) {
      router.replace("/");
    }
  }, [auth.loading, auth.user, allowedRoles, router]);

  return auth;
}

export { ApiError };

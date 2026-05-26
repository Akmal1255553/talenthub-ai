"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@talenthub/shared";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/lib/auth-context";
import { formatApiError } from "@/lib/api-errors";

function LoginForm() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      window.location.href =
        user.role === UserRole.Employer ? "/employer/dashboard" : "/candidate/dashboard";
    }
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(formatApiError(err, "Ошибка входа"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Перенаправление...</p>
      </div>
    );
  }

  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center px-4 py-12">
      <div className="animate-scale-in w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white">
              TH
            </div>
            <span className="text-xl font-bold">TalentHub AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Вход в аккаунт</h1>
          <p className="mt-2 text-sm text-muted-foreground">Поиск работы и управление резюме</p>
        </div>

        {searchQuery && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-[var(--brand)]/25 bg-[var(--brand-soft)] p-4">
            <Search className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--brand)]">После входа продолжим поиск</p>
              <p className="mt-1 text-sm">{searchQuery}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="shine" size="lg" className="mt-6 w-full" disabled={submitting}>
            {submitting ? "Вход..." : "Войти"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <GoogleSignInButton mode="login" />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              href={searchQuery ? `/auth/register?q=${encodeURIComponent(searchQuery)}` : "/auth/register"}
              className="font-semibold text-[var(--brand)] hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-mesh flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

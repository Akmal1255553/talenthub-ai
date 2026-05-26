"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getJobBySlug, UserRole } from "@talenthub/shared";
import { BriefcaseBusiness, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/lib/auth-context";
import { formatApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const searchParams = useSearchParams();
  const jobSlug = searchParams.get("job");
  const searchQuery = searchParams.get("q");

  const { register, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.Candidate);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const job = jobSlug ? getJobBySlug(jobSlug) : undefined;
  const intentLabel = job?.title ?? searchQuery ?? null;

  useEffect(() => {
    if (!loading && user) {
      window.location.href =
        user.role === UserRole.Employer ? "/employer/dashboard" : "/candidate/resume/new";
    }
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ name, email, password, role });
    } catch (err) {
      setError(formatApiError(err, "Ошибка регистрации"));
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
      <div className="animate-scale-in w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white">
              TH
            </div>
            <span className="text-xl font-bold">TalentHub AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Создать аккаунт</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {role === UserRole.Candidate
              ? "После регистрации — профессиональный мастер резюме с AI"
              : "Разместите вакансии и найдите кандидатов с AI"}
          </p>
        </div>

        {intentLabel && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-[var(--brand)]/25 bg-[var(--brand-soft)] p-4">
            <Search className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--brand)]">Ваш запрос</p>
              <p className="mt-1 text-sm leading-relaxed">{intentLabel}</p>
              {job && (
                <Link
                  href={`/jobs/${job.slug}`}
                  className="mt-2 inline-block text-sm font-medium text-[var(--brand)] hover:underline"
                >
                  Вернуться к вакансии →
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <div className="mb-5 grid grid-cols-2 gap-3">
            {[
              { value: UserRole.Candidate, label: "Ищу работу", icon: UserRound },
              { value: UserRole.Employer, label: "Нанимаю", icon: BriefcaseBusiness },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                  role === opt.value
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-border hover:border-[var(--brand)]/40",
                )}
              >
                <opt.icon
                  className={cn("size-6", role === opt.value ? "text-[var(--brand)]" : "text-muted-foreground")}
                />
                <span className="text-sm font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алексей"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль (мин. 8 символов)</Label>
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
            {submitting ? "Создание..." : "Зарегистрироваться"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <GoogleSignInButton role={role} mode="register" />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              href={searchQuery ? `/auth/login?q=${encodeURIComponent(searchQuery)}` : "/auth/login"}
              className="font-semibold text-[var(--brand)] hover:underline"
            >
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-mesh flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

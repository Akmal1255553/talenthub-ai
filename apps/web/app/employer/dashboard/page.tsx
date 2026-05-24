"use client";

import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  Bot,
  Plus,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { UserRole } from "@talenthub/shared";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRequireAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Активные вакансии", value: "12", note: "3 с продвижением", icon: BriefcaseBusiness, trend: "+2" },
  { label: "Новые отклики", value: "48", note: "AI-скоринг в очереди", icon: UsersRound, trend: "+18" },
  { label: "Конверсия", value: "14%", note: "Отклик → интервью", icon: TrendingUp, trend: "+3%" },
];

export default function EmployerDashboardPage() {
  const auth = useRequireAuth([UserRole.Employer]);

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white">
              TH
            </Link>
            <div>
              <h1 className="text-lg font-bold">Кабинет работодателя</h1>
              <p className="text-xs text-muted-foreground">{auth.user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="brand" size="sm">
              <Plus className="size-4" />
              Вакансия
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <article
              key={stat.label}
              className={cn(
                "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up",
                i === 0 && "delay-100",
                i === 1 && "delay-200",
                i === 2 && "delay-300",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                  <stat.icon className="size-5" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {stat.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">{stat.value}</p>
              <p className="font-medium">{stat.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            { icon: BriefcaseBusiness, label: "Управление вакансиями", desc: "Публикация, редактирование, продвижение" },
            { icon: UsersRound, label: "База кандидатов", desc: "AI-скоринг и фильтры по резюме" },
            { icon: BarChart3, label: "Аналитика найма", desc: "Воронка, конверсия, время закрытия" },
          ].map((item, i) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-[var(--brand)]/40 hover:shadow-lg animate-fade-in-up",
                `delay-${(i + 1) * 100}`,
              )}
            >
              <item.icon className="size-6 text-[var(--brand)]" />
              <h3 className="mt-4 font-semibold">{item.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </button>
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl bg-foreground p-8 text-background md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-300">
                <Bot className="size-5" />
                <span className="text-sm font-medium">AI Hiring Agent</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold">Подбор кандидатов с Business-подпиской</h2>
              <p className="mt-2 max-w-xl text-white/80">
                Автоматический скрининг резюме, ранжирование откликов и рекомендации по вакансиям.
              </p>
            </div>
            <Button size="lg" className="shrink-0 bg-white text-foreground hover:bg-white/90">
              Подключить Business
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

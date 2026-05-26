"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { JobVacancy } from "@talenthub/shared";
import { MapPin, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    jobsApi
      .list(query.trim() || undefined)
      .then((data) => {
        if (active) setJobs(data.items);
      })
      .catch(() => {
        if (active) setJobs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="bg-mesh min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white">
              TH
            </div>
            TalentHub AI
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="brandSoft" size="sm" asChild>
              <Link href="/auth/login">Войти</Link>
            </Button>
            <Button variant="brand" size="sm" asChild>
              <Link href="/auth/register">Регистрация</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Каталог вакансий</h1>
        <p className="mt-2 text-muted-foreground">
          {jobs.length} вакансий · нажмите на карточку для полного описания
        </p>

        <div className="relative mt-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Должность, компания, навык"
            className="h-12 pl-10"
            aria-label="Поиск вакансий"
          />
        </div>

        <div className="mt-8 grid gap-4">
          {loading && <p className="py-8 text-center text-muted-foreground">Р—Р°РіСЂСѓР·РєР°...</p>}
          {!loading && jobs.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">Р’Р°РєР°РЅСЃРёРё РЅРµ РЅР°Р№РґРµРЅС‹</p>
          )}
          {!loading && jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className={cn(
                "block cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-sm",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)]/40 hover:shadow-lg",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{job.company}</span>
                    {job.verified && <ShieldCheck className="size-4 text-[var(--brand)]" />}
                  </p>
                  {job.salary && <p className="mt-2 font-medium">{job.salary}</p>}
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {job.location}
                  </p>
                </div>
                {job.match != null && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {job.match}%
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--brand)]">Подробнее →</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-mesh flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}

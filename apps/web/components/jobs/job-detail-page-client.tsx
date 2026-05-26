"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { JobVacancy } from "@talenthub/shared";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface JobDetailPageClientProps {
  job: JobVacancy;
}

function JobDetailInner({ job }: JobDetailPageClientProps) {
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get("from") === "dashboard";

  const backHref = fromDashboard ? "/candidate/dashboard" : "/jobs";
  const backLabel = fromDashboard ? "К дашборду" : "Все вакансии";

  return (
    <div className="bg-mesh flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white">
              TH
            </div>
            <span className="font-bold">TalentHub AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="brandSoft" size="sm" asChild>
              <Link href="/auth/login">Войти</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        <JobDetailView job={job} backHref={backHref} backLabel={backLabel} />
      </main>
    </div>
  );
}

export function JobDetailPageClient({ job }: JobDetailPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-mesh flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      }
    >
      <JobDetailInner job={job} />
    </Suspense>
  );
}

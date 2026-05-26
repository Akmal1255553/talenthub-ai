"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJobBySlug, UserRole } from "@talenthub/shared";
import { AISidebar } from "@/components/dashboard/ai-sidebar";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/auth-context";

function ChatContent() {
  const searchParams = useSearchParams();
  const jobSlug = searchParams.get("job");
  const job = jobSlug ? getJobBySlug(jobSlug) : undefined;

  const contextHint = job
    ? `Пользователь открыл чат со страницы вакансии «${job.title}» (${job.company}). Зарплата: ${job.salary ?? "не указана"}. Локация: ${job.location}. Помоги оценить отклик и подготовку.`
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-mesh">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Button variant="ghost" size="icon" asChild aria-label="Назад">
          <Link href={job ? `/jobs/${job.slug}` : "/candidate/dashboard"}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold">AI Career Agent</h1>
          {job && (
            <p className="truncate text-xs text-muted-foreground">
              Вакансия: {job.title}
            </p>
          )}
        </div>
        {job && (
          <Button variant="brandSoft" size="sm" asChild>
            <Link href={`/jobs/${job.slug}`}>Вакансия</Link>
          </Button>
        )}
      </header>
      <div className="flex-1 p-4">
        <AISidebar contextHint={contextHint} className="h-[calc(100vh-120px)]" />
      </div>
    </div>
  );
}

export default function CandidateChatPage() {
  useRequireAuth([UserRole.Candidate]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-mesh">
          <p className="text-muted-foreground">Загрузка чата...</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

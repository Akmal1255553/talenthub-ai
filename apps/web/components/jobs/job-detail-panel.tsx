"use client";

import Link from "next/link";
import type { JobVacancy } from "@talenthub/shared";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { cn } from "@/lib/utils";

interface JobDetailPanelProps {
  job: JobVacancy | null;
  onClose: () => void;
  onAskAi?: (job: JobVacancy) => void;
}

/** @deprecated Prefer navigation to /jobs/[slug] */
export function JobDetailPanel({ job, onClose, onAskAi }: JobDetailPanelProps) {
  if (!job) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-pointer bg-black/40 backdrop-blur-sm animate-fade-in lg:hidden"
        onClick={onClose}
        aria-label="Закрыть"
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-2xl animate-fade-in-up",
          "lg:static lg:z-auto lg:max-w-none lg:animate-none lg:rounded-2xl lg:border lg:shadow-lg",
        )}
      >
        <div className="flex justify-end border-b border-border p-2 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>
        </div>

        <JobDetailView
          job={job}
          backHref={`/jobs/${job.slug}`}
          backLabel="На страницу вакансии"
          onAskAi={onAskAi}
        />

        <div className="border-t border-border p-4 lg:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/jobs/${job.slug}`}>Открыть на отдельной странице</Link>
          </Button>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { JOB_VACANCIES, type JobVacancy } from "@talenthub/shared";
import { ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filterTabs = [
  "Для вас",
  "Удалённая работа",
  "Без опыта",
  "IT",
  "Офис",
];

interface JobCardsProps {
  onAskAiAboutJob?: (job: JobVacancy) => void;
}

export function JobCards({ onAskAiAboutJob }: JobCardsProps) {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("Для вас");

  const filteredJobs = useMemo(
    () =>
      JOB_VACANCIES.filter((job) => {
        if (activeFilter === "Для вас") return true;
        if (activeFilter === "Удалённая работа") return job.location.toLowerCase().includes("удал");
        if (activeFilter === "Без опыта")
          return job.experience?.includes("Без опыта") || job.experience?.includes("Junior");
        if (activeFilter === "IT")
          return job.skills.some((s) => ["React", "Python", "Golang", "TypeScript"].includes(s));
        return true;
      }),
    [activeFilter],
  );

  const toggleSave = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const openJob = (job: JobVacancy) => {
    router.push(`/jobs/${job.slug}?from=dashboard`);
  };

  return (
    <section className="space-y-6 min-w-0">
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveFilter(label)}
            className={cn(
              "h-10 cursor-pointer rounded-full px-5 text-sm font-semibold transition-all duration-200",
              activeFilter === label
                ? "bg-foreground text-background shadow-md"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <article
            key={job.id}
            role="link"
            tabIndex={0}
            onClick={() => openJob(job)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openJob(job);
              }
            }}
            className={cn(
              "cursor-pointer rounded-2xl border bg-card px-6 py-6 shadow-sm transition-all duration-300",
              "hover:-translate-y-0.5 hover:border-[var(--brand)]/35 hover:shadow-lg animate-fade-in-up",
              index === 0 && "delay-100",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-3">
                  <h2 className="text-xl font-semibold leading-tight">{job.title}</h2>
                  {job.match != null && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {job.match}%
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {job.salary && <span className="font-medium">{job.salary}</span>}
                  {job.experience && <Pill>{job.experience}</Pill>}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
                  <span className="font-medium">{job.company}</span>
                  {job.verified && <ShieldCheck className="size-4 text-[var(--brand)]" />}
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>

                <p className="mt-4 text-sm font-semibold text-[var(--brand)]">
                  Открыть полное описание →
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  className={cn(
                    "cursor-pointer rounded-lg p-2 transition-colors hover:bg-secondary",
                    savedJobs.has(job.id) && "text-[var(--brand)]",
                  )}
                  onClick={(e) => toggleSave(job.id, e)}
                  aria-label="В избранное"
                >
                  <Heart className={cn("size-5", savedJobs.has(job.id) && "fill-current")} />
                </button>
              </div>
            </div>

            <div
              className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Button variant="shine" size="sm" asChild>
                <Link href={`/jobs/${job.slug}?from=dashboard`}>
                  <ExternalLink className="size-4" />
                  Подробнее
                </Link>
              </Button>
              {onAskAiAboutJob && (
                <Button variant="brandSoft" size="sm" onClick={() => onAskAiAboutJob(job)}>
                  Спросить AI
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="rounded-lg px-2.5 py-1 text-sm font-medium">
      {children}
    </Badge>
  );
}

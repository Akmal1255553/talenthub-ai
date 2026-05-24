"use client";

import { useState } from "react";
import { Eye, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  company: string;
  verified?: boolean;
  online?: boolean;
  location: string;
  salary?: string;
  experience?: string;
  paymentInfo?: string;
  description?: string;
  primaryOnly?: boolean;
  match?: number;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "[SMOKE] HH auto publish 20260523-085327",
    company: "OOO BROJECT DYNAMICS",
    verified: true,
    online: true,
    location: "Ташкент",
    salary: "15000000 so'm за месяц, на руки",
    experience: "Без опыта",
    primaryOnly: true,
    match: 91,
  },
  {
    id: "2",
    title: "Backend Python Developer | Python-разработчик (Backend)",
    company: "OOO INVEST TECH SYSTEM",
    verified: true,
    location: "Ташкент, Мирзо-Улугбекский район, улица Шахриабад, 128",
    salary: "1000 - 2000 $ за месяц, на руки",
    experience: "Опыт 3-6 лет",
    paymentInfo: "Выплаты: раз в месяц",
    match: 88,
  },
  {
    id: "3",
    title: "Strong Junior Golang developer",
    company: "ЧАКБ ДАВР БАНК",
    verified: true,
    location: "Ташкент",
    experience: "Опыт 1-3 года",
    match: 76,
  },
  {
    id: "4",
    title: "Frontend Developer React / Next.js",
    company: "TalentHub Labs",
    verified: true,
    online: true,
    location: "Удалённо",
    salary: "2000 - 3500 $ за месяц",
    experience: "Опыт 3-6 лет",
    paymentInfo: "Можно из дома",
    match: 94,
  },
];

const filterTabs = [
  "Для вас",
  "У дома",
  "Подработка",
  "Вахта",
  "от 16 лет",
  "Удалённая работа",
  "Стажировка",
];

export function JobCards() {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("Для вас");

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveFilter(label)}
            className={cn(
              "h-10 rounded-full px-5 text-sm font-semibold transition-all duration-200",
              activeFilter === label
                ? "bg-foreground text-background shadow-md scale-[1.02]"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <article
            key={job.id}
            className={cn(
              "group rounded-2xl border border-border bg-white px-6 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)]/35 hover:shadow-lg hover:shadow-[var(--brand)]/8 animate-fade-in-up",
              index === 0 && "delay-100",
              index === 1 && "delay-200",
              index === 2 && "delay-300",
              index === 3 && "delay-400",
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-3">
                  <h2 className="text-xl font-semibold leading-tight md:text-2xl">{job.title}</h2>
                  {job.match && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {job.match}% match
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-base md:text-lg">
                  {job.salary && <span className="font-medium">{job.salary}</span>}
                  {job.experience && <Pill>{job.experience}</Pill>}
                  {job.paymentInfo && <Pill>{job.paymentInfo}</Pill>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-sm uppercase tracking-wide">
                  <span>{job.company}</span>
                  {job.verified && (
                    <ShieldCheck className="size-4 fill-[var(--brand)]/15 text-[var(--brand)]" />
                  )}
                  {job.online && (
                    <span className="rounded-full border border-emerald-500 px-1.5 py-0.5 text-[10px] normal-case font-medium text-emerald-600">
                      Онлайн
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{job.location}</p>

                {job.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{job.description}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="shine" size="lg">
                    Откликнуться
                  </Button>
                  {!job.primaryOnly && (
                    <Button variant="brandSoft" size="lg">
                      Связаться
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-4 pt-1 text-muted-foreground">
                <button
                  type="button"
                  className="rounded-lg p-1.5 transition-all duration-200 hover:bg-secondary hover:text-[var(--brand)]"
                  aria-label="Скрыть вакансию"
                >
                  <Eye className="size-5" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-lg p-1.5 transition-all duration-200 hover:bg-secondary",
                    savedJobs.has(job.id)
                      ? "text-[var(--brand)] scale-110"
                      : "hover:text-[var(--brand)]",
                  )}
                  onClick={() => toggleSave(job.id)}
                  aria-label="Добавить в избранное"
                >
                  <Heart
                    className={cn(
                      "size-5 transition-transform duration-200",
                      savedJobs.has(job.id) && "fill-current scale-110",
                    )}
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="rounded-lg bg-secondary px-2.5 py-1 text-sm font-medium">
      {children}
    </Badge>
  );
}

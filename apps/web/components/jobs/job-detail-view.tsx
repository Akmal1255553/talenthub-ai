"use client";

import Link from "next/link";
import type { JobVacancy } from "@talenthub/shared";
import {
  ArrowLeft,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobDetailViewProps {
  job: JobVacancy;
  backHref?: string;
  backLabel?: string;
  onAskAi?: (job: JobVacancy) => void;
  showActions?: boolean;
}

export function JobDetailView({
  job,
  backHref = "/candidate/dashboard",
  backLabel = "К списку вакансий",
  onAskAi,
  showActions = true,
}: JobDetailViewProps) {
  return (
    <article className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border px-4 py-5 md:px-8 md:py-6">
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        )}

        <h1 className="text-2xl font-bold leading-tight md:text-3xl">{job.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Building2 className="size-4 text-muted-foreground" />
            {job.company}
          </span>
          {job.verified && (
            <span className="flex items-center gap-1 text-[var(--brand)]">
              <ShieldCheck className="size-4" />
              Проверенный работодатель
            </span>
          )}
          {job.match != null && (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {job.match}% совпадение
            </Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.salary && <InfoChip>{job.salary}</InfoChip>}
          {job.experience && <InfoChip>{job.experience}</InfoChip>}
          {job.employmentType && <InfoChip>{job.employmentType}</InfoChip>}
          {job.schedule && <InfoChip>{job.schedule}</InfoChip>}
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {job.location}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          Опубликовано {new Date(job.publishedAt).toLocaleDateString("ru-RU")}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {/* Premium visual About Company card */}
        <section className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] font-bold text-xl">
              {job.company ? job.company.charAt(0) : "C"}
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {job.company}
                {job.verified && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="size-3.5 mr-1" />
                    Проверено
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">Работодатель на TalentHub AI</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {job.companyDescription || `${job.company} — современная и динамично развивающаяся компания, стремящаяся к инновациям и росту. Мы создаем лучшие условия для работы нашей команды и предлагаем отличные возможности для карьерного и профессионального развития.`}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Описание вакансии</h2>
          <p className="mt-2 leading-relaxed whitespace-pre-line">{job.description}</p>
        </section>

        <SectionList title="Обязанности" items={job.responsibilities} />
        <SectionList title="Требования" items={job.requirements} />
        <SectionList title="Условия и бонусы" items={job.benefits} />

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Навыки</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-lg px-3 py-1">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Навыки не указаны</span>
            )}
          </div>
        </section>
      </div>

      {showActions && (
        <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-border bg-card/95 p-4 backdrop-blur md:px-8 md:py-5">
          <Button variant="shine" size="lg" className="min-w-[140px] flex-1" asChild>
            <Link href={`/auth/register?job=${encodeURIComponent(job.slug)}`}>Откликнуться</Link>
          </Button>
          <Button variant="brandSoft" size="lg" className="min-w-[140px] flex-1" asChild>
            <Link href={`/candidate/chat?job=${encodeURIComponent(job.slug)}`}>
              <Bot className="size-5" />
              Спросить AI
            </Link>
          </Button>
          {onAskAi && (
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => onAskAi(job)}>
              AI в дашборде
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg bg-[var(--brand-soft)] px-3 py-1.5 text-sm font-medium text-[var(--brand)]">
      {children}
    </span>
  );
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  if (!items) return null;
  const filtered = items.filter(item => item && item.trim().length > 0);
  if (!filtered.length) return null;
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">
        {filtered.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

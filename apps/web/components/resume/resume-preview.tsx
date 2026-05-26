"use client";

import type { ResumeContent } from "@talenthub/shared";
import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

function formatPeriod(start: string, end?: string, current?: boolean) {
  const endLabel = current || !end ? "настоящее время" : end;
  return `${start} — ${endLabel}`;
}

export type ResumeTemplate = "modern" | "classic" | "executive";

const templateStyles: Record<
  ResumeTemplate,
  { article: string; header: string; accent: string; sectionTitle: string }
> = {
  modern: {
    article: "",
    header: "border-b border-slate-200 pb-6",
    accent: "text-[var(--brand)]",
    sectionTitle: "text-xs font-bold uppercase tracking-widest text-slate-500",
  },
  classic: {
    article: "font-serif",
    header: "border-b-2 border-slate-800 pb-6",
    accent: "text-slate-800",
    sectionTitle: "text-sm font-semibold text-slate-800 border-b border-slate-300 pb-1",
  },
  executive: {
    article: "",
    header: "-mx-8 -mt-8 mb-6 rounded-t-2xl bg-slate-900 px-8 pb-6 pt-8 text-white md:-mx-10 md:-mt-10 md:px-10 md:pt-10",
    accent: "text-amber-300",
    sectionTitle: "text-xs font-bold uppercase tracking-widest text-slate-600",
  },
};

export function ResumePreview({
  content,
  className,
  template = "modern",
}: {
  content: ResumeContent;
  className?: string;
  template?: ResumeTemplate;
}) {
  const { personal } = content;
  const t = templateStyles[template];
  const isExecutive = template === "executive";

  return (
    <article
      className={cn(
        "resume-preview mx-auto w-full max-w-[210mm] rounded-2xl border border-border bg-white p-8 text-[13px] leading-relaxed text-slate-800 shadow-lg print:shadow-none dark:bg-white dark:text-slate-800 md:p-10",
        t.article,
        className,
      )}
    >
      <header className={t.header}>
        <h1
          className={cn(
            "text-2xl font-bold tracking-tight md:text-3xl",
            isExecutive ? "text-white" : "text-slate-900",
          )}
        >
          {personal.fullName || "Ваше имя"}
        </h1>
        <p className={cn("mt-1 text-lg font-medium", t.accent)}>
          {personal.desiredPosition || "Желаемая должность"}
        </p>

        <div
          className={cn(
            "mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm",
            isExecutive ? "text-slate-300" : "text-slate-600",
          )}
        >
          {personal.email && (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" />
              {personal.phone}
            </span>
          )}
          {personal.city && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {personal.city}
            </span>
          )}
        </div>

        {personal.salary && (
          <p className={cn("mt-3 text-sm font-medium", isExecutive ? "text-slate-200" : "text-slate-700")}>
            Желаемая зарплата: {personal.salary.amount.toLocaleString("ru-RU")} {personal.salary.currency}
            {personal.salary.period === "month" ? " / мес" : " / год"}
          </p>
        )}
      </header>

      {content.about && (
        <section className="mt-6">
          <h2 className={t.sectionTitle}>О себе</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{content.about}</p>
        </section>
      )}

      {content.experience.length > 0 && (
        <section className="mt-6">
          <h2 className={t.sectionTitle}>Опыт работы</h2>
          <ul className="mt-3 space-y-5">
            {content.experience.map((exp) => (
              <li key={exp.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                  <span className="text-xs text-slate-500">
                    {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">{exp.company}</p>
                {exp.description && <p className="mt-2 text-slate-700">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                    {exp.achievements.filter(Boolean).map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {content.education.length > 0 && (
        <section className="mt-6">
          <h2 className={t.sectionTitle}>Образование</h2>
          <ul className="mt-3 space-y-4">
            {content.education.map((edu) => (
              <li key={edu.id}>
                <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                <p className="text-sm text-slate-600">
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ""}
                </p>
                <p className="text-xs text-slate-500">{formatPeriod(edu.startDate, edu.endDate)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {content.skills.length > 0 && (
        <section className="mt-6">
          <h2 className={t.sectionTitle}>Навыки</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {content.languages.length > 0 && (
        <section className="mt-6">
          <h2 className={t.sectionTitle}>Языки</h2>
          <ul className="mt-2 space-y-1">
            {content.languages.map((lang) => (
              <li key={`${lang.name}-${lang.level}`} className="text-slate-700">
                {lang.name} — <span className="text-slate-500">{lang.level}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

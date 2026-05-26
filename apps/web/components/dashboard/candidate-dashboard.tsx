"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { JobVacancy } from "@talenthub/shared";
import { UserRole } from "@talenthub/shared";
import { Header, SearchPanel } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { JobCards } from "@/components/dashboard/job-cards";
import { AISidebar } from "@/components/dashboard/ai-sidebar";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { SubscriptionPlans } from "@/components/dashboard/subscription-plans";
import { applicationsApi } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth-context";

export function CandidateDashboard() {
  const auth = useRequireAuth([UserRole.Candidate]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiContext, setAiContext] = useState<string | undefined>();

  const handleAskAi = (job: JobVacancy) => {
    setAiContext(
      `Пользователь смотрит вакансию «${job.title}» в ${job.company}. Зарплата: ${job.salary ?? "не указана"}. Локация: ${job.location}. Кратко оцени, подходит ли junior/middle, и что улучшить в отклике.`,
    );
  };

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Header />
      <SearchPanel />

      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-10 pt-6 lg:grid-cols-[280px_1fr_340px] lg:px-8">
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="min-w-0 animate-fade-in-up">
          {(activeTab === "dashboard" || activeTab === "jobs" || activeTab === "saved") && (
            <JobCards onAskAiAboutJob={handleAskAi} />
          )}
          {activeTab === "analytics" && <AnalyticsCharts />}
          {activeTab === "subscription" && <SubscriptionPlans />}
          {activeTab === "applications" && <ApplicationsView />}
        </div>

        <div className="hidden lg:block">
          <AISidebar contextHint={aiContext} className="sticky top-[100px]" />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-2 lg:hidden">
        <p className="mb-2 text-center text-xs text-muted-foreground">AI-чат доступен на широком экране</p>
        <Link
          href="/candidate/chat"
          className="flex w-full items-center justify-center rounded-xl bg-[var(--brand)] py-3 text-sm font-semibold text-white"
        >
          Открыть AI-агент
        </Link>
      </div>
    </div>
  );
}

function ApplicationsView() {
  const [applications, setApplications] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      vacancy?: { title?: string; company?: { name?: string } | string };
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi
      .list()
      .then((data) => setApplications(data.items as typeof applications))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-bold">Отклики и приглашения</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-secondary/60 text-left text-sm text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Вакансия</th>
              <th className="px-6 py-4 font-medium">Компания</th>
              <th className="px-6 py-4 font-medium">Дата</th>
              <th className="px-6 py-4 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-6 py-8 text-center text-muted-foreground" colSpan={4}>
                  Загрузка...
                </td>
              </tr>
            )}
            {!loading && applications.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-muted-foreground" colSpan={4}>
                  Откликов пока нет
                </td>
              </tr>
            )}
            {!loading &&
              applications.map((application) => {
                const vacancy = application.vacancy;
                const company =
                  typeof vacancy?.company === "string" ? vacancy.company : vacancy?.company?.name ?? "Компания";
                const date = new Date(application.createdAt).toLocaleDateString("ru-RU");
                const position = vacancy?.title ?? "Вакансия";

                return (
                  <tr key={application.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-6 py-5 font-medium">{position}</td>
                    <td className="px-6 py-5">{company}</td>
                    <td className="px-6 py-5 text-muted-foreground">{date}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-sm font-medium text-[var(--brand)]">
                        {application.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

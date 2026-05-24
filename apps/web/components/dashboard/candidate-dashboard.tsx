"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header, SearchPanel } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { JobCards } from "@/components/dashboard/job-cards";
import { AIAssistant } from "@/components/dashboard/ai-assistant";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { SubscriptionPlans } from "@/components/dashboard/subscription-plans";
import { Button } from "@/components/ui/button";
import { UserRole } from "@talenthub/shared";
import { useRequireAuth } from "@/lib/auth-context";

export function CandidateDashboard() {
  const auth = useRequireAuth([UserRole.Candidate]);
  const [activeTab, setActiveTab] = useState("dashboard");

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="border-b border-border bg-white/80 px-4 py-2 md:px-8">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            На главную
          </Link>
        </Button>
      </div>

      <Header />
      <SearchPanel />

      <main className="mx-auto grid max-w-[1428px] grid-cols-1 gap-8 px-4 pb-10 pt-8 lg:grid-cols-[336px_1fr] lg:px-8">
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="min-w-0 animate-fade-in-up delay-200">
          {activeTab === "dashboard" && <JobCards />}
          {activeTab === "jobs" && <JobCards />}
          {activeTab === "saved" && <JobCards />}
          {activeTab === "analytics" && <AnalyticsCharts />}
          {activeTab === "subscription" && <SubscriptionPlans />}
          {activeTab === "applications" && <ApplicationsView />}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}

function ApplicationsView() {
  const applications = [
    ["[SMOKE] HH auto publish 20260523-085327", "OOO BROJECT DYNAMICS", "23 мая 2026", "На рассмотрении"],
    ["Backend Python Developer", "OOO INVEST TECH SYSTEM", "22 мая 2026", "Интервью"],
    ["Strong Junior Golang developer", "ЧАКБ ДАВР БАНК", "20 мая 2026", "Отклик отправлен"],
  ];

  return (
    <section className="animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
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
            {applications.map(([position, company, date, status]) => (
              <tr
                key={`${position}-${date}`}
                className="border-t border-border transition-colors duration-200 hover:bg-secondary/40"
              >
                <td className="px-6 py-5 font-medium">{position}</td>
                <td className="px-6 py-5">{company}</td>
                <td className="px-6 py-5 text-muted-foreground">{date}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-sm font-medium text-[var(--brand)]">
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

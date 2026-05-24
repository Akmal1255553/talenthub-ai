"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileText,
  Heart,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ setActiveTab }: SidebarProps) {
  return (
    <aside className="sticky top-[92px] h-fit w-[336px] space-y-4">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left transition-colors hover:text-[var(--brand)]"
          onClick={() => setActiveTab("analytics")}
        >
          <span className="text-base font-semibold">Ваша активность</span>
          <span className="flex items-center gap-1 text-base font-semibold text-[#8d3df2]">
            <Sparkles className="size-4" />
            27%
          </span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </button>
        <Progress
          value={27}
          className="mt-5 h-2 bg-secondary [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-[#8d3df2] [&_[data-slot=progress-indicator]]:to-[var(--brand)]"
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-2 shadow-sm">
        <Link
          href="/candidate/resume"
          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-secondary hover:translate-x-0.5"
        >
          <span className="flex items-center gap-4 text-base font-medium text-[var(--brand)]">
            <FileText className="size-5" />
            Моё резюме
          </span>
          <span className="text-xs font-semibold text-[var(--brand)]">Создать</span>
        </Link>
        <SidebarRow icon={Mail} label="Отклики и приглашения" value="999+" onClick={() => setActiveTab("applications")} />
        <SidebarRow
          icon={Eye}
          label="Просмотры резюме"
          value="+663"
          valueClassName="font-semibold text-emerald-600"
          onClick={() => setActiveTab("analytics")}
        />
        <SidebarRow icon={Heart} label="Избранные вакансии" value="2" onClick={() => setActiveTab("saved")} />
        <SidebarRow icon={RefreshCw} label="Автопоиски" onClick={() => setActiveTab("jobs")} />
      </section>

      <PromoCard
        title="Вакансии для молодёжи"
        action="Перейти"
        icon={<BriefcaseBusiness className="size-5 text-[var(--brand)]" />}
        onClick={() => setActiveTab("jobs")}
      />
      <PromoCard
        title="Откликнитесь ещё 4 раза"
        action="К вакансиям"
        icon={
          <Badge className="size-10 rounded-full border-4 border-[var(--brand-soft)] bg-white text-lg text-[var(--brand)]">
            4
          </Badge>
        }
        onClick={() => setActiveTab("jobs")}
      />
      <PromoCard
        title="Проверка ИТ-заданий"
        action="Начать"
        icon={<ClipboardCheck className="size-5 text-[#ff5a4f]" />}
        onClick={() => setActiveTab("analytics")}
      />

      <section className="rounded-2xl border border-[var(--brand)]/20 bg-gradient-to-br from-[var(--brand-soft)] to-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-[var(--brand)]/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">Подписки</h3>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Premium для кандидатов и Business для работодателей.
            </p>
            <button
              type="button"
              className="mt-4 text-base font-semibold text-[var(--brand)] transition-all hover:underline"
              onClick={() => setActiveTab("subscription")}
            >
              Смотреть тарифы →
            </button>
          </div>
          <Sparkles className="size-8 animate-float text-[var(--brand)]" />
        </div>
      </section>
    </aside>
  );
}

function SidebarRow({
  icon: Icon,
  label,
  value,
  valueClassName = "text-muted-foreground",
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  valueClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-secondary hover:translate-x-0.5"
      onClick={onClick}
    >
      <span className="flex items-center gap-4 text-base">
        <Icon className="size-5 text-muted-foreground" />
        {label}
      </span>
      {value && <span className={cn("text-sm", valueClassName)}>{value}</span>}
    </button>
  );
}

function PromoCard({
  title,
  action,
  icon,
  onClick,
}: {
  title: string;
  action: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <button
            type="button"
            className="mt-6 font-semibold text-[var(--brand)] transition-all hover:underline"
            onClick={onClick}
          >
            {action}
          </button>
        </div>
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary">{icon}</div>
      </div>
    </section>
  );
}

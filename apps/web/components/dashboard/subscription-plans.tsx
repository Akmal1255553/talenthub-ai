"use client";

import { useState } from "react";
import { Building2, Check, Crown, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { billingApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    description: "Базовый поиск вакансий и первые отклики.",
    price: { monthly: 0, yearly: 0 },
    features: ["10 откликов в месяц", "Базовые рекомендации", "Профиль кандидата", "Уведомления о вакансиях"],
    cta: "Текущий тариф",
    current: true,
  },
  {
    name: "Premium",
    icon: Zap,
    description: "Для активного поиска работы с AI-помощником.",
    price: { monthly: 29000, yearly: 24000 },
    features: [
      "Безлимитные отклики",
      "AI-рекомендации вакансий",
      "Продвижение резюме",
      "AI-сопроводительные письма",
      "Расширенная аналитика",
    ],
    cta: "Подключить Premium",
    popular: true,
  },
  {
    name: "Business",
    icon: Crown,
    description: "Для работодателей, которые нанимают быстрее.",
    price: { monthly: 99000, yearly: 79000 },
    features: [
      "AI-анализ кандидатов",
      "Продвижение вакансий",
      "Доступ к базе резюме",
      "Воронка подбора",
      "Hiring analytics",
    ],
    cta: "Начать Business",
  },
  {
    name: "Scale",
    icon: Building2,
    description: "Для команд рекрутинга и агентств.",
    price: { monthly: 249000, yearly: 199000 },
    features: ["Всё из Business", "Командные роли", "API-доступ", "Персональный менеджер", "SLA и интеграции"],
    cta: "Связаться",
  },
];

export function SubscriptionPlans() {
  const [yearly, setYearly] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string, current?: boolean) => {
    if (current) return;
    setCheckoutPlan(planName);
    try {
      await billingApi.checkout(planName.toUpperCase());
    } finally {
      setCheckoutPlan(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="animate-fade-in-up rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Подписки TalentHub AI</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Premium усиливает поиск работы, Business добавляет AI-инструменты для найма и аналитики.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-secondary p-2">
            <span className={cn("px-2 text-sm transition-colors", !yearly && "font-semibold text-foreground")}>
              Месяц
            </span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={cn("px-2 text-sm transition-colors", yearly && "font-semibold text-foreground")}>
              Год
            </span>
            <Badge className="rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">-20%</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const price = yearly ? plan.price.yearly : plan.price.monthly;

          return (
            <article
              key={plan.name}
              className={cn(
                "relative flex min-h-[430px] flex-col rounded-2xl border bg-white p-6 transition-all duration-300 animate-fade-in-up hover:-translate-y-1",
                plan.popular
                  ? "border-[var(--brand)] shadow-xl shadow-[var(--brand)]/15"
                  : "border-border shadow-sm hover:shadow-lg",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300",
                index === 3 && "delay-400",
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-6 rounded-full bg-[var(--brand)] px-3 py-1 text-white shadow-md">
                  Популярно
                </Badge>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="mt-2 min-h-[48px] text-sm leading-5 text-muted-foreground">{plan.description}</p>
                </div>
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    plan.popular ? "bg-[var(--brand)]" : "bg-secondary",
                  )}
                >
                  <Icon className={cn("size-5", plan.popular ? "text-white" : "text-foreground")} />
                </div>
              </div>

              <div className="mt-6">
                <span className="text-4xl font-bold">{price === 0 ? "0" : price.toLocaleString("ru-RU")}</span>
                <span className="ml-1 text-muted-foreground">so&apos;m / мес</span>
                {yearly && price > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Оплата за год: {(price * 12).toLocaleString("ru-RU")} so&apos;m
                  </p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-5">
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.current ? "outline" : plan.popular ? "shine" : "brandSoft"}
                size="lg"
                className="mt-6 w-full"
                disabled={plan.current || checkoutPlan === plan.name}
                onClick={() => void handleCheckout(plan.name, plan.current)}
              >
                {checkoutPlan === plan.name ? "РџРѕРґРєР»СЋС‡РµРЅРёРµ..." : plan.cta}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

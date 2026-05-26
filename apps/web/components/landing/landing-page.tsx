"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Search,
    title: "Умный поиск вакансий",
    description: "Умные фильтры, AI-ранжирование и персональные рекомендации под ваш профиль и навыки.",
  },
  {
    icon: Bot,
    title: "AI-агент 24/7",
    description: "Помогает соискателям с резюме и откликами, работодателям — с подбором и скринингом кандидатов.",
  },
  {
    icon: TrendingUp,
    title: "Аналитика карьеры",
    description: "Просмотры резюме, конверсия откликов и прогноз зарплаты — всё в одном дашборде.",
  },
  {
    icon: Building2,
    title: "Инструменты для HR",
    description: "Публикация вакансий, AI-оценка резюме, воронка найма и Business-подписка для команд.",
  },
];

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    desc: "Базовый поиск и отклики",
    features: [
      "Поиск вакансий и фильтры",
      "До 10 откликов в месяц",
      "Базовое резюме",
      "Email-уведомления",
    ],
    cta: "Начать бесплатно",
    href: "/auth/register",
  },
  {
    name: "Premium",
    monthlyPrice: 29_000,
    desc: "AI для соискателей",
    highlight: true,
    features: [
      "Всё из Free",
      "AI-агент 24/7 на русском",
      "Безлимитные отклики",
      "Генерация сопроводительных писем",
      "Аналитика карьеры и match-score",
      "Подготовка к собеседованию",
    ],
    cta: "Подключить Premium",
    href: "/auth/register",
  },
  {
    name: "Business",
    monthlyPrice: 99_000,
    desc: "AI для работодателей",
    features: [
      "Всё из Premium",
      "Публикация вакансий",
      "AI-скрининг резюме",
      "Воронка найма и аналитика",
      "Командный доступ HR",
      "Приоритетная поддержка",
    ],
    cta: "Подключить Business",
    href: "/employer/dashboard",
  },
];

const testimonials = [
  {
    name: "Алишер К.",
    role: "Frontend Developer",
    company: "TechCorp",
    quote:
      "AI-агент подобрал 5 вакансий с match 90%+. Получил оффер за 3 недели — раньше уходило 2 месяца.",
    initials: "АК",
    rating: 5,
    featured: true,
  },
  {
    name: "Мадина R.",
    role: "HR Lead",
    company: "Invest Tech",
    quote: "Business-подписка сократила время скрининга в 2.4 раза. Воронка найма — в одном месте.",
    initials: "MR",
    rating: 5,
    featured: false,
  },
  {
    name: "Дилшод T.",
    role: "Python Developer",
    company: "FinStart",
    quote: "Сопроводительные письма от AI выглядят живыми. Конверсия откликов выросла с 8% до 24%.",
    initials: "DT",
    rating: 5,
    featured: false,
  },
  {
    name: "Нодира S.",
    role: "Recruiter",
    company: "UzDigital",
    quote: "Публикуем вакансии и получаем ранжированный shortlist. Кандидаты приходят уже отфильтрованные.",
    initials: "NS",
    rating: 4,
    featured: false,
  },
];

const faqItems = [
  {
    question: "Чем отличается Free от Premium?",
    answer:
      "Free даёт базовый поиск и до 10 откликов в месяц. Premium добавляет AI-агента, безлимитные отклики, генерацию писем, аналитику карьеры и подготовку к интервью.",
  },
  {
    question: "Premium или Business — что выбрать?",
    answer:
      "Premium — для соискателей: поиск работы, резюме, отклики. Business — для HR и компаний: публикация вакансий, скрининг резюме, воронка найма и командный доступ.",
  },
  {
    question: "Как работает скидка 20% при оплате за год?",
    answer:
      "При годовой подписке цена снижается на 20%. Например, Premium: 29 000 so'm/мес → 23 200 so'm/мес при оплате за 12 месяцев.",
  },
  {
    question: "Можно ли отменить подписку?",
    answer:
      "Да, в любой момент в личном кабинете. Доступ сохраняется до конца оплаченного периода. Автопродление отключается сразу.",
  },
  {
    question: "Сколько запросов к AI-агенту включено?",
    answer:
      "Premium и Business — безлимитные диалоги с AI-агентом. На Free доступен ограниченный preview: до 5 сообщений в день.",
  },
  {
    question: "Какие способы оплаты поддерживаются?",
    answer:
      "Банковские карты Uzcard/Humo, Click, Payme и корпоративный счёт для Business. Чек приходит на email после оплаты.",
  },
];

const trustCompanies = [
  "Uzum",
  "Payme",
  "Click",
  "Kapitalbank",
  "IT Park",
  "Invest Tech",
  "Humans",
  "EPAM",
];

function formatPrice(amount: number) {
  return amount.toLocaleString("ru-RU");
}

function buildSearchHref(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return "/auth/register";
  return `/auth/register?q=${encodeURIComponent(trimmed)}`;
}

export function LandingPage() {
  return (
    <div className="bg-mesh min-h-screen">
      <LandingHeader />

      <main>
        <HeroSection />
        <StatsBar />
        <TrustBar />
        <FeaturesSection />
        <AISection />
        <TestimonialsSection />
        <PricingPreview />
        <FAQSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass animate-fade-in">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white shadow-md">
            TH
          </div>
          <span className="text-lg font-bold tracking-tight">TalentHub AI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            ["#features", "Возможности"],
            ["#ai", "AI-агент"],
            ["#testimonials", "Отзывы"],
            ["#pricing", "Тарифы"],
            ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/employer/dashboard">Работодателям</Link>
          </Button>
          <Button variant="brandSoft" size="sm" asChild>
            <Link href="/auth/login">Войти</Link>
          </Button>
          <Button variant="brand" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/auth/register">
              Создать резюме
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  const [query, setQuery] = useState("");
  const searchHref = buildSearchHref(query);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pt-24">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-[var(--brand)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-[oklch(0.55_0.18_165)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="animate-fade-in-up mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-4 py-1.5 text-sm font-medium text-[var(--brand)]">
            <Sparkles className="size-4" />
            Платформа нового поколения
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Ваш путь к работе мечты с{" "}
            <span className="text-gradient">AI-агентом</span> TalentHub
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Единая платформа для соискателей и работодателей: вакансии, резюме, отклики и умный помощник 24/7.
            Premium — для карьеры, Business — для найма.
          </p>
        </div>

        <form
          className="animate-fade-in-up delay-200 mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = searchHref;
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Должность, компания или навык"
              aria-label="Поиск вакансий"
              className="h-14 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-base shadow-sm transition-shadow duration-200 focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand)]/15"
            />
          </div>
          <Button variant="shine" size="xl" className="shrink-0 cursor-pointer sm:min-w-[160px]" asChild>
            <Link href={searchHref}>Найти вакансии</Link>
          </Button>
        </form>

        <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-[var(--brand)]" />
            12 000+ вакансий
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-[var(--brand)]" />
            AI на русском
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-[var(--brand)]" />
            Подписка от 0 so&apos;m
          </span>
        </div>

        <div className="animate-scale-in delay-400 relative mx-auto mt-16 max-w-4xl">
          <div className="hero-glow -bottom-8" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-[var(--brand)]/10">
            <div className="flex items-center gap-2 border-b border-border bg-slate-50 px-4 py-3">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-muted-foreground">candidate/dashboard</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <MockJobCard
                slug="frontend-developer-talenthub"
                title="Senior Frontend Developer"
                company="TalentHub Labs"
                salary="2 500 – 3 500 $"
                match="94%"
              />
              <MockJobCard
                slug="backend-python-invest-tech"
                title="Backend Python Developer"
                company="OOO INVEST TECH SYSTEM"
                salary="1 000 – 2 000 $"
                match="87%"
              />
            </div>
          </div>
          <div className="animate-float animate-pulse-glow absolute -bottom-4 -right-2 hidden rounded-2xl border border-border bg-white p-4 shadow-xl md:block">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)]">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI-агент</p>
                <p className="text-xs text-muted-foreground">Нашёл 23 подходящие вакансии</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockJobCard({
  slug,
  title,
  company,
  salary,
  match,
}: {
  slug: string;
  title: string;
  company: string;
  salary: string;
  match: string;
}) {
  return (
    <Link
      href={`/jobs/${slug}`}
      className="block cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:border-[var(--brand)]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{title}</h3>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          {match}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{company}</p>
      <p className="mt-3 text-sm font-medium">{salary}</p>
      <span className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-semibold text-white">
        Смотреть вакансию
      </span>
    </Link>
  );
}

function TrustBar() {
  return (
    <section className="px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Компании, которые нанимают через TalentHub
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustCompanies.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold tracking-wide text-foreground/40 transition-colors duration-200 hover:text-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "50K+", label: "Соискателей" },
    { value: "8K+", label: "Компаний" },
    { value: "94%", label: "Точность AI" },
    { value: "2.4×", label: "Быстрее найм" },
  ];

  return (
    <section className="border-y border-border bg-white/80 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className={cn("animate-fade-in-up text-center", `delay-${(i + 1) * 100}`)}>
            <p className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Всё для поиска и найма</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Один продукт для кандидатов и работодателей — с подпиской и AI внутри.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={cn(
                "group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/30 hover:shadow-lg hover:shadow-[var(--brand)]/5 animate-fade-in-up",
                `delay-${(i + 1) * 100}`,
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section id="ai" className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-foreground text-background">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12 lg:p-16">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <Zap className="size-4 text-amber-300" />
              AI Career & Hiring Agent
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight md:text-4xl">
              Персональный агент для соискателя и HR
            </h2>
            <ul className="mt-6 space-y-3 text-white/80">
              {[
                "Подбор вакансий по навыкам и зарплате",
                "Генерация сопроводительных писем",
                "Скрининг резюме для работодателя",
                "Подготовка к собеседованию",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 shrink-0 text-[var(--brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="brand" size="lg" asChild>
                <Link href="/auth/register">Для соискателей</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/employer/dashboard">Для работодателей</Link>
              </Button>
            </div>
          </div>

          <div className="animate-scale-in delay-200 flex flex-col justify-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]">
                  <Bot className="size-5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-sm leading-relaxed">
                  Привет! Я нашёл 23 вакансии React-разработчика с зарплатой от 2 000 $. Показать топ-5 или
                  помочь с резюме?
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Показать вакансии", "Улучшить резюме", "Советы по интервью"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs transition-colors hover:bg-white/15"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Рейтинг ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function TestimonialsSection() {
  const featured = testimonials.find((t) => t.featured)!;
  const rest = testimonials.filter((t) => !t.featured);

  return (
    <section id="testimonials" className="border-y border-border bg-white/80 px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">Отзывы</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Нам доверяют соискатели и HR
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Средняя оценка 4.8 — по отзывам кандидатов и рекрутеров
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <StarRating rating={5} />
            <span className="text-sm font-medium text-muted-foreground">4.8 / 5 · 2 400+ отзывов</span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          <Card className="gap-0 py-0 sm:col-span-2 lg:row-span-2">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
              <blockquote className="text-lg font-medium leading-relaxed md:text-xl">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-[var(--brand-soft)] font-semibold text-[var(--brand)]">
                    {featured.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{featured.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {featured.role} · {featured.company}
                  </p>
                  <StarRating rating={featured.rating} />
                </div>
              </div>
            </CardContent>
          </Card>

          {rest.map((item) => (
            <Card key={item.name} className="gap-0 py-0 md:col-span-2 lg:col-span-2">
              <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                <blockquote className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.role} · {item.company}
                    </p>
                  </div>
                  <StarRating rating={item.rating} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Тарифы под вашу задачу</h2>
          <p className="mt-4 text-muted-foreground">Выберите план и подключите AI за пару кликов</p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={cn("text-sm font-medium", !yearly && "text-foreground")}>Ежемесячно</span>
            <Switch
              checked={yearly}
              onCheckedChange={setYearly}
              aria-label="Переключить на годовую оплату"
            />
            <span className={cn("text-sm font-medium", yearly && "text-foreground")}>
              Ежегодно
              <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                −20%
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const price =
              plan.monthlyPrice === 0
                ? 0
                : yearly
                  ? Math.round(plan.monthlyPrice * 0.8)
                  : plan.monthlyPrice;

            return (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 animate-fade-in-up",
                  plan.highlight
                    ? "border-[var(--brand)] shadow-xl shadow-[var(--brand)]/15"
                    : "border-border shadow-sm hover:shadow-md",
                  `delay-${(i + 1) * 100}`,
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white">
                    Популярно
                  </span>
                )}

                <div className="border-b border-border p-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold">
                      {price === 0 ? "0" : formatPrice(price)}
                    </span>
                    {price !== 0 && (
                      <span className="text-muted-foreground"> so&apos;m/мес</span>
                    )}
                  </p>
                  {yearly && price !== 0 && (
                    <p className="mt-1 text-xs text-muted-foreground line-through">
                      {formatPrice(plan.monthlyPrice)} so&apos;m/мес
                    </p>
                  )}
                  <Button
                    variant={plan.highlight ? "shine" : "brandSoft"}
                    className="mt-6 w-full cursor-pointer"
                    size="lg"
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>

                <ul className="flex flex-1 flex-col gap-3 p-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-[var(--brand)]"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Частые вопросы</h2>
          <p className="mt-4 text-lg text-muted-foreground">Ответы о тарифах, AI-агенте и оплате</p>
        </div>

        <div className="mt-12 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-xl border border-border bg-white transition-colors hover:border-[var(--brand)]/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                  role="region"
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 pb-20 md:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[var(--brand)] via-[oklch(0.55_0.2_290)] to-[oklch(0.55_0.18_165)] p-10 text-center text-white animate-gradient md:p-14">
        <Users className="mx-auto size-12 opacity-90" />
        <h2 className="mt-4 text-3xl font-bold">Начните поиск уже сегодня</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/85">
          Создайте профиль, подключите AI-агента и откликайтесь на вакансии в пару кликов.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="bg-white text-[var(--brand)] hover:bg-white/90" asChild>
            <Link href="/auth/register">
              <BriefcaseBusiness className="size-5" />
              Я ищу работу
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/15"
            asChild
          >
            <Link href="/employer/dashboard">Я нанимаю</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row md:px-6">
        <p>© 2026 TalentHub AI. Платформа поиска работы с ИИ.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/candidate/dashboard" className="transition-colors hover:text-foreground">
            Соискателям
          </Link>
          <Link href="/employer/dashboard" className="transition-colors hover:text-foreground">
            Работодателям
          </Link>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Тарифы
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}

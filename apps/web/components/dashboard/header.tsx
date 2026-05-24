"use client";

import Link from "next/link";
import { Bell, FileText, Heart, Menu, MessageCircle, Navigation, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a1a1a] text-white shadow-lg">
      <div className="mx-auto flex h-[68px] max-w-[1428px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex size-10 items-center justify-center rounded-full bg-[var(--hh-red)] text-base font-bold transition-transform duration-200 hover:scale-105"
          >
            hh
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Резюме и профиль", badge: "99+" },
              { label: "Отклики", href: "#" },
              { label: "Помощь", href: "#" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
                {"badge" in item && item.badge && (
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { icon: Search, label: "Поиск", className: "hidden sm:flex" },
            { icon: Navigation, label: "Ташкент", className: "hidden md:flex" },
            { icon: MessageCircle, label: "", className: "hidden sm:block", iconOnly: true },
            { icon: Heart, label: "", className: "hidden sm:block", iconOnly: true },
            { icon: Bell, label: "", className: "hidden md:block", iconOnly: true },
          ].map((item) => (
            <button
              key={item.label || item.icon.name}
              type="button"
              className={cn(
                "items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white",
                item.className,
                item.iconOnly ? "inline-flex" : "hidden sm:inline-flex",
              )}
              aria-label={item.label || undefined}
            >
              <item.icon className="size-5" />
              {item.label && <span>{item.label}</span>}
            </button>
          ))}

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            className="hidden border border-white/20 bg-white/10 text-white hover:bg-white/20 md:inline-flex"
            asChild
          >
            <Link href="/candidate/resume/new">
              <FileText className="size-4" />
              Создать резюме
            </Link>
          </Button>

          <button
            type="button"
            className="rounded-lg p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Меню"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function SearchPanel() {
  return (
    <section className="animate-fade-in-up mx-auto max-w-[1428px] px-4 pt-10 md:px-8">
      <div className="flex gap-3">
        <div className="group relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[var(--brand)]" />
          <Input
            className="h-12 rounded-xl border-border bg-white pl-12 text-base shadow-sm transition-all duration-200 focus-visible:border-[var(--brand)] focus-visible:ring-[var(--brand)]/20"
            placeholder="Профессия, должность или компания"
          />
        </div>
        <Button
          variant="outline"
          size="icon-lg"
          className="shrink-0 border-border bg-white hover:border-[var(--brand)]/40"
          aria-label="Фильтры"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h10" />
            <path d="M18 7h2" />
            <path d="M4 17h2" />
            <path d="M10 17h10" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
          </svg>
        </Button>
        <Button variant="shine" size="lg" className="hidden min-w-[120px] sm:inline-flex">
          Найти
        </Button>
      </div>
    </section>
  );
}

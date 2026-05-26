"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, FileText, Heart, LogOut, MessageCircle, Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-card/95 text-foreground shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-sm font-bold text-white shadow-md">
              TH
            </div>
            <span className="hidden font-bold sm:inline">TalentHub</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/candidate/dashboard"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Вакансии
            </Link>
            <Link
              href="/candidate/resume"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Резюме
            </Link>
            <Link
              href="/jobs"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Каталог
            </Link>
            <Link
              href="/candidate/chat"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              AI-чат
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild aria-label="Каталог">
            <Link href="/jobs">
              <Search className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Избранное">
            <Heart className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild aria-label="AI-чат">
            <Link href="/candidate/chat">
              <MessageCircle className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Уведомления">
            <Bell className="size-5" />
          </Button>

          <ThemeToggle />

          <Button variant="brandSoft" size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/candidate/resume/new">
              <FileText className="size-4" />
              Резюме
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-secondary/50 py-1 pl-1 pr-3 transition-colors hover:bg-secondary"
                >
                  <Avatar className="size-8">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                    <AvatarFallback className="bg-[var(--brand)] text-xs text-white">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium lg:inline">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/candidate/dashboard">
                    <User className="size-4" />
                    Личный кабинет
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/candidate/resume">Мои резюме</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="size-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="brand" size="sm" asChild>
              <Link href="/auth/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function SearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
  };

  return (
    <section className="animate-fade-in-up mx-auto max-w-[1600px] px-4 pt-8 md:px-8">
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="group relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-xl border-border bg-card pl-12 text-base shadow-sm"
            placeholder="Профессия, должность или компания"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск вакансий"
          />
        </div>
        <Button type="submit" variant="shine" size="lg" className="hidden min-w-[120px] sm:inline-flex">
          Найти
        </Button>
      </form>
    </section>
  );
}

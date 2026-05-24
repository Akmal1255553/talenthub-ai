"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Plus, Sparkles, Trash2 } from "lucide-react";
import type { ResumeListItem } from "@talenthub/shared";
import { UserRole } from "@talenthub/shared";
import { Button } from "@/components/ui/button";
import { ApiError, resumeApi } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function ResumeListPage() {
  const auth = useRequireAuth([UserRole.Candidate]);
  const [items, setItems] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await resumeApi.list();
      setItems(res.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить резюме");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) void load();
  }, [auth.user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить резюме?")) return;
    await resumeApi.remove(id);
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  if (auth.loading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <Link href="/candidate/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              ← Дашборд
            </Link>
            <h1 className="mt-1 text-2xl font-bold">Мои резюме</h1>
          </div>
          <Button variant="shine" asChild>
            <Link href="/candidate/resume/new">
              <Plus className="size-4" />
              Создать резюме
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
            <p className="mt-2 text-muted-foreground">Убедитесь, что API и PostgreSQL запущены (`docker compose up -d postgres`).</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="animate-fade-in-up rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <FileText className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Пока нет резюме</h2>
            <p className="mt-2 text-muted-foreground">Создайте профессиональное резюме за 5 минут — с AI-подсказками</p>
            <Button variant="shine" size="lg" className="mt-6" asChild>
              <Link href="/candidate/resume/new">
                <Sparkles className="size-4" />
                Создать первое резюме
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((resume, i) => (
              <li
                key={resume.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up",
                  i === 0 && "delay-100",
                )}
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{resume.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Обновлено {new Date(resume.updatedAt).toLocaleDateString("ru-RU")}
                    {resume.aiScore != null && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                        AI {resume.aiScore}%
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="brandSoft" asChild>
                    <Link href={`/candidate/resume/${resume.id}`}>Редактировать</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

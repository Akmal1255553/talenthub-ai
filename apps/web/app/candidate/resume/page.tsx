"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Plus, Sparkles, Trash2, UploadCloud, Loader2 } from "lucide-react";
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

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const load = async () => {
    try {
      const res = await resumeApi.list();
      const list = res?.items ?? (Array.isArray(res) ? res : []);
      setItems(list);
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

  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Пожалуйста, загрузите только PDF файл");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const newResume = await resumeApi.uploadPdf(file);
      if (newResume && newResume.id) {
        window.location.href = `/candidate/resume/${newResume.id}`;
      } else {
        await load();
      }
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Ошибка при загрузке и обработке PDF резюме с помощью AI");
    } finally {
      setUploading(false);
    }
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

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handlePdfUpload(file);
          }}
          className={cn(
            "relative mb-8 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-card/50 hover:bg-card hover:border-muted-foreground/30",
            uploading && "pointer-events-none opacity-80"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
              <Loader2 className="size-10 animate-spin text-primary" />
              <h4 className="mt-4 font-semibold text-lg animate-pulse">Анализируем резюме с помощью AI...</h4>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Извлекаем информацию об образовании, опыте работы и ключевых навыках. Это займет несколько секунд.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/10 p-4 transition-transform hover:scale-110">
                <UploadCloud className="size-8 text-primary" />
              </div>
              <h4 className="mt-4 font-semibold text-lg">Автоматическое создание резюме</h4>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Просто перетащите сюда свой **PDF файл**, и наша AI система автоматически заполнит все разделы вашего резюме.
              </p>
              <label className="mt-4">
                <span className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90">
                  Выбрать PDF
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handlePdfUpload(file);
                  }}
                />
              </label>
            </div>
          )}
          {uploadError && (
            <p className="mt-3 text-sm text-destructive font-medium">{uploadError}</p>
          )}
        </div>

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

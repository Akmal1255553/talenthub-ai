"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole, type ResumeContent, type ResumeRecord } from "@talenthub/shared";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { ApiError, resumeApi } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth-context";

export default function EditResumePage() {
  useRequireAuth([UserRole.Candidate]);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void resumeApi
      .get(params.id)
      .then(setResume)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async (title: string, content: ResumeContent) => {
    setSaving(true);
    try {
      await resumeApi.update(params.id, { title, content });
      router.push("/candidate/resume");
    } finally {
      setSaving(false);
    }
  };

  const handleImprove = async (_content: ResumeContent) => {
    const updated = await resumeApi.improve(params.id);
    setResume(updated);
    return updated.content;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Загрузка резюме...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "Резюме не найдено"}</p>
        <Link href="/candidate/resume" className="text-[var(--brand)] hover:underline">
          ← К списку
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
          <Link href="/candidate/resume" className="text-sm text-muted-foreground hover:text-foreground">
            ← Мои резюме
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Редактирование</h1>
          <p className="text-sm text-muted-foreground">{resume.title}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <ResumeBuilder
          initialTitle={resume.title}
          initialContent={resume.content}
          onSave={handleSave}
          onImprove={handleImprove}
          saving={saving}
        />
      </main>
    </div>
  );
}

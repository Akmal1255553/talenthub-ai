"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMPTY_RESUME_CONTENT, UserRole } from "@talenthub/shared";
import { Sparkles, FileText, Wand2 } from "lucide-react";
import { ResumeBuilder } from "@/components/resume/resume-builder";
import { Badge } from "@/components/ui/badge";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { aiApi, resumeApi } from "@/lib/api";

export default function NewResumePage() {
  useRequireAuth([UserRole.Candidate]);
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (title: string, content: typeof EMPTY_RESUME_CONTENT) => {
    setSaving(true);
    try {
      const email = content.personal.email || user?.email || "";
      const resume = await resumeApi.create({
        title,
        content: { ...content, personal: { ...content.personal, email } },
      });
      router.push(`/candidate/resume/${resume.id}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImprove = async (content: typeof EMPTY_RESUME_CONTENT) => {
    const res = await aiApi.improveContent(content);
    return res.content;
  };

  return (
    <div className="bg-mesh min-h-screen pb-24">
      <header className="border-b border-border bg-gradient-to-br from-card via-card to-[var(--brand-soft)]/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <Link href="/candidate/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← К поиску вакансий
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-white">
                  <FileText className="size-5" />
                </div>
                <Badge className="border-0 bg-[var(--brand-soft)] text-[var(--brand)]">Профессиональное резюме</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold md:text-3xl">Создайте резюме за 5 шагов</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
                Мастер с живым предпросмотром, тремя шаблонами оформления и AI-подсказками. После сохранения резюме
                появится в поиске работодателей.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Wand2 className="size-4 text-[var(--brand)]" />
                3 шаблона: Modern, Classic, Executive
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--brand)]" />
                Улучшение текста одной кнопкой
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <ResumeBuilder
          initialContent={{
            ...EMPTY_RESUME_CONTENT,
            personal: {
              ...EMPTY_RESUME_CONTENT.personal,
              fullName: user?.name ?? "",
              email: user?.email ?? "",
            },
          }}
          onSave={handleSave}
          onImprove={handleImprove}
          saving={saving}
        />
      </main>
    </div>
  );
}

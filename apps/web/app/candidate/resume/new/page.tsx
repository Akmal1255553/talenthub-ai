"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMPTY_RESUME_CONTENT, UserRole } from "@talenthub/shared";
import { ResumeBuilder } from "@/components/resume/resume-builder";
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
    <div className="bg-mesh min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
          <Link href="/candidate/resume" className="text-sm text-muted-foreground hover:text-foreground">
            ← Мои резюме
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Создание резюме</h1>
          <p className="text-sm text-muted-foreground">Пошаговый мастер с живым предпросмотром</p>
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

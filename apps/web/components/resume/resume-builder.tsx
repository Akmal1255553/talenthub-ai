"use client";

import { useState } from "react";
import {
  createId,
  EMPTY_RESUME_CONTENT,
  type ResumeContent,
  type ResumeEducation,
  type ResumeExperience,
} from "@talenthub/shared";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "@/components/resume/resume-preview";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "personal", label: "Личные данные" },
  { id: "experience", label: "Опыт" },
  { id: "education", label: "Образование" },
  { id: "skills", label: "Навыки" },
  { id: "preview", label: "Превью" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface ResumeBuilderProps {
  initialTitle?: string;
  initialContent?: ResumeContent;
  onSave: (title: string, content: ResumeContent) => Promise<void>;
  onImprove?: (content: ResumeContent) => Promise<ResumeContent>;
  saving?: boolean;
}

export function ResumeBuilder({
  initialTitle = "Моё резюме",
  initialContent = EMPTY_RESUME_CONTENT,
  onSave,
  onImprove,
  saving = false,
}: ResumeBuilderProps) {
  const [step, setStep] = useState<StepId>("personal");
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [skillsInput, setSkillsInput] = useState(initialContent.skills.join(", "));
  const [improving, setImproving] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const updatePersonal = (patch: Partial<ResumeContent["personal"]>) => {
    setContent((c) => ({ ...c, personal: { ...c.personal, ...patch } }));
  };

  const addExperience = () => {
    const item: ResumeExperience = {
      id: createId(),
      company: "",
      position: "",
      startDate: "",
      current: false,
      description: "",
      achievements: [""],
    };
    setContent((c) => ({ ...c, experience: [...c.experience, item] }));
  };

  const updateExperience = (id: string, patch: Partial<ResumeExperience>) => {
    setContent((c) => ({
      ...c,
      experience: c.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setContent((c) => ({ ...c, experience: c.experience.filter((e) => e.id !== id) }));
  };

  const addEducation = () => {
    const item: ResumeEducation = {
      id: createId(),
      institution: "",
      degree: "",
      startDate: "",
    };
    setContent((c) => ({ ...c, education: [...c.education, item] }));
  };

  const updateEducation = (id: string, patch: Partial<ResumeEducation>) => {
    setContent((c) => ({
      ...c,
      education: c.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const removeEducation = (id: string) => {
    setContent((c) => ({ ...c, education: c.education.filter((e) => e.id !== id) }));
  };

  const syncSkills = () => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setContent((c) => ({ ...c, skills }));
  };

  const handleImprove = async () => {
    if (!onImprove) return;
    setImproving(true);
    try {
      const improved = await onImprove(content);
      setContent(improved);
      setSkillsInput(improved.skills.join(", "));
    } finally {
      setImproving(false);
    }
  };

  const canGoNext = () => {
    if (step === "personal") {
      return content.personal.fullName.trim() && content.personal.email.trim() && content.personal.desiredPosition.trim();
    }
    return true;
  };

  const goNext = () => {
    if (step === "skills") syncSkills();
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const handleSave = async () => {
    syncSkills();
    await onSave(title, content);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,420px)]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.id === "skills") syncSkills();
                setStep(s.id);
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-sm",
                step === s.id
                  ? "bg-[var(--brand)] text-white shadow-md"
                  : i < stepIndex
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px]",
                  step === s.id ? "bg-white/20" : "bg-white",
                )}
              >
                {i < stepIndex ? <Check className="size-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-fade-in-up">
          {step === "personal" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Личные данные</h2>
                <p className="mt-1 text-sm text-muted-foreground">Как в профиле на hh.ru — имя, контакты, желаемая должность</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume-title">Название резюме</Label>
                <Input id="resume-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Frontend-разработчик" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">ФИО *</Label>
                  <Input id="fullName" value={content.personal.fullName} onChange={(e) => updatePersonal({ fullName: e.target.value })} placeholder="Иванов Иван Иванович" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desiredPosition">Желаемая должность *</Label>
                  <Input id="desiredPosition" value={content.personal.desiredPosition} onChange={(e) => updatePersonal({ desiredPosition: e.target.value })} placeholder="Frontend-разработчик" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input id="city" value={content.personal.city ?? ""} onChange={(e) => updatePersonal({ city: e.target.value })} placeholder="Ташкент" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={content.personal.email} onChange={(e) => updatePersonal({ email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" value={content.personal.phone ?? ""} onChange={(e) => updatePersonal({ phone: e.target.value })} placeholder="+998 90 123 45 67" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="about">О себе</Label>
                  <Textarea id="about" value={content.about ?? ""} onChange={(e) => setContent((c) => ({ ...c, about: e.target.value }))} placeholder="Кратко о опыте, сильных сторонах и целях..." rows={4} />
                </div>
              </div>
            </div>
          )}

          {step === "experience" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Опыт работы</h2>
                  <p className="mt-1 text-sm text-muted-foreground">От последнего места к первому</p>
                </div>
                <Button type="button" variant="brandSoft" size="sm" onClick={addExperience}>
                  <Plus className="size-4" />
                  Добавить
                </Button>
              </div>

              {content.experience.length === 0 && (
                <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  Пока нет опыта — добавьте место работы или пропустите шаг
                </p>
              )}

              {content.experience.map((exp, idx) => (
                <div key={exp.id} className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Место {idx + 1}</span>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeExperience(exp.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Должность</Label>
                      <Input value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Компания</Label>
                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Начало (ГГГГ-ММ)</Label>
                      <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} placeholder="2022-03" />
                    </div>
                    <div className="space-y-2">
                      <Label>Окончание</Label>
                      <Input value={exp.endDate ?? ""} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} placeholder="2024-06" />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? undefined : exp.endDate })} />
                        По настоящее время
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Обязанности и достижения</Label>
                    <Textarea value={exp.description ?? ""} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} rows={3} placeholder="Опишите задачи и измеримые результаты..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === "education" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Образование</h2>
                  <p className="mt-1 text-sm text-muted-foreground">ВУЗ, колледж, курсы</p>
                </div>
                <Button type="button" variant="brandSoft" size="sm" onClick={addEducation}>
                  <Plus className="size-4" />
                  Добавить
                </Button>
              </div>

              {content.education.map((edu, idx) => (
                <div key={edu.id} className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Учебное заведение {idx + 1}</span>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeEducation(edu.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Название</Label>
                      <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Степень / специальность</Label>
                      <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} placeholder="Бакалавр" />
                    </div>
                    <div className="space-y-2">
                      <Label>Факультет</Label>
                      <Input value={edu.field ?? ""} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Год начала</Label>
                      <Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} placeholder="2018" />
                    </div>
                    <div className="space-y-2">
                      <Label>Год окончания</Label>
                      <Input value={edu.endDate ?? ""} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} placeholder="2022" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === "skills" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Навыки и языки</h2>
              <div className="space-y-2">
                <Label>Ключевые навыки (через запятую)</Label>
                <Textarea value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} onBlur={syncSkills} rows={3} placeholder="React, TypeScript, Node.js, Git..." />
              </div>
              <div className="space-y-3">
                <Label>Иностранные языки</Label>
                {content.languages.map((lang, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Английский"
                      value={lang.name}
                      onChange={(e) => {
                        const languages = [...content.languages];
                        languages[i] = { ...languages[i], name: e.target.value };
                        setContent((c) => ({ ...c, languages }));
                      }}
                    />
                    <Input
                      placeholder="B2"
                      value={lang.level}
                      onChange={(e) => {
                        const languages = [...content.languages];
                        languages[i] = { ...languages[i], level: e.target.value };
                        setContent((c) => ({ ...c, languages }));
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setContent((c) => ({ ...c, languages: [...c.languages, { name: "", level: "" }] }))}
                >
                  <Plus className="size-4" />
                  Язык
                </Button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4 lg:hidden">
              <h2 className="text-xl font-bold">Проверьте резюме</h2>
              <ResumePreview content={content} className="shadow-md" />
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
              <ArrowLeft className="size-4" />
              Назад
            </Button>

            <div className="flex flex-wrap gap-2">
              {onImprove && (
                <Button type="button" variant="brandSoft" onClick={handleImprove} disabled={improving}>
                  <Sparkles className="size-4" />
                  {improving ? "Улучшаем..." : "Улучшить с AI"}
                </Button>
              )}

              {step !== "preview" ? (
                <Button type="button" variant="brand" onClick={goNext} disabled={!canGoNext()}>
                  Далее
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="button" variant="shine" onClick={handleSave} disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить резюме"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Предпросмотр</p>
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl bg-secondary/50 p-4">
            <ResumePreview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

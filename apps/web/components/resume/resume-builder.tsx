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
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResumePreview, type ResumeTemplate } from "@/components/resume/resume-preview";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "personal", label: "Личные данные" },
  { id: "experience", label: "Опыт" },
  { id: "education", label: "Образование" },
  { id: "skills", label: "Навыки" },
  { id: "preview", label: "Превью" },
] as const;

const STEP_TIPS: Record<(typeof STEPS)[number]["id"], string> = {
  personal:
    "Укажите должность так, как её ищут работодатели: «Frontend-разработчик», а не просто «Разработчик».",
  experience:
    "Добавляйте цифры: «увеличил конверсию на 15%», «сократил время релиза с 2 недель до 3 дней».",
  education: "Укажите релевантные курсы и сертификаты — они повышают доверие рекрутера.",
  skills: "8–12 ключевых навыков оптимально. Первые 5 — самые сильные по вашему опыту.",
  preview: "Проверьте орфографию и нажмите «Улучшить с AI» перед сохранением.",
};

const SKILL_SUGGESTIONS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "Git",
  "Figma",
  "Agile",
  "English B2",
];

const TEMPLATES: { id: ResumeTemplate; label: string; desc: string }[] = [
  { id: "modern", label: "Современный", desc: "Чистый tech-стиль" },
  { id: "classic", label: "Классический", desc: "Строгий деловой" },
  { id: "executive", label: "Executive", desc: "Премиум-оформление" },
];

function calcCompletion(content: ResumeContent): number {
  let score = 0;
  const p = content.personal;
  if (p.fullName.trim()) score += 10;
  if (p.email.trim()) score += 10;
  if (p.desiredPosition.trim()) score += 15;
  if (p.phone?.trim()) score += 5;
  if (p.city?.trim()) score += 5;
  if (content.about?.trim()) score += 10;
  if (content.experience.some((e) => e.company && e.position)) score += 20;
  if (content.education.some((e) => e.institution)) score += 10;
  if (content.skills.length >= 3) score += 15;
  return Math.min(100, score);
}

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
  const [template, setTemplate] = useState<ResumeTemplate>("modern");

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const completion = calcCompletion(content);
  const progressPercent = Math.round(((stepIndex + 1) / STEPS.length) * 40 + completion * 0.6);

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

  const addSuggestedSkill = (skill: string) => {
    const parts = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.includes(skill)) return;
    setSkillsInput([...parts, skill].join(", "));
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_minmax(340px,440px)]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Прогресс резюме</p>
              <p className="text-xs text-muted-foreground">
                Заполнено на {completion}% · шаг {stepIndex + 1} из {STEPS.length}
              </p>
            </div>
            <Badge variant="outline" className="border-[var(--brand)]/30 text-[var(--brand)]">
              {progressPercent}%
            </Badge>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[oklch(0.55_0.2_290)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={cn(
                "cursor-pointer rounded-xl border px-3 py-2 text-left transition-all",
                template === t.id
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm"
                  : "border-border bg-card hover:border-[var(--brand)]/40",
              )}
            >
              <span className="text-sm font-semibold">{t.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{t.desc}</span>
            </button>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)]/60 px-4 py-3">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
          <p className="text-sm leading-relaxed text-foreground/90">{STEP_TIPS[step]}</p>
        </div>

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
                <div className="space-y-2">
                  <Label htmlFor="salary">Желаемая зарплата (сумма)</Label>
                  <Input
                    id="salary"
                    type="number"
                    min={0}
                    value={content.personal.salary?.amount ?? ""}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      updatePersonal({
                        salary: amount
                          ? {
                              amount,
                              currency: content.personal.salary?.currency ?? "UZS",
                              period: content.personal.salary?.period ?? "month",
                            }
                          : undefined,
                      });
                    }}
                    placeholder="15000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта</Label>
                  <Input
                    id="currency"
                    value={content.personal.salary?.currency ?? "UZS"}
                    onChange={(e) =>
                      updatePersonal({
                        salary: content.personal.salary
                          ? { ...content.personal.salary, currency: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="UZS"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="about">О себе</Label>
                  <Textarea id="about" value={content.about ?? ""} onChange={(e) => setContent((c) => ({ ...c, about: e.target.value }))} placeholder="3–4 предложения: опыт, сильные стороны, чего ищете в новой роли..." rows={4} />
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
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SKILL_SUGGESTIONS.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="cursor-pointer text-xs hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
                      onClick={() => addSuggestedSkill(s)}
                    >
                      + {s}
                    </Badge>
                  ))}
                </div>
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
              <ResumePreview content={content} template={template} className="shadow-md" />
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

      <div className="hidden xl:block">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Живой предпросмотр</p>
            <Badge variant="secondary" className="text-xs capitalize">
              {TEMPLATES.find((t) => t.id === template)?.label}
            </Badge>
          </div>
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl bg-secondary/50 p-4 ring-1 ring-border">
            <ResumePreview content={content} template={template} />
          </div>
          {onImprove && (
            <p className="text-center text-xs text-muted-foreground">
              AI улучшит формулировки и дополнит блок «О себе»
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

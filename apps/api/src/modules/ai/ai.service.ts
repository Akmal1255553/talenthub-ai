import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiCapability } from "@talenthub/shared";
import type { ResumeContent } from "@talenthub/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async assistant(message: string, userId?: string) {
    const reply = await this.chatCompletion(
      [
        {
          role: "system",
          content:
            "Ты AI-агент TalentHub — платформы поиска работы. Помогаешь соискателям (резюме, вакансии, интервью, зарплата) и работодателям (подбор, скрининг). Отвечай на русском, кратко и по делу, с маркдауном где уместно.",
        },
        { role: "user", content: message },
      ],
      userId,
      AiCapability.AssistantChat,
    );

    return { reply };
  }

  async improveResume(content: ResumeContent, userId?: string) {
    const prompt = `Улучши резюме кандидата: сделай формулировки профессиональнее, добавь сильные глаголы, сохрани структуру JSON.
Верни ТОЛЬКО валидный JSON без markdown в том же формате:
${JSON.stringify(content)}`;

    const raw = await this.chatCompletion(
      [
        {
          role: "system",
          content: "Ты HR-эксперт. Улучшаешь резюме и возвращаешь только JSON.",
        },
        { role: "user", content: prompt },
      ],
      userId,
      AiCapability.ResumeImprove,
    );

    try {
      const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
      return { content: JSON.parse(cleaned) as ResumeContent, summary: "Резюме улучшено с помощью AI" };
    } catch {
      return {
        content: this.basicImprove(content),
        summary: "Применены базовые улучшения (подключите OPENAI_API_KEY для полного AI)",
      };
    }
  }

  private basicImprove(content: ResumeContent): ResumeContent {
    const about = content.about?.trim()
      ? content.about
      : `Опытный специалист в сфере ${content.personal.desiredPosition}. Готов к новым вызовам.`;

    return {
      ...content,
      about,
      experience: content.experience.map((exp) => ({
        ...exp,
        description:
          exp.description ||
          `Работал(а) в ${exp.company} на позиции ${exp.position}. Достигал(а) измеримых результатов в проектах.`,
      })),
    };
  }

  private async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    userId: string | undefined,
    capability: AiCapability,
  ): Promise<string> {
    const apiKey = this.config.get<string>("OPENAI_API_KEY");

    if (!apiKey) {
      return this.fallbackReply(messages[messages.length - 1]?.content ?? "");
    }

    const model = this.config.get<string>("AI_MODEL") ?? "gpt-4o-mini";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        return this.fallbackReply(messages[messages.length - 1]?.content ?? "");
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };

      const reply = data.choices?.[0]?.message?.content ?? this.fallbackReply(messages[messages.length - 1]?.content ?? "");

      if (userId) {
        await this.prisma.aiRequest.create({
          data: {
            userId,
            capability,
            model,
            inputTokens: data.usage?.prompt_tokens ?? 0,
            outputTokens: data.usage?.completion_tokens ?? 0,
            status: "SUCCESS",
          },
        });
      }

      return reply;
    } catch {
      return this.fallbackReply(messages[messages.length - 1]?.content ?? "");
    }
  }

  private fallbackReply(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("резюме") || lower.includes("resume")) {
      return "Откройте раздел **Моё резюме** → создайте или отредактируйте резюме. Нажмите **Улучшить с AI** для автоматической доработки текста.";
    }
    if (lower.includes("react") || lower.includes("ваканс")) {
      return "Нашёл подходящие вакансии в ленте. Уточните город и уровень (junior/middle/senior) — подберу точнее.";
    }
    if (lower.includes("интервью")) {
      return "**Советы:**\n1. Изучите компанию и продукт\n2. Подготовьте STAR-истории\n3. Потренируйте технические задачи\n4. Подготовьте вопросы работодателю";
    }
    if (lower.includes("зарплат")) {
      return "Исследуйте вилку по рынку, обсуждайте компенсацию после оффера, учитывайте бонусы и удалёнку.";
    }

    return `Понял запрос: «${message.slice(0, 80)}». Могу помочь с резюме, поиском вакансий, подготовкой к интервью или советами по зарплате.`;
  }
}

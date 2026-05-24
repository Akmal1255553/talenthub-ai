"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiApi, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Привет! Я AI-агент TalentHub. Помогу:\n\n• Найти вакансии под ваш профиль\n• Улучшить резюме и отклики\n• Подготовиться к собеседованию\n• Оценить зарплату на рынке\n\nЧем помочь?",
    timestamp: new Date(),
    suggestions: ["Найти React-вакансии", "Проверить резюме", "Советы по интервью", "Зарплата"],
  },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    let response =
      "Понял ваш запрос. Войдите в аккаунт для персональных рекомендаций или откройте **Моё резюме** для создания CV.";

    try {
      const res = await aiApi.chat(currentInput);
      response = res.reply;
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        response = localFallback(currentInput);
      } else {
        response =
          "Для полного AI-ответа [войдите в аккаунт](/auth/login). Пока подскажу: создайте резюме в разделе **Моё резюме** — это основа для откликов.";
      }
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
      suggestions: ["Найти React-вакансии", "Моё резюме", "Советы по интервью"],
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  function localFallback(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("резюме")) {
      return "Откройте **/candidate/resume** — пошаговый конструктор с превью и кнопкой «Улучшить с AI».";
    }
    if (lower.includes("react") || lower.includes("ваканс")) {
      return "В ленте дашборда есть подходящие вакансии. Уточните город и грейд для точного подбора.";
    }
    return `Запрос: «${text.slice(0, 60)}». Подключите OPENAI_API_KEY в .env для умных ответов через API.`;
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full font-semibold shadow-xl transition-all duration-300",
          isOpen
            ? "bg-foreground px-4 py-3 text-background hover:scale-100"
            : "animate-pulse-glow bg-gradient-to-r from-[var(--brand)] to-[oklch(0.55_0.2_290)] px-5 py-3.5 text-white hover:scale-105 hover:shadow-2xl",
        )}
      >
        {isOpen ? (
          <>
            <X className="size-5" />
            <span>Закрыть</span>
          </>
        ) : (
          <>
            <Sparkles className="size-5" />
            <span>AI-агент</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="animate-scale-in fixed bottom-24 right-6 z-50 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[var(--brand)] to-[oklch(0.55_0.2_290)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Career Agent</h3>
                <p className="text-xs text-white/80">Подключён к TalentHub</p>
              </div>
            </div>
            <Badge className="border-0 bg-white/20 text-white">Online</Badge>
          </div>

          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 animate-fade-in", message.role === "user" && "flex-row-reverse")}
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback
                      className={cn(
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-white"
                          : "bg-secondary text-foreground",
                      )}
                    >
                      {message.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn("max-w-[82%] space-y-2", message.role === "user" && "items-end")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        message.role === "user"
                          ? "rounded-tr-sm bg-foreground text-background"
                          : "rounded-tl-sm bg-secondary text-foreground",
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.suggestions.map((suggestion) => (
                          <Badge
                            key={suggestion}
                            variant="outline"
                            className="cursor-pointer text-xs transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-white">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-white p-3">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground">
                <Paperclip className="size-4" />
              </Button>
              <Input
                placeholder="Напишите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-border"
              />
              <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground">
                <Mic className="size-4" />
              </Button>
              <Button
                variant="brand"
                size="icon"
                className="shrink-0"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

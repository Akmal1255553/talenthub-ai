"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Привет! Я AI-агент TalentHub. Помогу с поиском вакансий, резюме, откликами и подготовкой к интервью. О чём поговорим?",
    suggestions: ["Подобрать вакансии", "Улучшить резюме", "Советы по интервью"],
  },
];

interface AISidebarProps {
  contextHint?: string;
  className?: string;
  compact?: boolean;
}

export function AISidebar({ contextHint, className, compact }: AISidebarProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const lastHint = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!contextHint || lastHint.current === contextHint) return;
    lastHint.current = contextHint;
    setMessages((prev) => [
      ...prev,
      {
        id: `ctx-${Date.now()}`,
        role: "assistant",
        content: contextHint,
        suggestions: ["Расскажи подробнее", "Подходит ли мне?", "Как откликнуться?"],
      },
    ]);
  }, [contextHint]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: currentInput }]);
    setInput("");
    setIsTyping(true);

    let response = "Не удалось получить ответ. Проверьте подключение к API.";

    try {
      const res = await aiApi.chat(currentInput);
      response = res.reply;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        response = "Войдите в аккаунт, чтобы AI учитывал ваш профиль и резюме.";
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        suggestions: ["Ещё вакансии", "Моё резюме", "Зарплата"],
      },
    ]);
    setIsTyping(false);
  };

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg",
        compact ? "min-h-0" : "h-[calc(100vh-140px)] min-h-[520px]",
        className,
      )}
    >
      <div
        className={cn(
          "border-b border-border bg-gradient-to-r from-[var(--brand)] to-[oklch(0.55_0.2_290)]",
          compact ? "p-3" : "p-4",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Career Agent</h3>
            <p className="text-xs text-white/80">
              {user ? `Привет, ${user.name.split(" ")[0]}!` : "TalentHub AI"}
            </p>
          </div>
        </div>
        <Badge className="mt-3 border-0 bg-white/20 text-white">Online</Badge>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-2.5", message.role === "user" && "flex-row-reverse")}
            >
              <Avatar className="size-8 shrink-0">
                {message.role === "user" && user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback
                  className={cn(
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-[var(--brand)] to-[oklch(0.55_0.2_290)] text-white"
                      : "bg-secondary",
                  )}
                >
                  {message.role === "user" ? (
                    user?.name?.[0]?.toUpperCase() ?? <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className={cn("max-w-[85%] space-y-1.5", message.role === "user" && "items-end")}>
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-tr-sm bg-foreground text-background"
                      : "rounded-tl-sm bg-secondary",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.suggestions?.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="mr-1 cursor-pointer text-xs hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
                    onClick={() => setInput(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="size-2 animate-bounce rounded-full bg-muted-foreground" />
              <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.15s]" />
              <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.3s]" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1"
          />
          <Button variant="brand" size="icon" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

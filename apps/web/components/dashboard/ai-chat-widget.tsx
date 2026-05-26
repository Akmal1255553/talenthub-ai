"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISidebar } from "@/components/dashboard/ai-sidebar";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/candidate/chat"];

export function AiChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="pointer-events-auto w-[min(calc(100vw-2rem),380px)] animate-scale-in">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute -right-1 -top-1 z-10 size-8 rounded-full bg-card shadow-md"
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
            >
              <X className="size-4" />
            </Button>
            <AISidebar
              className="h-[min(70vh,520px)] min-h-[400px] shadow-2xl ring-2 ring-[var(--brand)]/20"
              compact
            />
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="brand"
        size="lg"
        className={cn(
          "pointer-events-auto size-14 rounded-full shadow-xl shadow-[var(--brand)]/30 transition-transform hover:scale-105",
          open && "ring-2 ring-white/50",
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Свернуть AI-чат" : "Открыть AI-чат"}
      >
        {open ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </Button>

      {!open && (
        <span className="pointer-events-none absolute -left-2 top-1/2 hidden -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg bg-card px-2 py-1 text-xs font-medium shadow-md sm:block">
          <MessageCircle className="mr-1 inline size-3.5 text-[var(--brand)]" />
          Спросить AI
        </span>
      )}
    </div>
  );
}

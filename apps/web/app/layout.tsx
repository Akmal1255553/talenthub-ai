import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AiChatHost } from "@/components/ai-chat-host";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentHub AI — поиск работы с ИИ",
  description:
    "Платформа для соискателей и работодателей: вакансии, подписки и AI-агент для подбора персонала и карьеры.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={plusJakarta.variable}>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <AiChatHost />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

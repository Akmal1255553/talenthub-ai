"use client";

import { useEffect, useRef, useState } from "react";
import { UserRole } from "@talenthub/shared";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { formatApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type GoogleSignInButtonProps = {
  role?: UserRole;
  mode?: "login" | "register";
};

export function GoogleSignInButton({ role = UserRole.Candidate, mode = "login" }: GoogleSignInButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { loginWithGoogle, loginWithGoogleDev } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDevForm, setShowDevForm] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const [devName, setDevName] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const devMock =
    process.env.NEXT_PUBLIC_GOOGLE_DEV_MOCK === "true" ||
    process.env.NODE_ENV === "development";

  const label =
    mode === "register" ? "Зарегистрироваться через Google" : "Войти через Google";

  useEffect(() => {
    if (!clientId || !ref.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google || !ref.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          setError("");
          setLoading(true);
          try {
            await loginWithGoogle(response.credential, role, mode);
          } catch (e) {
            setError(formatApiError(e, "Ошибка входа через Google"));
          } finally {
            setLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(ref.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        width: 360,
        text: mode === "register" ? "signup_with" : "continue_with",
        locale: "ru",
      });
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [clientId, loginWithGoogle, role, mode]);

  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithGoogleDev(
        { email: devEmail.trim(), name: devName.trim() || devEmail.split("@")[0], role },
        mode,
      );
    } catch (err) {
      setError(formatApiError(err, "Ошибка входа через Google"));
    } finally {
      setLoading(false);
    }
  };

  if (clientId) {
    return (
      <div className="space-y-2">
        <div ref={ref} className="flex justify-center" />
        {loading && (
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Вход через Google...
          </p>
        )}
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  if (!devMock) {
    return (
      <div className="space-y-2 rounded-xl border border-dashed border-border bg-secondary/50 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Для входа через Google добавьте Client ID в корневой <code className="text-xs">.env</code>:
        </p>
        <p className="mt-1 font-mono text-xs text-foreground">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID=ваш-id.apps.googleusercontent.com
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Инструкция:{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand)] underline"
          >
            Google Cloud Console → Credentials
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!showDevForm ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "h-12 w-full cursor-pointer gap-3 border-border bg-white font-medium text-foreground shadow-sm",
            "hover:bg-secondary/80",
          )}
          disabled={loading}
          onClick={() => setShowDevForm(true)}
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          {label}
        </Button>
      ) : (
        <form
          onSubmit={handleDevSubmit}
          className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4"
        >
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Локальный режим.</strong> Укажите email вашего Google-аккаунта.
            После настройки Client ID в .env появится настоящая кнопка Google.
          </p>
          <div className="space-y-2">
            <Label htmlFor="google-dev-email">Email Google</Label>
            <Input
              id="google-dev-email"
              type="email"
              required
              placeholder="you@gmail.com"
              value={devEmail}
              onChange={(e) => setDevEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="google-dev-name">Имя (необязательно)</Label>
            <Input
              id="google-dev-name"
              placeholder="Иван Иванов"
              value={devName}
              onChange={(e) => setDevName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowDevForm(false)}>
              Назад
            </Button>
            <Button type="submit" variant="brand" size="sm" className="flex-1" disabled={loading}>
              {loading ? "Вход..." : "Продолжить"}
            </Button>
          </div>
        </form>
      )}

      {error && <p className="text-center text-sm text-destructive">{error}</p>}

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">Настроить настоящий Google OAuth</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand)] underline"
            >
              Google Cloud Console
            </a>{" "}
            → Create Credentials → OAuth client ID (Web)
          </li>
          <li>Authorized JavaScript origins: <code>http://localhost:3000</code></li>
          <li>
            В <code>.env</code> проекта: <code>GOOGLE_CLIENT_ID</code> и{" "}
            <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> (одинаковые)
          </li>
          <li>Перезапустите API и Next.js</li>
        </ol>
      </details>
    </div>
  );
}

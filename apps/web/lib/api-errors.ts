import { ApiError } from "@/lib/api";

export function formatApiError(err: unknown, fallback = "Произошла ошибка"): string {
  if (!(err instanceof ApiError)) return fallback;

  const raw = err.message;
  const lower = raw.toLowerCase();

  if (lower.includes("internal server error") || err.status >= 500) {
    return "Сервер временно недоступен. Убедитесь, что API запущен (порт 4000).";
  }
  if (lower.includes("already registered") || lower.includes("email is already")) {
    return "Этот email уже зарегистрирован. Войдите или восстановите пароль.";
  }
  if (lower.includes("invalid credentials")) {
    return "Неверный email или пароль.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Нет связи с сервером. Проверьте, что API запущен.";
  }

  return raw;
}

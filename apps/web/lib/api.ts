import type { AuthResponse, AuthUser, ResumeContent, ResumeListItem, ResumeRecord } from "@talenthub/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      message = Array.isArray(body.message) ? body.message.join(", ") : (body.message ?? message);
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const authApi = {
  register: (body: { email: string; password: string; name: string; role: string }) =>
    apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () =>
    apiFetch<
      AuthUser & {
        candidate?: { id: string; headline?: string; location?: string; resumeCount: number } | null;
      }
    >("/auth/me"),
};

export const resumeApi = {
  list: () => apiFetch<{ items: ResumeListItem[] }>("/candidate/resumes"),

  get: (id: string) => apiFetch<ResumeRecord>(`/candidate/resumes/${id}`),

  create: (body: { title: string; content: ResumeContent }) =>
    apiFetch<ResumeRecord>("/candidate/resumes", { method: "POST", body: JSON.stringify(body) }),

  update: (id: string, body: { title?: string; content?: ResumeContent }) =>
    apiFetch<ResumeRecord>(`/candidate/resumes/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  remove: (id: string) => apiFetch<{ ok: boolean }>(`/candidate/resumes/${id}`, { method: "DELETE" }),

  improve: (id: string) => apiFetch<ResumeRecord>(`/candidate/resumes/${id}/improve`, { method: "POST" }),
};

export const aiApi = {
  chat: (message: string) =>
    apiFetch<{ reply: string }>("/ai/assistant", { method: "POST", body: JSON.stringify({ message }) }),

  improveContent: (content: ResumeContent) =>
    apiFetch<{ content: ResumeContent; summary?: string }>("/ai/resume/improve", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

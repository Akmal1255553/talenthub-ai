import type { AuthResponse, AuthUser, JobVacancy, ResumeContent, ResumeListItem, ResumeRecord } from "@talenthub/shared";

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
    ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
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

  googleLogin: (body: { idToken: string; role?: string }) =>
    apiFetch<AuthResponse>("/auth/google", { method: "POST", body: JSON.stringify(body) }),

  googleDevLogin: (body: { email: string; name: string; role?: string; avatarUrl?: string }) =>
    apiFetch<AuthResponse>("/auth/google/dev", { method: "POST", body: JSON.stringify(body) }),
};

export const jobsApi = {
  list: (q?: string) => apiFetch<{ items: JobVacancy[] }>(`/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  get: (slug: string) => apiFetch<JobVacancy>(`/jobs/${slug}`),
  getById: (id: string) => apiFetch<JobVacancy>(`/jobs/id/${id}`),
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

  uploadPdf: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ResumeRecord>("/candidate/resumes/upload-pdf", {
      method: "POST",
      body: formData,
    });
  },
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

export const applicationsApi = {
  list: () => apiFetch<{ items: unknown[] }>("/candidate/applications"),

  apply: (vacancyId: string, coverLetter?: string) =>
    apiFetch<unknown>("/candidate/applications", {
      method: "POST",
      body: JSON.stringify({ vacancyId, coverLetter }),
    }),

  listForVacancy: (vacancyId: string) =>
    apiFetch<{ vacancyId: string; items: unknown[] }>(`/employer/vacancies/${vacancyId}/applications`),

  score: (applicationId: string) =>
    apiFetch<unknown>(`/employer/applications/${applicationId}/score`, { method: "POST" }),
};

export const employerApi = {
  getCompany: (id: string) => apiFetch<unknown>(`/employer/companies/${id}`),

  createCompany: (data: { name: string; description?: string; website?: string }) =>
    apiFetch<unknown>("/employer/companies", { method: "POST", body: JSON.stringify(data) }),

  updateCompany: (id: string, data: { name?: string; description?: string; website?: string }) =>
    apiFetch<unknown>(`/employer/companies/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteCompany: (id: string) =>
    apiFetch<unknown>(`/employer/companies/${id}`, { method: "DELETE" }),

  analytics: () => apiFetch<{ activeVacancies: number; applications: number; conversionRate: number }>("/employer/analytics"),
};

export const billingApi = {
  plans: () => apiFetch<unknown>("/billing/plans"),

  checkout: (plan: string) =>
    apiFetch<{ checkoutUrl: string; subscription: unknown; payment?: unknown }>("/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
};

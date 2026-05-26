export type AuthUserRole = "CANDIDATE" | "EMPLOYER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthUserRole;
  avatarUrl?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

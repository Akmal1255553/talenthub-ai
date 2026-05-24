export enum UserRole {
  Candidate = 'CANDIDATE',
  Employer = 'EMPLOYER',
  Admin = 'ADMIN',
}

export enum SubscriptionPlan {
  Free = 'FREE',
  Premium = 'PREMIUM',
  Business = 'BUSINESS',
}

export enum AiCapability {
  ResumeImprove = 'RESUME_IMPROVE',
  JobRecommendations = 'JOB_RECOMMENDATIONS',
  CandidateScoring = 'CANDIDATE_SCORING',
  CoverLetter = 'COVER_LETTER',
  AssistantChat = 'ASSISTANT_CHAT',
  EmployerAnalytics = 'EMPLOYER_ANALYTICS',
}

export const PLAN_LIMITS = {
  [SubscriptionPlan.Free]: {
    monthlyApplications: 10,
    activeVacancies: 2,
    aiRequests: 5,
  },
  [SubscriptionPlan.Premium]: {
    monthlyApplications: 100,
    activeVacancies: 2,
    aiRequests: 100,
  },
  [SubscriptionPlan.Business]: {
    monthlyApplications: 25,
    activeVacancies: 50,
    aiRequests: 1000,
  },
} as const;

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export * from "./auth";
export * from "./resume";

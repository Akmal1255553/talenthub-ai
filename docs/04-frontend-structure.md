# Frontend Structure

## Route Map

```text
app/
  (public)/
    page.tsx
    jobs/page.tsx
    jobs/[slug]/page.tsx
    companies/[slug]/page.tsx
  (auth)/
    login/page.tsx
    register/page.tsx
  candidate/
    dashboard/page.tsx
    resumes/page.tsx
    applications/page.tsx
    recommendations/page.tsx
    billing/page.tsx
  employer/
    dashboard/page.tsx
    vacancies/page.tsx
    candidates/page.tsx
    analytics/page.tsx
    billing/page.tsx
  admin/
    page.tsx
    users/page.tsx
    vacancies/page.tsx
    payments/page.tsx
    ai-usage/page.tsx
```

## UI Principles

- Dense, calm dashboard layout for repeated work.
- SEO-first public job pages rendered on the server.
- Mobile-responsive filters and application forms.
- Clear state for loading, empty, error, and permission denied views.
- Role-aware navigation after login.

## Feature Modules

- `features/auth`: login, register, refresh, guards.
- `features/jobs`: search filters, job cards, vacancy details.
- `features/resumes`: builder, preview, AI improvement.
- `features/employer`: vacancy editor, applicant pipeline, analytics.
- `features/chat`: real-time conversation panel.
- `features/billing`: plans, checkout, account portal.
- `features/admin`: moderation and operational tables.

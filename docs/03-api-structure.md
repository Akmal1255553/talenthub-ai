# API Structure

Base URL: `/api/v1`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Candidate

- `GET /candidate/profile`
- `PATCH /candidate/profile`
- `POST /candidate/resumes`
- `GET /candidate/resumes`
- `GET /candidate/resumes/:id`
- `PATCH /candidate/resumes/:id`
- `POST /candidate/resumes/:id/improve`
- `GET /candidate/applications`
- `POST /candidate/applications`
- `GET /candidate/recommendations`

## Employer

- `POST /employer/companies`
- `GET /employer/companies/:id`
- `PATCH /employer/companies/:id`
- `POST /employer/vacancies`
- `GET /employer/vacancies`
- `PATCH /employer/vacancies/:id`
- `GET /employer/vacancies/:id/applications`
- `POST /employer/applications/:id/score`
- `GET /employer/analytics`

## Public Jobs

- `GET /jobs`
- `GET /jobs/:slug`
- `GET /jobs/:id/similar`

## Chat and Notifications

- `GET /chats`
- `POST /chats`
- `GET /chats/:id/messages`
- `POST /chats/:id/messages`
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Billing

- `GET /billing/plans`
- `POST /billing/checkout`
- `POST /billing/portal`
- `POST /billing/webhooks/stripe`

## Admin

- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/vacancies`
- `PATCH /admin/vacancies/:id/moderation`
- `GET /admin/payments`
- `GET /admin/ai-usage`
- `GET /admin/audit-logs`

## API Conventions

- JSON request/response.
- Cursor pagination for feeds and search.
- Problem-style error body with `code`, `message`, `details`.
- Idempotency keys for billing and application creation.
- Swagger/OpenAPI published at `/docs`.

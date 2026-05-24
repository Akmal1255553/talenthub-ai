# Full Project Architecture

## Monorepo Layout

```text
apps/
  api/
    prisma/                 database schema and migrations
    src/
      modules/
        auth/
        users/
        candidates/
        employers/
        vacancies/
        applications/
        search/
        chat/
        notifications/
        billing/
        ai/
        admin/
      common/               guards, decorators, filters, interceptors
      config/               environment and service config
      jobs/                 BullMQ processors
  web/
    app/                    Next.js App Router pages
    components/             reusable UI and domain components
    features/               auth, jobs, dashboard, admin, billing
    lib/                    API client, auth helpers, formatters
packages/
  shared/
    src/                    shared enums, plan limits, API DTO helpers
docs/
infra/
```

## Backend Architecture

- NestJS modules per business capability.
- Prisma as the database access layer.
- PostgreSQL for durable relational data.
- Redis for sessions, rate limits, queue transport, and cache.
- BullMQ workers for email, notifications, AI scoring, analytics aggregation.
- Swagger generated from decorators at `/docs`.
- JWT access token plus rotating refresh token.

## Frontend Architecture

- Next.js App Router.
- Route groups for public pages, candidate dashboard, employer dashboard, admin console.
- Server components for SEO-friendly public job pages.
- Client components for dashboards, chat, filters, and forms.
- Tailwind CSS with a compact operational UI style.

## Security Model

- Role and permission guards on every protected API route.
- Tenant-aware employer access through company memberships.
- Input validation with DTOs and validation pipes.
- Rate limiting for auth, AI endpoints, search, and public forms.
- Audit logs for admin and billing-sensitive actions.

## Scalability Path

- Start as modular monolith.
- Extract AI workers, search indexing, and chat gateway as independent services when traffic requires it.
- Add OpenSearch/Meilisearch for full-text search once PostgreSQL indexes are insufficient.
- Add CDN/object storage for resume files and company assets.

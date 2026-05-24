# Database Schema

The canonical schema lives in `apps/api/prisma/schema.prisma`.

## Core Tables

- `users`: identity, email, password hash, status, role.
- `candidate_profiles`: candidate personal profile, headline, location, visibility.
- `resumes`: structured resume documents with AI score and promotion state.
- `companies`: employer organizations.
- `company_members`: employer users and company-scoped roles.
- `vacancies`: job posts, salary, location, employment type, status.
- `applications`: candidate applications and hiring stage.
- `chats` and `chat_messages`: candidate-employer conversations.
- `notifications`: in-app notification feed.
- `subscriptions`: current plan and provider metadata.
- `payments`: payment ledger.
- `ai_requests`: usage tracking, prompt metadata, token/cost accounting.
- `audit_logs`: security and admin action history.

## Important Indexes

- `users.email` unique.
- `vacancies.status`, `vacancies.location`, `vacancies.employmentType`, `vacancies.createdAt`.
- `applications.candidateId + vacancyId` unique to prevent duplicate applications.
- `subscriptions.ownerType + ownerId` for candidate/company billing lookup.
- `ai_requests.userId + createdAt` for rate limiting and usage reports.

## Search Strategy

MVP uses PostgreSQL full-text search fields on vacancies and resumes. Production scale can add an async search index:

1. Write source record in PostgreSQL.
2. Publish indexing job to Redis queue.
3. Worker upserts document into OpenSearch/Meilisearch.
4. API search module reads from search engine and hydrates details from PostgreSQL.

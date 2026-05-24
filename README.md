# TalentHub AI

Production-ready AI-powered job platform blueprint similar to hh.ru and LinkedIn Jobs.

## Stack

- Backend: NestJS REST API
- Frontend: Next.js App Router + Tailwind CSS
- Database: PostgreSQL
- Cache/queue: Redis + BullMQ
- Auth: JWT access/refresh tokens with role-based permissions
- Docs: Swagger/OpenAPI
- Infra: Docker Compose

## Workspace

```text
apps/
  api/       NestJS API, workers, Swagger, Prisma
  web/       Next.js user-facing app and dashboards
packages/
  shared/    shared DTOs, roles, plan constants
docs/        architecture, database, API, auth, AI, payments, admin, roadmap, deploy
infra/       Docker and deployment support
```

## Quick Start

```bash
npm install
cp .env.example .env
docker compose up -d postgres redis
npm run db:migrate
npm run dev
```

API docs will be available at `http://localhost:4000/docs`.
Web app will be available at `http://localhost:3000`.

## Generated From Prompt

See [docs/00-overview.md](docs/00-overview.md) for the ordered implementation output:

1. Full project architecture
2. Database schema
3. API structure
4. Frontend structure
5. Authentication flow
6. AI integration architecture
7. Subscription/payment logic
8. Admin panel structure
9. MVP roadmap
10. Deployment instructions

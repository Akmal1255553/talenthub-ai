# Deployment Instructions

## Local Development

```bash
npm install
cp .env.example .env
docker compose up -d postgres redis
npm run db:generate
npm run db:migrate
npm run dev
```

## Production Build

```bash
npm run build
docker compose build
```

## Required Services

- PostgreSQL 16+
- Redis 7+
- Object storage for uploads
- Email provider
- Payment provider
- AI provider
- Log and metrics platform

## Environment Variables

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_API_URL`

## Deployment Checklist

- Run migrations before starting new API version.
- Enable HTTPS and secure cookies.
- Configure CORS for production domains only.
- Set strong JWT secrets.
- Configure Stripe webhook endpoint.
- Configure backup schedule for PostgreSQL.
- Configure Redis persistence only if required by queue strategy.
- Enable structured logs and health checks.
- Run smoke tests against `/health`, `/docs`, and public jobs page.

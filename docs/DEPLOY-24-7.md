# TalentHub 24/7 Deployment

This project can run 24/7 using Docker Compose with auto-restart.

## 1) Server prerequisites

- Ubuntu 22.04+ (or any Linux with Docker support)
- Docker + Docker Compose plugin installed
- Ports open: `80` (optional reverse proxy), `3000`, `4000`

## 2) Prepare environment

Copy `.env.example` to `.env` and set production values:

- `NODE_ENV=production`
- `SKIP_DB_CONNECT=false`
- strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- `WEB_ORIGIN` (your domain, e.g. `https://talenthub.example.com`)
- `NEXT_PUBLIC_API_URL` (public API URL)
- `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## 3) Start stack

From repository root:

```bash
npm run deploy:up
```

Check status:

```bash
npm run deploy:ps
```

Follow logs:

```bash
npm run deploy:logs
```

## 4) Initialize database (first deploy)

Run migrations in API container:

```bash
docker compose exec api npm run prisma:migrate
```

## 5) Update release

```bash
git pull
npm run deploy:up
```

Docker services use `restart: unless-stopped`, so app recovers after reboot automatically.

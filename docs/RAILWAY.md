# Запуск TalentHub на Railway

Проект — монорепо: **API** (NestJS) + **Web** (Next.js) + **PostgreSQL**.

На Railway нужно **3 ресурса** в одном проекте:

1. PostgreSQL (база)
2. Service `api`
3. Service `web`

---

## Важно: имена сервисов

В Railway назовите сервисы **`api`** и **`web`** (Settings → Service name).  
Скрипты `npm run build` / `npm run start` в корне автоматически выбирают нужную сборку по `RAILWAY_SERVICE_NAME`.

Если Build/Start Command вручную пустые — Railway использует `nixpacks.toml` и корневые `build`/`start`.

---

## Шаг 1. Подключить репозиторий

1. [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → выберите `startup2`
3. Railway создаст первый сервис — переименуйте его в `api` (Settings → Service name)

---

## Шаг 2. Добавить PostgreSQL

1. В проекте: **+ New** → **Database** → **PostgreSQL**
2. Откройте Postgres → вкладка **Variables** → скопируйте `DATABASE_URL`

---

## Шаг 3. Сервис `api`

**Settings → General**

| Поле | Значение |
|------|----------|
| Root Directory | *(пусто — корень репо)* |
| Watch Paths | `apps/api/**`, `packages/shared/**` |

**Settings → Build**

| Поле | Значение |
|------|----------|
| Build Command | `npm run railway:build:api` |

**Settings → Deploy**

| Поле | Значение |
|------|----------|
| Start Command | `npm run railway:start:api` |

**Variables** (Raw Editor):

```env
NODE_ENV=production
SKIP_DB_CONNECT=false
DISABLE_REDIS=true
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=4000
API_PORT=4000
JWT_ACCESS_SECRET=сгенерируйте-длинный-секрет
JWT_REFRESH_SECRET=сгенерируйте-длинный-секрет
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
OPENAI_API_KEY=ваш-ключ
AI_MODEL=gpt-4o-mini
GOOGLE_CLIENT_ID=ваш-google-client-id
WEB_ORIGIN=https://ВАШ-WEB-ДОМЕН.up.railway.app
```

После деплоя API откройте **Settings → Networking → Generate Domain**  
Скопируйте URL, например: `https://talenthub-api-production.up.railway.app`

Проверка: `https://ВАШ-API/api/v1/health` → `{"status":"ok",...}`

---

## Шаг 4. Сервис `web`

1. **+ New** → **GitHub Repo** → тот же репозиторий
2. Переименуйте сервис в `web`

**Settings → General**

| Поле | Значение |
|------|----------|
| Root Directory | *(пусто)* |
| Watch Paths | `apps/web/**`, `packages/shared/**` |

**Build Command:**

```
npm run railway:build:web
```

**Start Command:**

```
npm run railway:start:web
```

**Variables** (важно: `NEXT_PUBLIC_*` нужны на этапе **build**):

```env
NODE_ENV=production
PORT=3000
WEB_PORT=3000
NEXT_PUBLIC_API_URL=https://ВАШ-API-ДОМЕН.up.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=тот-же-что-GOOGLE_CLIENT_ID
NEXT_PUBLIC_GOOGLE_DEV_MOCK=false
GOOGLE_DEV_MOCK=false
```

**Networking → Generate Domain** для web.

---

## Шаг 5. Связать CORS и Google

В сервисе **api** обновите:

```env
WEB_ORIGIN=https://ВАШ-WEB-ДОМЕН.up.railway.app
```

В [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

- **Authorized JavaScript origins:**  
  `https://ВАШ-WEB-ДОМЕН.up.railway.app`
- **Authorized redirect URIs** (если нужны): тот же URL

Пересоберите **web** и **api** (Redeploy).

---

## Шаг 6. Переменные между сервисами (опционально)

В Railway можно ссылаться на другой сервис:

```env
WEB_ORIGIN=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
```

Имена `web` / `api` — как названы сервисы в проекте.

---

## Частые ошибки

| Симптом | Решение |
|---------|---------|
| `ERR_CONNECTION_REFUSED` на сайте | Web не задеплоился — смотрите Deploy Logs |
| API 500 при регистрации | `SKIP_DB_CONNECT=false`, проверьте `DATABASE_URL` |
| Google не работает | Добавьте Railway-домен в Google Console |
| Пустой фронт / нет API | `NEXT_PUBLIC_API_URL` должен быть URL **api**, пересоберите web |
| Build падает на Prisma | Убедитесь, что Postgres добавлен до деплоя api |
| `migrate deploy` failed | В репо пока нет migrations — используется `prisma db push` при старте api |

> Позже для продакшена лучше создать миграции локально:  
> `npm run prisma:migrate -w @talenthub/api` и заменить start на `prisma:migrate:deploy`.

---

## Локальная проверка перед Railway

```bash
npm run railway:build:api
npm run railway:build:web
```

---

## Обновление после push в GitHub

Railway деплоит автоматически при push в ветку, подключённую к проекту.

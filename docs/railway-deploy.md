# Railway Template for Xeno Backend

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## Required Environment Variables

Set these in Railway project settings:

- `DATABASE_URL` — auto-provided by Railway Postgres plugin
- `APP_PORT` — set to `4000` or Railway's `$PORT` variable
- `JWT_SECRET` — random secret for JWT signing (e.g. openssl rand -hex 32)
- `SHOPIFY_WEBHOOK_SECRET` — (optional) for webhook HMAC verification

## Setup Steps

1. Click "Deploy on Railway" and connect your GitHub repo
2. Add Postgres plugin to the project
3. Set environment variables above
4. Railway will auto-build using Dockerfile.backend
5. Run migrations: `railway run npx prisma migrate deploy`

## One-Click Deploy (Alternative)

Or manually:

```bash
railway login
railway init
railway add --plugin postgresql
railway up
railway run npx prisma migrate deploy
```

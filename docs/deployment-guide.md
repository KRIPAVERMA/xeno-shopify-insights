# Complete Deployment Guide

This guide covers deploying the Xeno demo to Railway (recommended), Render, or Heroku.

## Prerequisites

- GitHub account
- Railway/Render/Heroku account
- Git installed locally
- Node.js 18+ installed

## Option 1: Railway (Recommended)

Railway provides the easiest deployment with managed Postgres.

### Step 1: Push to GitHub

```powershell
cd "c:\vol D old\web dev\xeno"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KRIPAVERMA/xeno-demo.git
git push -u origin main
```

### Step 2: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `xeno-demo` repository
5. Click "Add Plugin" → "PostgreSQL"
6. Click "New" → "Empty Service" → Select your backend
7. Configure the service:
   - **Build Command**: (auto-detected from Dockerfile.backend)
   - **Start Command**: `node src/index.js`
   - **Root Directory**: `backend`

### Step 3: Set Environment Variables

In Railway backend service settings → Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
APP_PORT=4000
JWT_SECRET=your-random-secret-here
SHOPIFY_WEBHOOK_SECRET=your-shopify-secret
```

Generate JWT secret:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 4: Run Migrations

In Railway backend service → Settings → Deploy:

Add **Deploy Command**:
```bash
npx prisma migrate deploy && node src/index.js
```

Or manually in Railway CLI:
```powershell
railway link
railway run npx prisma migrate deploy
```

### Step 5: Deploy Frontend

1. In same Railway project, click "New" → "GitHub Repo"
2. Select your repo again
3. Configure:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Step 6: Set Frontend Variables

```
NEXT_PUBLIC_BACKEND_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

Replace with actual backend public URL from Railway.

### Step 7: Get Public URLs

Railway auto-generates public URLs. Click "Generate Domain" for both services.

Example:
- Backend: `https://xeno-backend-production.up.railway.app`
- Frontend: `https://xeno-web-production.up.railway.app`

## Option 2: Render

### Step 1: Push to GitHub

Same as Railway Step 1.

### Step 2: Create Postgres Database

1. Go to [render.com](https://render.com)
2. New → PostgreSQL
3. Name: `xeno-db`
4. Region: Choose closest to your users
5. Click "Create Database"
6. Copy the **Internal Database URL**

### Step 3: Deploy Backend

1. New → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Name**: `xeno-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`

4. Environment Variables:
   ```
   DATABASE_URL=<internal-postgres-url>
   APP_PORT=4000
   JWT_SECRET=<random-secret>
   ```

### Step 4: Deploy Frontend

1. New → Web Service
2. Same repo
3. Configure:
   - **Name**: `xeno-web`
   - **Root Directory**: `web`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. Environment Variable:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://xeno-backend.onrender.com
   ```

## Option 3: Heroku

### Step 1: Install Heroku CLI

```powershell
# Using Chocolatey
choco install heroku-cli
```

### Step 2: Login and Create Apps

```powershell
heroku login
heroku create xeno-backend
heroku create xeno-web
```

### Step 3: Add Postgres to Backend

```powershell
cd backend
heroku addons:create heroku-postgresql:essential-0 -a xeno-backend
```

### Step 4: Deploy Backend

Create `backend/Procfile`:
```
web: node src/index.js
release: npx prisma migrate deploy
```

```powershell
cd backend
git init
git add .
git commit -m "Backend"
heroku git:remote -a xeno-backend
git push heroku main
```

Set environment variables:
```powershell
heroku config:set JWT_SECRET=your-secret -a xeno-backend
heroku config:set APP_PORT=$PORT -a xeno-backend
```

### Step 5: Deploy Frontend

Create `web/Procfile`:
```
web: npm start
```

```powershell
cd ../web
git init
git add .
git commit -m "Frontend"
heroku git:remote -a xeno-web
heroku config:set NEXT_PUBLIC_BACKEND_URL=https://xeno-backend.herokuapp.com
git push heroku main
```

## Option 4: Docker Compose (Local Production)

For local testing with production-like setup:

```powershell
cd "c:\vol D old\web dev\xeno"
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Backend on port 4000
- Web on port 3000

Run migrations:
```powershell
docker-compose exec backend npx prisma migrate deploy
```

## Post-Deployment Setup

### 1. Create Initial Tenant

```powershell
$backend = "https://your-backend-url.com"
$tenant = Invoke-RestMethod -Method Post -Uri "$backend/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Production Store","shopifyShop":"mystore.myshopify.com"}'

Write-Host "Tenant API Key: $($tenant.apiKey)"
```

### 2. Register First User

```powershell
$user = Invoke-RestMethod -Method Post -Uri "$backend/api/auth/register" `
  -ContentType "application/json" `
  -Body "{`"email`":`"admin@yourcompany.com`",`"password`":`"secure-password`",`"apiKey`":`"$($tenant.apiKey)`"}"
```

### 3. Configure Shopify Webhooks

In Shopify Admin → Settings → Notifications → Webhooks:

Add webhooks pointing to `https://your-backend-url.com/api/ingest/webhook/shopify`

**Topics to subscribe**:
- `customers/create`
- `customers/update`
- `orders/create`
- `orders/updated`
- `products/create`
- `products/update`

**Headers**:
```
x-tenant-apikey: <your-api-key>
```

## Monitoring & Health Checks

### Add Health Check Endpoint

Edit `backend/src/index.js`:

```javascript
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});
```

### Configure Platform Health Checks

**Railway**: Auto-detects health
**Render**: Settings → Health Check Path: `/health`
**Heroku**: Add to Procfile: `web: node src/index.js`

## Troubleshooting

### Backend won't start

1. Check DATABASE_URL is set
2. Verify migrations ran: `railway run npx prisma migrate deploy`
3. Check logs: `railway logs` or Render/Heroku logs

### Database connection errors

1. Ensure DATABASE_URL uses internal hostname (not public)
2. Check database is provisioned
3. Verify SSL settings (Render requires `?sslmode=require`)

### Frontend can't reach backend

1. Verify NEXT_PUBLIC_BACKEND_URL is set correctly
2. Check CORS is configured in backend
3. Test backend health: `curl https://backend-url/health`

### Webhooks not working

1. Verify HMAC secret matches Shopify
2. Check x-tenant-apikey header is sent
3. Test manually with curl
4. Check backend logs for errors

## Cost Estimates

### Railway (Recommended)
- Hobby Plan: $5/month
- Includes 512MB RAM, shared CPU
- Postgres: $5/month (512MB)
- **Total**: ~$10/month

### Render
- Free tier available (limitations apply)
- Starter: $7/month per service
- Postgres: $7/month
- **Total**: ~$21/month

### Heroku
- Basic dyno: $7/month per app
- Postgres Essential: $5/month
- **Total**: ~$19/month

## Scaling Recommendations

### < 1K users
- Single backend instance
- Single web instance
- Standard Postgres

### 1K - 10K users
- 2-3 backend instances (horizontal scaling)
- Add Redis for caching
- Postgres with connection pooling

### > 10K users
- Load balancer
- Message queue for webhooks
- Read replicas for analytics
- CDN for frontend

## Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] SHOPIFY_WEBHOOK_SECRET matches Shopify config
- [ ] HTTPS enabled (platform default)
- [ ] CORS configured properly
- [ ] Database has strong password
- [ ] Environment variables not in code
- [ ] API rate limiting enabled
- [ ] Webhook HMAC verification enabled

## Backup & Recovery

### Database Backups

**Railway**: Auto-backups included
**Render**: Daily backups in paid plans
**Heroku**: Use `heroku pg:backups:capture`

### Manual Backup

```powershell
# Export data
railway run npx prisma db pull

# Or direct SQL dump
pg_dump $DATABASE_URL > backup.sql
```

## CI/CD Pipeline (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/cli@v3
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        with:
          command: up
```

Get Railway token: `railway whoami --json`

## Next Steps

1. Test the deployment thoroughly
2. Seed with demo data
3. Create a video walkthrough
4. Share deployment URLs with stakeholders
5. Monitor logs for any issues

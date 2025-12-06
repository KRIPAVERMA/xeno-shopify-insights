## Demo Instructions

### 1. Setup Backend Locally

```powershell
cd "c:\vol D old\web dev\xeno\backend"
npm install
npx prisma generate
npx prisma migrate reset --force
npm run dev
```

Backend will start at `http://localhost:4000`

### 2. Create a Tenant

```powershell
curl -X POST http://localhost:4000/api/tenants -H "Content-Type: application/json" -d "{\"name\":\"Demo Store\",\"shopifyShop\":\"demo.myshopify.com\"}"
```

Save the returned `apiKey` and `tenantId`.

### 3. Register a User

```powershell
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@demo.com\",\"password\":\"test123\",\"name\":\"Admin\",\"apiKey\":\"<YOUR_API_KEY>\"}"
```

### 4. Start Frontend

```powershell
cd "c:\vol D old\web dev\xeno\web"
npm install
npm run dev
```

Web app will start at `http://localhost:3000`

### 5. Login and View Dashboard

- Open `http://localhost:3000`
- Click "Register" or "Login"
- Paste your tenant API key, email and password
- View dashboard with metrics

### 6. Send Test Data via Webhook

```powershell
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "Content-Type: application/json" `
  -H "x-tenant-apikey: <YOUR_API_KEY>" `
  -d "{\"topic\":\"customers/create\",\"data\":{\"id\":123,\"email\":\"customer@example.com\",\"first_name\":\"John\",\"last_name\":\"Doe\"}}"
```

```powershell
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "Content-Type: application/json" `
  -H "x-tenant-apikey: <YOUR_API_KEY>" `
  -d "{\"topic\":\"orders/create\",\"data\":{\"id\":456,\"total_price\":\"99.99\",\"currency\":\"USD\",\"created_at\":\"2025-12-06T10:00:00Z\",\"customer\":{\"id\":123}}}"
```

Refresh the dashboard to see updated metrics.

### 7. Optional: Run Scheduler

```powershell
cd backend
node src/scheduler/poller.js
```

This polls every 5 minutes and creates demo events.

## Docker Compose (Postgres)

```powershell
docker-compose up -d
```

This starts Postgres + backend + web. Migrations run automatically on backend start.

## Deploy to Railway

See `docs/railway-deploy.md` for deployment instructions.

## Video Demo

Record a quick video walkthrough:
1. Show repo structure
2. Start backend and create tenant
3. Start frontend, register/login
4. Send test webhooks
5. Show dashboard metrics updating

Use OBS Studio or Loom for recording.

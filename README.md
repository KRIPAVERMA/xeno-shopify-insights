# Xeno — Shopify Data Ingestion & Insights (Demo)

Multi-tenant Shopify data ingestion service with analytics dashboard, built as a technical assignment demonstration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Shopify Stores                            │
│         (Multiple Tenants - Multi-Store Support)            │
└────────────────────────┬────────────────────────────────────┘
                         │ Webhooks
                         │ (customers, orders, products)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ POST /api/tenants        - Onboard new stores       │  │
│  │ POST /api/auth/register  - User registration        │  │
│  │ POST /api/auth/login     - User authentication      │  │
│  │ POST /api/ingest/webhook - Receive Shopify data     │  │
│  │ GET  /api/metrics        - Dashboard analytics      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL / SQLite Database                    │
│  Multi-tenant schema with row-level isolation               │
│  Tables: Tenant, User, Customer, Order, Product, Event      │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │ HTTP API
                         │
┌─────────────────────────────────────────────────────────────┐
│              Dashboard Frontend (Next.js)                    │
│  Landing → Register/Login → Dashboard                       │
│  Metrics: Customers, Orders, Revenue, Top Spenders          │
└─────────────────────────────────────────────────────────────┘
```

## Features

✅ Multi-tenant architecture with data isolation  
✅ Shopify webhook ingestion (customers, orders, products, events)  
✅ Email/password authentication with JWT  
✅ Real-time insights dashboard (customers, orders, revenue, top spenders)  
✅ Webhook HMAC verification support  
✅ Background scheduler for data sync  
✅ Docker & docker-compose ready  
✅ Railway deployment ready  

## Tech Stack

- **Backend**: Node.js, Express, Prisma ORM
- **Frontend**: Next.js (React)
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Auth**: bcrypt + JWT
- **Deployment**: Railway, Render, or Heroku

## Project Structure

```
xeno/
├── backend/              # Express API server
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── routes/      # API routes (tenants, auth, ingest, metrics)
│   │   ├── scheduler/   # Background poller
│   │   └── utils/       # Shopify HMAC verification
├── web/                 # Next.js frontend
│   ├── pages/           # Routes (index, login, register, dashboard)
│   └── styles/          # Global CSS
├── docs/                # Documentation
├── Dockerfile.backend   # Backend container
├── Dockerfile.web       # Web container
├── docker-compose.yml   # Local Postgres stack
└── README.md
```

## Quick Start (Local Development)

### 1. Backend Setup

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate reset --force
npm run dev
```

Backend runs at `http://localhost:4000`

### 2. Create a Tenant

```powershell
curl -X POST http://localhost:4000/api/tenants -H "Content-Type: application/json" -d "{\"name\":\"Demo Store\"}"
```

Save the returned `apiKey`.

### 3. Frontend Setup

```powershell
cd ../web
npm install
npm run dev
```

Web app runs at `http://localhost:3000`

### 4. Register & Login

- Navigate to `http://localhost:3000`
- Click "Register"
- Enter your tenant API key, email, and password
- Access the dashboard

## API Endpoints

### Tenant Management
- `POST /api/tenants` - Create tenant (returns apiKey)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Data Ingestion
- `POST /api/ingest/webhook/shopify` - Receive Shopify webhooks (requires x-tenant-apikey header)

### Analytics
- `GET /api/metrics` - Get dashboard metrics (requires x-tenant-apikey header)

## Database Schema

Multi-tenant data model with isolation via `tenantId`:

- `Tenant` - Store/tenant configuration
- `User` - Dashboard users (email auth)
- `Customer` - Shopify customers
- `Product` - Shopify products
- `Order` - Shopify orders
- `Event` - Custom events (cart abandoned, etc.)

## Deployment

### Railway (Recommended)

1. Connect GitHub repo to Railway
2. Add Postgres plugin
3. Set environment variables:
   - `DATABASE_URL` (auto-provided)
   - `JWT_SECRET`
   - `APP_PORT=4000`
4. Deploy backend using `Dockerfile.backend`
5. Run migrations: `railway run npx prisma migrate deploy`

See `docs/railway-deploy.md` for detailed steps.

### Docker Compose (Local Postgres)

```powershell
docker-compose up -d
```

## Testing Webhooks

```powershell
# Create customer
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "Content-Type: application/json" `
  -H "x-tenant-apikey: YOUR_API_KEY" `
  -d "{\"topic\":\"customers/create\",\"data\":{\"id\":123,\"email\":\"test@example.com\",\"first_name\":\"John\",\"last_name\":\"Doe\"}}"

# Create order
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "Content-Type: application/json" `
  -H "x-tenant-apikey: YOUR_API_KEY" `
  -d "{\"topic\":\"orders/create\",\"data\":{\"id\":456,\"total_price\":\"99.99\",\"currency\":\"USD\",\"created_at\":\"2025-12-06T10:00:00Z\"}}"
```

## Documentation

- 📘 **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - Complete project overview and achievements
- 🏗️ **[docs/architecture.md](docs/architecture.md)** - System architecture and design
- 📡 **[docs/api.md](docs/api.md)** - API endpoints reference
- 🗄️ **[docs/data-models.md](docs/data-models.md)** - Database schema details
- 💭 **[docs/assumptions.md](docs/assumptions.md)** - Design decisions and roadmap
- 🎮 **[docs/demo-guide.md](docs/demo-guide.md)** - Step-by-step demo walkthrough
- 🚀 **[docs/deployment-guide.md](docs/deployment-guide.md)** - Production deployment
- 🌐 **[docs/railway-deploy.md](docs/railway-deploy.md)** - Railway-specific guide
- 🔧 **[docs/seed-scripts.md](docs/seed-scripts.md)** - Test data generation
- 🧪 **[LOCAL-TESTING-GUIDE.md](LOCAL-TESTING-GUIDE.md)** - Complete local testing guide

## License

MIT (Demo Project)

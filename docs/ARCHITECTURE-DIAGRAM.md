# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHOPIFY STORES                                     │
│                    (Multiple Tenants - Multi-Store)                         │
│                                                                              │
│   Store A              Store B              Store C                         │
│   (tenant_1)          (tenant_2)          (tenant_3)                        │
└────────────┬────────────────┬────────────────┬──────────────────────────────┘
             │                │                │
             │  Webhooks      │  Webhooks      │  Webhooks
             │  (HMAC)        │  (HMAC)        │  (HMAC)
             └────────────────┴────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Express.js)                             │
│                           PORT: 4000                                         │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        API ROUTES                                     │ │
│  │                                                                       │ │
│  │  /api/tenants         - Onboard new store (generates apiKey)        │ │
│  │  /api/auth/register   - User registration (requires apiKey)         │ │
│  │  /api/auth/login      - User authentication (returns JWT)           │ │
│  │  /api/auth/me         - Get current user (JWT protected)            │ │
│  │  /api/ingest/webhook  - Receive Shopify webhooks (HMAC verified)    │ │
│  │  /api/metrics         - Dashboard analytics (apiKey protected)      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE LAYER                                   │ │
│  │                                                                       │ │
│  │  • CORS Handler                                                      │ │
│  │  • JSON Body Parser                                                  │ │
│  │  • JWT Authentication (jsonwebtoken)                                │ │
│  │  • API Key Validation (x-tenant-apikey header)                      │ │
│  │  • Shopify HMAC Verification (crypto)                               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                  BACKGROUND SCHEDULER                                 │ │
│  │                                                                       │ │
│  │  • Poller Worker (5-minute intervals)                               │ │
│  │  • Data Sync Jobs                                                    │ │
│  │  • Event Processing                                                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │  Prisma ORM
                             │  (Query Builder)
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL / SQLite)                           │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                   MULTI-TENANT DATA MODEL                             │ │
│  │                  (Row-Level Isolation via tenantId)                   │ │
│  │                                                                       │ │
│  │  ┌─────────────┐                                                     │ │
│  │  │   Tenant    │─────────┬─────────┬─────────┬─────────┬──────────┐ │ │
│  │  │  (Root)     │         │         │         │         │          │ │ │
│  │  │  - id       │         │         │         │         │          │ │ │
│  │  │  - name     │         │         │         │         │          │ │ │
│  │  │  - apiKey   │         │         │         │         │          │ │ │
│  │  │  - shop     │         │         │         │         │          │ │ │
│  │  └─────────────┘         │         │         │         │          │ │ │
│  │         │                │         │         │         │          │ │ │
│  │         │ 1:M            │ 1:M     │ 1:M     │ 1:M     │ 1:M      │ │ │
│  │         ▼                ▼         ▼         ▼         ▼          │ │ │
│  │  ┌──────────┐    ┌──────────┐ ┌────────┐ ┌───────┐ ┌─────────┐  │ │ │
│  │  │   User   │    │ Customer │ │Product │ │ Order │ │  Event  │  │ │ │
│  │  │          │    │          │ │        │ │       │ │         │  │ │ │
│  │  │ tenantId │    │ tenantId │ │tenantId│ │tenantId│ │tenantId│  │ │ │
│  │  │ email    │    │ shopifyId│ │name    │ │shopify│ │ type    │  │ │ │
│  │  │ password │    │ email    │ │price   │ │total  │ │ payload │  │ │ │
│  │  └──────────┘    │ firstName│ └────────┘ │date   │ └─────────┘  │ │ │
│  │                  │ lastName │            │       │              │ │ │
│  │                  └──────────┘            └───┬───┘              │ │ │
│  │                       │                      │                  │ │ │
│  │                       │ 1:M                  │                  │ │ │
│  │                       └──────────────────────┘                  │ │ │
│  │                              customerId FK                      │ │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                             ▲
                             │
                             │  HTTP REST API
                             │  (axios)
                             │
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js / React)                               │
│                           PORT: 3000                                         │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        PAGE ROUTES                                    │ │
│  │                                                                       │ │
│  │  /                   - Landing page (public)                        │ │
│  │  /register           - User registration form                       │ │
│  │  /login              - User login form                              │ │
│  │  /dashboard          - Analytics dashboard (protected)              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                   AUTHENTICATION FLOW                                 │ │
│  │                                                                       │ │
│  │  1. User registers with tenant apiKey                               │ │
│  │  2. Backend returns JWT token                                        │ │
│  │  3. Token stored in localStorage                                    │ │
│  │  4. Token included in Authorization header for API calls            │ │
│  │  5. Dashboard fetches metrics using token                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    DASHBOARD COMPONENTS                               │ │
│  │                                                                       │ │
│  │  • Stat Cards (Customers, Orders, Revenue)                          │ │
│  │  • Top 5 Customers Table (sorted by spend)                          │ │
│  │  • Modern UI with gradient backgrounds                              │ │
│  │  • Responsive design                                                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

```

## Data Flow Example: Order Creation

```
1. Shopify Store → Webhook Trigger
   └─ Order created in Shopify admin
   
2. Shopify → Backend API
   └─ POST /api/ingest/webhook/shopify
   └─ Headers: x-tenant-apikey, x-shopify-hmac-sha256
   └─ Body: {"topic": "orders/create", "data": {...}}
   
3. Backend → HMAC Verification
   └─ Verify webhook authenticity
   └─ Calculate HMAC from body + secret
   └─ Compare with x-shopify-hmac-sha256 header
   
4. Backend → Tenant Lookup
   └─ Find tenant by apiKey
   └─ Ensure multi-tenant isolation
   
5. Backend → Database Upsert
   └─ Prisma: order.upsert({where: {shopifyId_tenantId}, create: {...}})
   └─ Create order record with tenantId
   └─ Link to customer if exists
   
6. Database → Response
   └─ Return 200 OK to Shopify
   └─ Log webhook event
   
7. User → Dashboard Refresh
   └─ GET /api/metrics?startDate=...&endDate=...
   └─ Backend queries orders for tenant
   └─ Dashboard displays updated metrics
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                          │
│                                                           │
│  1. Multi-Tenant Isolation                               │
│     • Every query filtered by tenantId                   │
│     • No cross-tenant data leakage                       │
│                                                           │
│  2. Authentication                                        │
│     • bcrypt password hashing (10 rounds)               │
│     • JWT tokens (7-day expiry)                         │
│     • localStorage token storage                        │
│                                                           │
│  3. API Authorization                                     │
│     • x-tenant-apikey header validation                 │
│     • Bearer token JWT verification                     │
│                                                           │
│  4. Webhook Security                                      │
│     • HMAC SHA-256 signature verification              │
│     • crypto.createHmac validation                      │
│                                                           │
│  5. Environment Secrets                                   │
│     • JWT_SECRET in .env                                │
│     • DATABASE_URL in .env                              │
│     • SHOPIFY_APP_SECRET in .env                        │
└──────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Frontend (Vercel / Netlify)            │    │
│  │           - Next.js static export              │    │
│  │           - CDN distribution                   │    │
│  │           - Auto-scaling                       │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │ HTTPS API calls                   │
│                    ▼                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │      Backend API (Railway / Render / Heroku)   │    │
│  │           - Express server                     │    │
│  │           - Auto-scaling dynos                 │    │
│  │           - Health checks                      │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │ Connection pooling                │
│                    ▼                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │      Database (PostgreSQL - Managed)           │    │
│  │           - Railway Postgres Plugin            │    │
│  │           - Automated backups                  │    │
│  │           - Connection pooling                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 | React framework with SSR/SSG |
| | React 18 | UI component library |
| | axios | HTTP client |
| **Backend** | Node.js 20 | JavaScript runtime |
| | Express.js 4.18 | Web framework |
| | Prisma ORM 5.22 | Database ORM |
| **Database** | PostgreSQL | Production database |
| | SQLite | Development database |
| **Authentication** | jsonwebtoken | JWT token generation |
| | bcrypt | Password hashing |
| **Security** | crypto (Node.js) | HMAC verification |
| **DevOps** | Docker | Containerization |
| | docker-compose | Local orchestration |
| | GitHub Actions | CI/CD pipeline |

## Scaling Considerations

**Horizontal Scaling:**
- Backend API can be scaled to multiple instances
- Stateless design with JWT tokens
- Database connection pooling

**Performance Optimization:**
- Database indexes on tenantId, shopifyId
- Cached dashboard metrics (future)
- Background job queue (future)

**Monitoring:**
- Log aggregation (future)
- Error tracking (Sentry - future)
- Performance monitoring (New Relic - future)

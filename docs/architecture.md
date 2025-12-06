# Architecture Overview

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Shopify Stores                            │
│         (Tenant 1, Tenant 2, ... Tenant N)                  │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Webhooks (customers, orders, products)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ /api/tenants     - Tenant onboarding                 │  │
│  │ /api/auth        - User registration/login           │  │
│  │ /api/ingest      - Webhook receiver (HMAC verified)  │  │
│  │ /api/metrics     - Analytics & aggregations          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Prisma ORM
                ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL / SQLite                             │
│  Multi-tenant tables (Tenant, Customer, Order, Product)     │
│  Row-level isolation via tenantId                           │
└─────────────────────────────────────────────────────────────┘
                ▲
                │
┌───────────────┴─────────────────────────────────────────────┐
│            Background Scheduler (Optional)                   │
│  - Polls Shopify for missed updates                         │
│  - Creates demo events                                       │
└─────────────────────────────────────────────────────────────┘

                ▲
                │ HTTP API Calls
                │
┌─────────────────────────────────────────────────────────────┐
│                Dashboard Frontend (Next.js)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ /               - Landing page                       │  │
│  │ /login          - Email/password login               │  │
│  │ /register       - User registration                  │  │
│  │ /dashboard      - Metrics & visualizations           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Shopify Stores (Data Sources)
- Multiple tenant stores send webhook events
- Events: customer created/updated, order created, product created
- Optional: Admin API polling for batch sync

### 2. Backend API (Express + Prisma)
**Responsibilities**:
- Receive and validate webhooks (HMAC)
- Upsert data into database (idempotent)
- Multi-tenant request routing via API keys
- Serve aggregated metrics for dashboard

**Key Routes**:
- `POST /api/tenants` - Create tenant, generate API key
- `POST /api/auth/register` - Register dashboard user
- `POST /api/auth/login` - Authenticate user (returns JWT)
- `GET /api/auth/me` - Get current user
- `POST /api/ingest/webhook/shopify` - Webhook receiver
- `GET /api/metrics` - Dashboard analytics

### 3. Database (PostgreSQL)
**Schema Design**:
- Multi-tenant with row-level isolation
- Each table has `tenantId` foreign key
- Prisma manages migrations and type-safety

**Key Tables**:
- `Tenant` - Store configuration, API keys
- `User` - Dashboard users (email/password)
- `Customer` - Shopify customers
- `Product` - Shopify products
- `Order` - Shopify orders (with revenue)
- `Event` - Custom events (cart abandoned, etc.)

### 4. Background Scheduler (Optional)
**Responsibilities**:
- Periodic polling of Shopify Admin API
- Fallback for missed webhooks
- Demo mode: creates synthetic events

**Implementation**: Node.js worker with setInterval

### 5. Dashboard Frontend (Next.js)
**Responsibilities**:
- User authentication (JWT)
- Visualize metrics and charts
- Date range filtering
- Top customer analysis

**Pages**:
- Landing → Login/Register → Dashboard

## Data Flow

### Ingestion Flow
```
1. Shopify fires webhook → POST /api/ingest/webhook/shopify
2. Verify HMAC signature (if configured)
3. Extract tenantId from x-tenant-apikey header
4. Parse topic (customers/*, orders/*, products/*)
5. Upsert data into appropriate table
6. Return 200 OK
```

### Authentication Flow
```
1. User visits /register
2. Enters email, password, tenant API key
3. POST /api/auth/register
4. Backend creates User record, returns JWT
5. Frontend stores JWT in localStorage
6. Subsequent requests include Authorization: Bearer <token>
```

### Dashboard Flow
```
1. User visits /dashboard
2. Frontend sends GET /api/metrics with x-tenant-apikey
3. Backend aggregates data for tenant
4. Returns: total customers, orders, revenue, top customers
5. Frontend renders cards and tables
```

## Multi-Tenancy Strategy

**Approach**: Row-level isolation with `tenantId` column

**Query Example**:
```javascript
const customers = await prisma.customer.findMany({
  where: { tenantId: tenant.id }
});
```

**Benefits**:
- Simple schema
- Cost-effective (shared infrastructure)
- Easy cross-tenant analytics

**Considerations**:
- All queries must filter by `tenantId`
- Shared connection pool
- For >10K tenants, consider schema-per-tenant

## Security Layers

1. **API Key Authentication** (tenant identification)
2. **JWT Authentication** (user sessions)
3. **HMAC Verification** (webhook authenticity)
4. **CORS** (cross-origin protection)
5. **Rate Limiting** (not yet implemented)

## Scalability Considerations

### Current Limits
- Single-region deployment
- Synchronous webhook processing
- No caching layer

### Scale-Out Path
1. **Add Redis** for session cache and rate limiting
2. **Add Message Queue** (RabbitMQ/SQS) for async webhook processing
3. **Add Read Replicas** for analytics queries
4. **Add CDN** for frontend assets
5. **Horizontal Scaling** via load balancer + multiple backend instances

### Estimated Capacity
- Current: ~100 requests/sec per instance
- With queue: ~1000 webhooks/sec
- With read replicas: ~10K dashboard users

## Deployment Architecture

```
┌─────────────────┐
│   Railway/      │
│   Render        │
│                 │
│  ┌──────────┐  │
│  │ Backend  │  │  (Dockerfile.backend)
│  │ :4000    │  │
│  └─────┬────┘  │
│        │       │
│  ┌─────▼────┐  │
│  │ Postgres │  │  (Managed service)
│  └──────────┘  │
└─────────────────┘

┌─────────────────┐
│   Vercel/       │
│   Railway       │
│                 │
│  ┌──────────┐  │
│  │   Web    │  │  (Next.js)
│  │  :3000   │  │
│  └──────────┘  │
└─────────────────┘
```

## Technology Choices

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend | Node.js + Express | Fast development, large ecosystem |
| ORM | Prisma | Type-safety, migrations, multi-DB support |
| Database | PostgreSQL | ACID, JSON support, proven scale |
| Frontend | Next.js | SSR, great DX, Vercel deployment |
| Auth | JWT + bcrypt | Simple, stateless, industry standard |
| Deployment | Railway/Render | Easy Postgres + Git deploy |

## Future Architecture Enhancements

1. **Microservices**: Split ingestion and analytics into separate services
2. **Event Sourcing**: Store all events for full audit trail
3. **CQRS**: Separate read/write models for better performance
4. **GraphQL**: Flexible querying for advanced dashboards
5. **Real-time**: WebSocket for live dashboard updates

**APIs**

- `POST /api/tenants` — create a tenant
  - body: `{ name: string, shopifyShop?: string }`
  - response: `{ tenantId, apiKey }`

- `POST /api/ingest/webhook/shopify` — receive Shopify webhook-like payloads
  - headers: `x-tenant-apikey`
  - body: `{ topic: string, data: object }`
  - topics handled: `customers/*`, `orders/*`, `products/*`, `events/*`

- `GET /api/metrics` — get counts and top customers
  - headers: `x-tenant-apikey`
  - response: `{ totalCustomers, totalOrders, revenue, topCustomers }`

Data models (Prisma)
- `Tenant`, `Customer`, `Product`, `Order`, `Event` (see `backend/prisma/schema.prisma`)

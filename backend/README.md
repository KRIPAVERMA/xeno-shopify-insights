# Xeno Demo Backend

Minimal Express + Prisma backend for Shopify ingestion demo.

Quickstart

1. Copy `.env.example` to `.env` and edit if necessary.
2. Install dependencies:

```powershell
cd backend; npm install
```

3. Generate Prisma client and create SQLite DB:

```powershell
npx prisma generate
npx prisma migrate reset --force --skip-seed
```

4. Start the server:

```powershell
npm run dev
```

API highlights

- `POST /api/tenants` : create tenant (returns `apiKey`)
- `POST /api/ingest/webhook/shopify` : ingest events (send `x-tenant-apikey` header)
- `GET /api/metrics` : returns counts and top customers (send `x-tenant-apikey` header)

## Notes

- This demo uses SQLite for local convenience. For production use PostgreSQL, update `DATABASE_URL` accordingly and run migrations.
- **SQLite Note**: The `Event.payload` field is stored as String (JSON serialized) because SQLite doesn't support JSON type. When using PostgreSQL, you can change it to `Json` type in `schema.prisma`.

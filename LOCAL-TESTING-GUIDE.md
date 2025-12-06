# Local Development & Testing Guide

Complete guide to run and test the Xeno demo on your local machine.

## Prerequisites

- Node.js 18+ installed
- PowerShell 5.1+ (Windows default)
- Git installed
- 2GB free RAM
- Ports 3000 and 4000 available

## Initial Setup

### 1. Install Dependencies

Open PowerShell in the project root:

```powershell
# Backend dependencies
cd "c:\vol D old\web dev\xeno\backend"
npm install

# Frontend dependencies
cd "..\web"
npm install

# Return to root
cd ..
```

**Expected time**: 2-3 minutes

### 2. Setup Backend Database

```powershell
cd backend
npx prisma generate
npx prisma migrate reset --force
```

This creates SQLite database at `backend/dev.db`.

### 3. Start Backend Server

```powershell
npm run dev
```

You should see:
```
backend listening on 4000
```

Keep this terminal open.

### 4. Start Frontend (New Terminal)

Open a new PowerShell window:

```powershell
cd "c:\vol D old\web dev\xeno\web"
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

## Testing the Application

### Test 1: Create Tenant

In a third PowerShell window:

```powershell
$tenant = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Test Store","shopifyShop":"test.myshopify.com"}'

$apiKey = $tenant.apiKey
Write-Host "✅ Tenant created! API Key: $apiKey"
```

**Expected**: Returns tenantId and apiKey.

### Test 2: Register User

```powershell
$user = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" `
  -ContentType "application/json" `
  -Body "{`"email`":`"test@example.com`",`"password`":`"test123`",`"name`":`"Test User`",`"apiKey`":`"$apiKey`"}"

Write-Host "✅ User registered! Token: $($user.token.Substring(0,20))..."
```

**Expected**: Returns JWT token.

### Test 3: Login via Frontend

1. Open browser: `http://localhost:3000`
2. Click **Register** (or **Login** if already registered)
3. Enter:
   - **Tenant API Key**: (paste the `$apiKey` from above)
   - **Email**: `test@example.com`
   - **Password**: `test123`
   - **Name**: `Test User` (for register)
4. Click **Register** or **Login**

**Expected**: Redirects to `/dashboard`

### Test 4: View Empty Dashboard

**Expected**: Dashboard shows:
- Total Customers: 0
- Total Orders: 0
- Revenue: $0.00
- Top Customers: (empty)

### Test 5: Ingest Test Customer

```powershell
$body = @{
  topic = "customers/create"
  data = @{
    id = 101
    email = "alice@example.com"
    first_name = "Alice"
    last_name = "Johnson"
  }
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
  -ContentType "application/json" `
  -Headers @{"x-tenant-apikey"=$apiKey} `
  -Body $body

Write-Host "✅ Customer created"
```

**Expected**: Returns `{"status":"ok"}`

### Test 6: Ingest Test Orders

```powershell
# Order 1
$order1 = @{
  topic = "orders/create"
  data = @{
    id = 201
    total_price = "150.00"
    currency = "USD"
    created_at = "2025-12-01T10:00:00Z"
    customer = @{ id = 101 }
  }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
  -ContentType "application/json" `
  -Headers @{"x-tenant-apikey"=$apiKey} `
  -Body $order1 | Out-Null

# Order 2
$order2 = @{
  topic = "orders/create"
  data = @{
    id = 202
    total_price = "299.99"
    currency = "USD"
    created_at = "2025-12-05T14:30:00Z"
    customer = @{ id = 101 }
  }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
  -ContentType "application/json" `
  -Headers @{"x-tenant-apikey"=$apiKey} `
  -Body $order2 | Out-Null

Write-Host "✅ 2 orders created"
```

### Test 7: Refresh Dashboard

1. Go back to browser at `http://localhost:3000/dashboard`
2. Refresh the page (F5)

**Expected**:
- Total Customers: **1**
- Total Orders: **2**
- Revenue: **$449.99**
- Top Customers: **alice@example.com — $449.99**

### Test 8: Verify API Directly

```powershell
$metrics = Invoke-RestMethod -Method Get -Uri "http://localhost:4000/api/metrics" `
  -Headers @{"x-tenant-apikey"=$apiKey}

Write-Host "Customers: $($metrics.totalCustomers)"
Write-Host "Orders: $($metrics.totalOrders)"
Write-Host "Revenue: `$$($metrics.revenue)"
```

**Expected**: Same numbers as dashboard.

### Test 9: Multi-Tenant Isolation

Create a second tenant:

```powershell
$tenant2 = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Store 2"}'

$apiKey2 = $tenant2.apiKey

# Query with tenant2's key
$metrics2 = Invoke-RestMethod -Method Get -Uri "http://localhost:4000/api/metrics" `
  -Headers @{"x-tenant-apikey"=$apiKey2}

Write-Host "Tenant 2 Customers: $($metrics2.totalCustomers)"
```

**Expected**: Tenant 2 has **0** customers (isolated from tenant 1).

### Test 10: Test Invalid API Key

```powershell
try {
  Invoke-RestMethod -Method Get -Uri "http://localhost:4000/api/metrics" `
    -Headers @{"x-tenant-apikey"="invalid-key"}
} catch {
  Write-Host "✅ Correctly rejected: $($_.Exception.Message)"
}
```

**Expected**: Returns 404 error (tenant not found).

## Automated Seed Script

For quick testing with realistic data:

```powershell
cd "c:\vol D old\web dev\xeno"
.\seed-demo-data.ps1
```

This automatically:
- Creates tenant
- Registers user
- Seeds 5 customers
- Seeds 10 orders
- Displays login credentials

**Login info will be printed at the end.**

## Testing with Postman/Insomnia

### Import Collection

Create a Postman collection with these requests:

**1. Create Tenant**
```
POST http://localhost:4000/api/tenants
Content-Type: application/json

{
  "name": "My Store",
  "shopifyShop": "mystore.myshopify.com"
}
```

**2. Register User**
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "apiKey": "{{apiKey}}"
}
```

**3. Login**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "apiKey": "{{apiKey}}"
}
```

**4. Get Current User**
```
GET http://localhost:4000/api/auth/me
Authorization: Bearer {{token}}
```

**5. Ingest Customer**
```
POST http://localhost:4000/api/ingest/webhook/shopify
Content-Type: application/json
x-tenant-apikey: {{apiKey}}

{
  "topic": "customers/create",
  "data": {
    "id": 101,
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Doe"
  }
}
```

**6. Get Metrics**
```
GET http://localhost:4000/api/metrics
x-tenant-apikey: {{apiKey}}
```

Use Postman variables: `{{apiKey}}` and `{{token}}`

## Database Inspection

### View Data with Prisma Studio

```powershell
cd backend
npx prisma studio
```

Opens at `http://localhost:5555` — browse all tables visually.

### Query Database Directly

SQLite:
```powershell
sqlite3 backend/dev.db "SELECT * FROM Tenant;"
```

Or use a SQLite viewer like [DB Browser for SQLite](https://sqlitebrowser.org/).

## Troubleshooting

### Port 4000 already in use

Find and kill the process:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force
```

### Port 3000 already in use

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Database locked error

Stop backend, delete database, recreate:
```powershell
cd backend
Remove-Item dev.db -Force
npx prisma migrate reset --force
```

### Frontend shows "Failed to load metrics"

1. Check backend is running: `curl http://localhost:4000`
2. Check API key is correct
3. Check browser console for errors
4. Verify NEXT_PUBLIC_BACKEND_URL in `.env.local`

### Prisma errors

Regenerate client:
```powershell
cd backend
npx prisma generate
```

### Module not found errors

Reinstall dependencies:
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

## Performance Testing

### Load Test with Apache Bench

Install: `choco install apache-httpd`

Test webhook ingestion:
```powershell
ab -n 1000 -c 10 -T "application/json" -H "x-tenant-apikey: YOUR_KEY" `
  -p test-payload.json `
  http://localhost:4000/api/ingest/webhook/shopify
```

**Expected**: ~100-200 req/sec on typical laptop.

### Load Test with Artillery

Install: `npm install -g artillery`

Create `load-test.yml`:
```yaml
config:
  target: "http://localhost:4000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: "/api/metrics"
          headers:
            x-tenant-apikey: "YOUR_KEY"
```

Run:
```powershell
artillery run load-test.yml
```

## Development Tips

### Watch Mode

Backend auto-restarts on file changes:
```powershell
cd backend
npm run dev
```

Frontend auto-reloads on file changes:
```powershell
cd web
npm run dev
```

### View Logs

Backend logs to console (nodemon output).

Frontend logs to browser console (F12 → Console).

### Reset Everything

```powershell
cd backend
Remove-Item dev.db -Force
npx prisma migrate reset --force
cd ../web
Remove-Item .next -Recurse -Force
```

## Docker Testing (Production-like)

### Build and Run

```powershell
# Build images
docker build -f Dockerfile.backend -t xeno-backend .
docker build -f Dockerfile.web -t xeno-web .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Access Services

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432` (user: postgres, password: postgres)

### Run Migrations in Docker

```powershell
docker-compose exec backend npx prisma migrate deploy
```

## VS Code Setup (Optional)

Recommended extensions:
- Prisma (prisma.prisma)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

## Next Steps

1. ✅ Verify all tests pass
2. ✅ Seed demo data
3. ✅ Test multi-tenant isolation
4. ✅ Record video walkthrough
5. ⬜ Deploy to Railway/Render
6. ⬜ Share deployment URLs

---

**Happy Testing! 🚀**

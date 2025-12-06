# Helper Scripts

## Create Test Data

Use these PowerShell commands to seed test data for demo purposes.

### 1. Create Tenant

```powershell
$tenant = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Demo Store","shopifyShop":"demo.myshopify.com"}'

$apiKey = $tenant.apiKey
Write-Host "Tenant API Key: $apiKey"
```

### 2. Register User

```powershell
$user = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" `
  -ContentType "application/json" `
  -Body "{`"email`":`"admin@demo.com`",`"password`":`"test123`",`"name`":`"Admin User`",`"apiKey`":`"$apiKey`"}"

Write-Host "User registered. Token: $($user.token)"
```

### 3. Seed Customers

```powershell
$customers = @(
  @{id=1001; email="alice@example.com"; first_name="Alice"; last_name="Johnson"},
  @{id=1002; email="bob@example.com"; first_name="Bob"; last_name="Smith"},
  @{id=1003; email="carol@example.com"; first_name="Carol"; last_name="Williams"},
  @{id=1004; email="david@example.com"; first_name="David"; last_name="Brown"},
  @{id=1005; email="eve@example.com"; first_name="Eve"; last_name="Davis"}
)

foreach ($c in $customers) {
  $body = @{
    topic = "customers/create"
    data = $c
  } | ConvertTo-Json

  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" `
    -Headers @{"x-tenant-apikey"=$apiKey} `
    -Body $body
  
  Write-Host "Created customer: $($c.email)"
}
```

### 4. Seed Orders

```powershell
$orders = @(
  @{id=2001; customer=@{id=1001}; total_price="299.99"; currency="USD"; created_at="2025-12-01T10:00:00Z"},
  @{id=2002; customer=@{id=1002}; total_price="149.50"; currency="USD"; created_at="2025-12-02T11:30:00Z"},
  @{id=2003; customer=@{id=1001}; total_price="499.00"; currency="USD"; created_at="2025-12-03T14:00:00Z"},
  @{id=2004; customer=@{id=1003}; total_price="89.99"; currency="USD"; created_at="2025-12-04T09:15:00Z"},
  @{id=2005; customer=@{id=1004}; total_price="199.99"; currency="USD"; created_at="2025-12-05T16:45:00Z"},
  @{id=2006; customer=@{id=1001}; total_price="350.00"; currency="USD"; created_at="2025-12-06T08:20:00Z"}
)

foreach ($o in $orders) {
  $body = @{
    topic = "orders/create"
    data = $o
  } | ConvertTo-Json -Depth 3

  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" `
    -Headers @{"x-tenant-apikey"=$apiKey} `
    -Body $body
  
  Write-Host "Created order: $($o.id) - $($o.total_price)"
}
```

### 5. Seed Products

```powershell
$products = @(
  @{id=3001; title="Premium Widget"; variants=@(@{sku="WIDGET-001"; price="99.99"})},
  @{id=3002; title="Deluxe Gadget"; variants=@(@{sku="GADGET-002"; price="149.99"})},
  @{id=3003; title="Standard Tool"; variants=@(@{sku="TOOL-003"; price="49.99"})}
)

foreach ($p in $products) {
  $body = @{
    topic = "products/create"
    data = $p
  } | ConvertTo-Json -Depth 3

  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" `
    -Headers @{"x-tenant-apikey"=$apiKey} `
    -Body $body
  
  Write-Host "Created product: $($p.title)"
}
```

### 6. View Metrics

```powershell
$metrics = Invoke-RestMethod -Method Get -Uri "http://localhost:4000/api/metrics" `
  -Headers @{"x-tenant-apikey"=$apiKey}

Write-Host "`nMetrics:"
Write-Host "Customers: $($metrics.totalCustomers)"
Write-Host "Orders: $($metrics.totalOrders)"
Write-Host "Revenue: `$$($metrics.revenue)"
Write-Host "`nTop Customers:"
$metrics.topCustomers | ForEach-Object { Write-Host "  $($_.email): `$$($_.spend)" }
```

## All-in-One Seed Script

Save this as `seed-demo-data.ps1`:

```powershell
# Create tenant
$tenant = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Demo Store","shopifyShop":"demo.myshopify.com"}'
$apiKey = $tenant.apiKey
Write-Host "API Key: $apiKey`n"

# Register user
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" `
  -ContentType "application/json" `
  -Body "{`"email`":`"admin@demo.com`",`"password`":`"test123`",`"apiKey`":`"$apiKey`"}" | Out-Null

# Seed customers
1..5 | ForEach-Object {
  $body = @{topic="customers/create"; data=@{id=(1000+$_); email="user$_@example.com"; first_name="User"; last_name="$_"}} | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" -Headers @{"x-tenant-apikey"=$apiKey} -Body $body | Out-Null
}

# Seed orders
1..10 | ForEach-Object {
  $price = (Get-Random -Minimum 50 -Maximum 500)
  $body = @{topic="orders/create"; data=@{id=(2000+$_); total_price="$price"; currency="USD"; created_at=(Get-Date).AddDays(-$_).ToString("yyyy-MM-ddTHH:mm:ssZ")}} | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" -Headers @{"x-tenant-apikey"=$apiKey} -Body $body | Out-Null
}

Write-Host "Demo data seeded! Login at http://localhost:3000 with:"
Write-Host "  Email: admin@demo.com"
Write-Host "  Password: test123"
Write-Host "  API Key: $apiKey"
```

Run with:

```powershell
.\seed-demo-data.ps1
```

# Create tenant
$tenant = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/tenants" `
  -ContentType "application/json" `
  -Body '{"name":"Demo Store","shopifyShop":"demo.myshopify.com"}'
$apiKey = $tenant.apiKey
Write-Host "API Key: $apiKey`n"

# Register user
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" `
  -ContentType "application/json" `
  -Body "{`"email`":`"admin@demo.com`",`"password`":`"test123`",`"name`":`"Admin User`",`"apiKey`":`"$apiKey`"}" | Out-Null

# Seed customers
1..5 | ForEach-Object {
  $body = @{topic="customers/create"; data=@{id=(1000+$_); email="user$_@example.com"; first_name="User"; last_name="$_"}} | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" -Headers @{"x-tenant-apikey"=$apiKey} -Body $body | Out-Null
}

# Seed orders
1..10 | ForEach-Object {
  $price = (Get-Random -Minimum 50 -Maximum 500)
  $customerId = 1000 + (Get-Random -Minimum 1 -Maximum 5)
  $body = @{topic="orders/create"; data=@{id=(2000+$_); total_price="$price"; currency="USD"; created_at=(Get-Date).AddDays(-$_).ToString("yyyy-MM-ddTHH:mm:ssZ"); customer=@{id=$customerId}}} | ConvertTo-Json -Depth 3
  Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/ingest/webhook/shopify" `
    -ContentType "application/json" -Headers @{"x-tenant-apikey"=$apiKey} -Body $body | Out-Null
}

Write-Host "Demo data seeded successfully!`n"
Write-Host "Login at http://localhost:3000 with:"
Write-Host "  Email: admin@demo.com"
Write-Host "  Password: test123"
Write-Host "  API Key: $apiKey"

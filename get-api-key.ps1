# Quick script to get a tenant API key for registration

Write-Host "`n🔑 Creating Tenant and Getting API Key...`n" -ForegroundColor Cyan

try {
    # Wait for backend to be ready
    Start-Sleep -Seconds 3
    
    # Create tenant
    $body = @{
        name = "Demo Store"
        shopifyShop = "demo.myshopify.com"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Method Post `
        -Uri "http://localhost:4000/api/tenants" `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ Tenant Created Successfully!`n" -ForegroundColor Green
    Write-Host "📋 YOUR REGISTRATION DETAILS:" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "Tenant ID: " -NoNewline -ForegroundColor White
    Write-Host $response.tenantId -ForegroundColor Cyan
    Write-Host "`n🔑 API Key (COPY THIS): " -NoNewline -ForegroundColor White
    Write-Host $response.apiKey -ForegroundColor Green
    Write-Host "================================`n" -ForegroundColor Yellow
    
    Write-Host "📝 Now go to the registration page and enter:" -ForegroundColor Cyan
    Write-Host "  1. Tenant API Key: " -NoNewline
    Write-Host $response.apiKey -ForegroundColor Green
    Write-Host "  2. Email: " -NoNewline
    Write-Host "admin@demo.com" -ForegroundColor White
    Write-Host "  3. Password: " -NoNewline
    Write-Host "admin123" -ForegroundColor White
    Write-Host "  4. Name: " -NoNewline
    Write-Host "Admin User (optional)`n" -ForegroundColor White
    
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "`n💡 Make sure the backend is running on port 4000" -ForegroundColor Yellow
}

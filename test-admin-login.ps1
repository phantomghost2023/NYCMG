# Test Admin Login Script

# Test admin login
Write-Host "Testing admin login..." -ForegroundColor Green

try {
    # Create JSON payload
    $loginBody = @{
        email = "admin@example.com"
        password = "AdminPass123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Method POST -Uri "http://localhost:3002/api/v1/auth/login" -Body $loginBody -ContentType "application/json" -UseBasicParsing

    if ($loginResponse.StatusCode -eq 200) {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        Write-Host "Admin login successful!" -ForegroundColor Green
        Write-Host "Username: $($loginData.user.username)" -ForegroundColor Cyan
        Write-Host "Role: $($loginData.user.role)" -ForegroundColor Cyan
        Write-Host "Token: $($loginData.token)" -ForegroundColor Yellow

        # Test admin-only endpoint
        Write-Host "`nTesting admin-only endpoint..." -ForegroundColor Green
        try {
            $adminResponse = Invoke-WebRequest -Method GET -Uri "http://localhost:3002/api/v1/admin/statistics" -Headers @{
                "Authorization" = "Bearer $($loginData.token)"
            } -UseBasicParsing

            if ($adminResponse.StatusCode -eq 200) {
                $adminData = $adminResponse.Content | ConvertFrom-Json
                Write-Host "Admin endpoint access successful!" -ForegroundColor Green
                Write-Host "Users: $($adminData.users.total)" -ForegroundColor Cyan
                Write-Host "Artists: $($adminData.content.artists)" -ForegroundColor Cyan
                Write-Host "Tracks: $($adminData.content.tracks)" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "Admin endpoint access failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
}
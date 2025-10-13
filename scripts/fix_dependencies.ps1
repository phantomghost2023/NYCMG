# PowerShell script to fix all dependency issues in the NYCMG project

Write-Host "Fixing NYCMG Dependency Issues..." -ForegroundColor Green

# 1. Clear npm cache
Write-Host "1. Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# 2. Remove all node_modules directories
Write-Host "2. Removing node_modules directories..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Directory -Name "node_modules" | ForEach-Object {
    Write-Host "   Removing $_" -ForegroundColor Gray
    Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. Remove all package-lock.json files
Write-Host "3. Removing package-lock.json files..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Name "package-lock.json" | ForEach-Object {
    Write-Host "   Removing $_" -ForegroundColor Gray
    Remove-Item $_ -Force -ErrorAction SilentlyContinue
}

# 4. Fix React version in mobile package.json
Write-Host "4. Fixing React version in mobile package.json..." -ForegroundColor Yellow
$mobilePackageJsonPath = "mobile\package.json"
if (Test-Path $mobilePackageJsonPath) {
    $mobilePackageJson = Get-Content $mobilePackageJsonPath | ConvertFrom-Json
    $mobilePackageJson.dependencies.react = "18.1.0"
    $mobilePackageJson."devDependencies"."react-test-renderer" = "18.1.0"
    $mobilePackageJson | ConvertTo-Json -Depth 10 | Set-Content $mobilePackageJsonPath
    Write-Host "   Updated React version to 18.1.0" -ForegroundColor Gray
}

# 5. Fix workspaces in root package.json
Write-Host "5. Fixing workspaces in root package.json..." -ForegroundColor Yellow
$rootPackageJsonPath = "package.json"
if (Test-Path $rootPackageJsonPath) {
    $rootPackageJson = Get-Content $rootPackageJsonPath | ConvertFrom-Json
    $rootPackageJson.workspaces = @("web", "mobile", "backend", "shared")
    $rootPackageJson | ConvertTo-Json -Depth 10 | Set-Content $rootPackageJsonPath
    Write-Host "   Updated workspaces configuration" -ForegroundColor Gray
}

# 6. Install dependencies with yarn instead of npm (if yarn is available)
$useYarn = $true
try {
    $yarnVersion = yarn --version
    Write-Host "Yarn version $yarnVersion found" -ForegroundColor Green
} catch {
    Write-Host "Yarn not found, will use npm with legacy-peer-deps" -ForegroundColor Yellow
    $useYarn = $false
}

if ($useYarn) {
    Write-Host "6. Installing dependencies with Yarn..." -ForegroundColor Yellow
    yarn install
} else {
    Write-Host "6. Installing dependencies with npm (legacy-peer-deps)..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

Write-Host "Dependency fix process completed!" -ForegroundColor Green
Write-Host "If you still encounter issues, try installing dependencies for each module individually." -ForegroundColor Yellow
# Script to install dependencies for each module individually
Write-Host "Installing dependencies for shared module..."
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\shared"
npm install --legacy-peer-deps

Write-Host "Installing dependencies for backend module..."
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\backend"
npm install --legacy-peer-deps

Write-Host "Installing dependencies for web module..."
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\web"
npm install --legacy-peer-deps

Write-Host "Installing dependencies for mobile module..."
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile"
npm install --legacy-peer-deps

Write-Host "All modules installed!"
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG"
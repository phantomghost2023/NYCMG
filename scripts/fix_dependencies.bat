@echo off
title Fixing NYCMG Dependencies

echo Fixing NYCMG Dependency Issues...
echo.

echo 1. Clearing npm cache...
npm cache clean --force

echo.
echo 2. Removing node_modules directories...
for /d /r %%i in (node_modules) do (
    if exist "%%i" (
        echo    Removing %%i
        rd /s /q "%%i"
    )
)

echo.
echo 3. Removing package-lock.json files...
for /r %%i in (package-lock.json) do (
    if exist "%%i" (
        echo    Removing %%i
        del "%%i"
    )
)

echo.
echo 4. Installing dependencies with npm (legacy-peer-deps)...
npm install --legacy-peer-deps

echo.
echo Dependency fix process completed!
echo If you still encounter issues, try installing dependencies for each module individually.
echo.
pause
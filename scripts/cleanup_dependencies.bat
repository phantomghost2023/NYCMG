@echo off
REM Batch script to clean up all dependencies and reset the project state

echo NYCMG Dependency Cleanup Script
echo ===============================
echo This script will remove all node_modules directories and lock files
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: PowerShell is required but not found.
    pause
    exit /b 1
)

REM Run the PowerShell script
echo Running PowerShell cleanup script...
powershell -ExecutionPolicy Bypass -File "%~dp0cleanup_dependencies.ps1"

if %errorlevel% equ 0 (
    echo.
    echo Cleanup completed successfully!
) else (
    echo.
    echo Cleanup failed with error code %errorlevel%
)

pause
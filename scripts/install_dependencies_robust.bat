@echo off
REM Batch script to install dependencies for NYCMG project with robust error handling

setlocal enabledelayedexpansion

echo NYCMG Robust Dependency Installation Script
echo ==========================================

REM Check if PowerShell is available
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: PowerShell is required but not found.
    exit /b 1
)

REM Check if running with clean flag
set CLEAN_FLAG=
if /i "%1"=="-clean" set CLEAN_FLAG=-Clean

REM Check if running with yarn flag
set YARN_FLAG=
if /i "%2"=="-yarn" set YARN_FLAG=-UseYarn

REM Run the PowerShell script
echo Running PowerShell installation script...
powershell -ExecutionPolicy Bypass -File "%~dp0install_dependencies_robust.ps1" %CLEAN_FLAG% %YARN_FLAG%

if %errorlevel% equ 0 (
    echo.
    echo Installation completed successfully!
) else (
    echo.
    echo Installation failed with error code %errorlevel%
    echo Try running with clean flag: install_dependencies_robust.bat -clean
)

pause
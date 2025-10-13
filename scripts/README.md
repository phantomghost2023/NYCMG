# NYCMG Scripts

This directory contains helper scripts for managing the NYCMG project.

## Setup Scripts

### setup_dev_env.js
A Node.js script that checks if your development environment meets the project requirements.

### setup_dev_env.bat
Windows batch script to run the development environment checker.

### setup_dev_env.sh
Unix/Linux shell script to run the development environment checker.

## Usage

### Windows
```cmd
scripts\setup_dev_env.bat
```

### macOS/Linux
```bash
chmod +x scripts/setup_dev_env.sh
scripts/setup_dev_env.sh
```

On Windows, you might need to adjust the execution policy to run the shell script:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## What the Setup Checker Verifies

1. Node.js version (should be 16.x or higher)
2. npm installation
3. PostgreSQL installation
4. Git installation
5. Presence of node_modules in each module directory

The script provides guidance for resolving any issues found during the checks.
# NYCMG Dependency Installation Scripts Usage Guide

This guide explains how to use the new dependency installation scripts to resolve dependency issues in the NYCMG project.

## Overview of New Scripts

1. **install_dependencies_robust.ps1** - Main installation script with error handling
2. **install_dependencies_robust.bat** - Windows batch wrapper for the PowerShell script
3. **cleanup_dependencies.ps1** - Cleanup script to reset dependency state
4. **cleanup_dependencies.bat** - Windows batch wrapper for the cleanup script
5. **view_installation_logs.ps1** - Log viewer for troubleshooting

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)
- PowerShell (Windows) or terminal (macOS/Linux)

## Using the Installation Scripts

### Basic Installation

To install dependencies with the robust script:

```powershell
# PowerShell
.\scripts\install_dependencies_robust.ps1
```

```batch
REM Windows Command Prompt
scripts\install_dependencies_robust.bat
```

### Clean Installation

To perform a clean installation (clears cache and removes existing node_modules):

```powershell
# PowerShell
.\scripts\install_dependencies_robust.ps1 -Clean
```

```batch
REM Windows Command Prompt
scripts\install_dependencies_robust.bat -clean
```

### Using Yarn (if available)

To use yarn instead of npm (if yarn is installed):

```powershell
# PowerShell
.\scripts\install_dependencies_robust.ps1 -UseYarn
```

### Verbose Output

To see detailed logging during installation:

```powershell
# PowerShell
.\scripts\install_dependencies_robust.ps1 -Verbose
```

## Using the Cleanup Scripts

If you're experiencing persistent dependency issues, you can reset your project state:

```powershell
# PowerShell
.\scripts\cleanup_dependencies.ps1
```

```batch
REM Windows Command Prompt
scripts\cleanup_dependencies.bat
```

The cleanup script will:
1. Clear npm and yarn caches
2. Remove all node_modules directories
3. Remove package-lock.json and yarn.lock files

## Troubleshooting with Logs

To view installation logs for troubleshooting:

```powershell
# PowerShell - View last 50 lines of logs
.\scripts\view_installation_logs.ps1

# PowerShell - Follow logs in real-time
.\scripts\view_installation_logs.ps1 -Follow

# PowerShell - View specific log file
.\scripts\view_installation_logs.ps1 -LogPath "path\to\your\log\file.log"
```

## Common Issues and Solutions

### 1. Permission Errors

If you encounter permission errors:
- Run PowerShell as Administrator on Windows
- Or configure npm to use a different directory:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  ```

### 2. Network Issues

If you experience network timeouts:
- Increase npm timeout:
  ```bash
  npm config set timeout 60000
  ```
- Use a different registry:
  ```bash
  npm config set registry https://registry.npm.taobao.org
  ```

### 3. Version Conflicts

If you encounter version conflicts:
1. Run the clean installation:
   ```powershell
   .\scripts\install_dependencies_robust.ps1 -Clean
   ```
2. Or try using yarn instead of npm:
   ```powershell
   .\scripts\install_dependencies_robust.ps1 -UseYarn
   ```

### 4. PowerShell Execution Policy (Windows)

If you get an execution policy error on Windows:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Script Parameters

### install_dependencies_robust.ps1

| Parameter | Description | Default |
|-----------|-------------|---------|
| -Clean | Perform clean installation | false |
| -UseYarn | Use yarn instead of npm | false |
| -Verbose | Show detailed logging | false |

### view_installation_logs.ps1

| Parameter | Description | Default |
|-----------|-------------|---------|
| -Lines | Number of lines to display | 50 |
| -Follow | Follow log file in real-time | false |
| -LogPath | Specific log file to view | (auto-detect) |

## Manual Installation (Alternative)

If scripts continue to fail, you can manually install dependencies:

1. Install root dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install --legacy-peer-deps
   cd ..
   ```

3. Install web dependencies:
   ```bash
   cd web
   npm install --legacy-peer-deps
   cd ..
   ```

4. Install mobile dependencies:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   cd ..
   ```

5. Install shared dependencies:
   ```bash
   cd shared
   npm install --legacy-peer-deps
   cd ..
   ```

## Verifying Installation

After installation, verify that dependencies are correctly installed:

1. Check Node.js version:
   ```bash
   node --version
   ```

2. Check npm version:
   ```bash
   npm --version
   ```

3. Check installed packages:
   ```bash
   npm list --depth=0
   ```

## Getting Help

If you continue to experience issues:

1. Run the cleanup script:
   ```powershell
   .\scripts\cleanup_dependencies.ps1
   ```

2. Run a clean installation:
   ```powershell
   .\scripts\install_dependencies_robust.ps1 -Clean
   ```

3. Check the logs:
   ```powershell
   .\scripts\view_installation_logs.ps1
   ```

4. If issues persist, please provide:
   - The error message
   - The log output
   - Your Node.js and npm versions
   - Your operating system information
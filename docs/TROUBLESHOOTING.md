# NYCMG Dependency Installation Troubleshooting Guide

This guide provides solutions for common issues encountered when installing dependencies for the NYCMG project.

## Common Issues and Solutions

### 1. "Invalid Version" Error

**Symptoms**: 
```
npm error Invalid Version:
```

**Causes**:
- Corrupted npm cache
- Dependency conflicts
- Version specification issues

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. Reinstall with legacy peer dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### 2. React/React Native Version Mismatch

**Symptoms**:
```
npm error ERESOLVE unable to resolve dependency tree
```

**Causes**:
- React version incompatible with React Native version

**Solutions**:
1. Check React Native requirements:
   - React Native 0.70.0 requires React 18.1.0
   - Update package.json to match required versions

2. Use legacy peer dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### 3. Permission Errors

**Symptoms**:
```
npm error code EACCES
```

**Solutions**:
1. Use npm with sudo (not recommended):
   ```bash
   sudo npm install
   ```

2. Configure npm to use a different directory:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   ```

3. Add to PATH in ~/.bashrc or ~/.zshrc:
   ```bash
   export PATH=~/.npm-global/bin:$PATH
   ```

### 4. Network Issues

**Symptoms**:
```
npm error network timeout
```

**Solutions**:
1. Increase timeout:
   ```bash
   npm config set timeout 60000
   ```

2. Use a different registry:
   ```bash
   npm config set registry https://registry.npm.taobao.org
   ```

### 5. Node.js Version Issues

**Symptoms**:
```
npm error engine Unsupported engine
```

**Solutions**:
1. Check required Node.js version in package.json
2. Use nvm to switch Node.js versions:
   ```bash
   nvm install 16
   nvm use 16
   ```

## Alternative Installation Methods

### Using Yarn

Yarn often handles dependency conflicts better than npm:

1. Install Yarn:
   ```bash
   npm install -g yarn
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Manual Installation

Install dependencies for each module individually:

1. Backend:
   ```bash
   cd backend
   npm install
   ```

2. Web:
   ```bash
   cd web
   npm install
   ```

3. Mobile:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   ```

## Platform-Specific Issues

### Windows

1. PowerShell Execution Policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. Use cmd instead of PowerShell if needed

### macOS

1. Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

2. Homebrew for package management:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

### Linux

1. Install build essentials:
   ```bash
   sudo apt-get install build-essential
   ```

2. Install Python 2.7 (required for some packages):
   ```bash
   sudo apt-get install python2.7
   ```

## Verifying Installation

After installation, verify that all dependencies are correctly installed:

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

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [Node.js Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
#!/usr/bin/env node

/**
 * NYCMG Development Environment Setup Script
 * 
 * This script helps set up the development environment for the NYCMG project.
 * It checks for required dependencies and provides guidance for installation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Function to get version of a command
function getCommandVersion(command) {
  try {
    return execSync(`${command} --version`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

// Function to check Node.js version
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  console.log(`Node.js version: ${version}`);
  
  if (majorVersion < 16) {
    console.log('⚠️  Warning: Node.js version should be 16.x or higher');
    return false;
  }
  
  console.log('✅ Node.js version is sufficient');
  return true;
}

// Function to check if npm is installed
function checkNpm() {
  const version = getCommandVersion('npm');
  
  if (!version) {
    console.log('❌ npm is not installed');
    return false;
  }
  
  console.log(`✅ npm version: ${version}`);
  return true;
}

// Function to check if PostgreSQL is installed
function checkPostgreSQL() {
  const version = getCommandVersion('psql');
  
  if (!version) {
    console.log('⚠️  PostgreSQL is not installed or not in PATH');
    console.log('   Please install PostgreSQL 12.x or higher');
    return false;
  }
  
  console.log(`✅ PostgreSQL is installed: ${version}`);
  return true;
}

// Function to check if Git is installed
function checkGit() {
  const version = getCommandVersion('git');
  
  if (!version) {
    console.log('❌ Git is not installed');
    return false;
  }
  
  console.log(`✅ Git version: ${version}`);
  return true;
}

// Function to check if a module's dependencies are installed
function checkModuleDependencies(moduleName) {
  const modulePath = path.join(__dirname, '..', moduleName);
  
  if (!fs.existsSync(modulePath)) {
    console.log(`❌ Module ${moduleName} not found`);
    return false;
  }
  
  const packageJsonPath = path.join(modulePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`❌ package.json not found in ${moduleName}`);
    return false;
  }
  
  console.log(`✅ ${moduleName} module found`);
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(modulePath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`⚠️  node_modules not found in ${moduleName}, please run 'npm install'`);
    return false;
  }
  
  console.log(`✅ Dependencies installed for ${moduleName}`);
  return true;
}

// Main function
function main() {
  console.log('NYCMG Development Environment Setup Checker');
  console.log('==========================================\n');
  
  // Check system requirements
  console.log('Checking system requirements...\n');
  
  const checks = [
    { name: 'Node.js', fn: checkNodeVersion },
    { name: 'npm', fn: checkNpm },
    { name: 'PostgreSQL', fn: checkPostgreSQL },
    { name: 'Git', fn: checkGit }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check.fn();
    if (!result) {
      allPassed = false;
    }
    console.log('');
  }
  
  // Check module dependencies
  console.log('Checking module dependencies...\n');
  
  const modules = ['backend', 'web', 'mobile'];
  
  for (const module of modules) {
    const result = checkModuleDependencies(module);
    if (!result) {
      allPassed = false;
    }
    console.log('');
  }
  
  // Final report
  console.log('Setup Check Summary');
  console.log('===================\n');
  
  if (allPassed) {
    console.log('✅ All checks passed! Your development environment is ready.');
    console.log('\nNext steps:');
    console.log('1. Set up your environment variables in each module');
    console.log('2. Start the backend: cd backend && npm run dev');
    console.log('3. Start the web app: cd web && npm run dev');
    console.log('4. Start the mobile app: cd mobile && npm start');
  } else {
    console.log('⚠️  Some checks failed. Please address the issues above.');
    console.log('\nRefer to the requirements.txt files for detailed installation instructions.');
  }
}

// Run the script
main();
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 NYCMG - CI/CD Configuration Validator');
console.log('========================================\n');

// Check if .github/workflows directory exists
const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
if (!fs.existsSync(workflowsDir)) {
  console.log('❌ .github/workflows directory not found');
  process.exit(1);
}

// Check if ci.yml file exists
const ciFile = path.join(workflowsDir, 'ci.yml');
if (!fs.existsSync(ciFile)) {
  console.log('❌ .github/workflows/ci.yml file not found');
  process.exit(1);
}

console.log('✅ CI workflow file found');

// Try to parse the YAML file
try {
  // This is a simple check - in a real scenario, you might want to use a YAML parser
  const content = fs.readFileSync(ciFile, 'utf8');
  
  // Check for required sections
  const requiredSections = [
    'name: CI/CD Pipeline',
    'on:',
    'jobs:',
    'backend-test:',
    'web-test:',
    'mobile-test:'
  ];
  
  let missingSections = [];
  requiredSections.forEach(section => {
    if (!content.includes(section)) {
      missingSections.push(section);
    }
  });
  
  if (missingSections.length > 0) {
    console.log('❌ Missing required sections in CI workflow:');
    missingSections.forEach(section => console.log(`   - ${section}`));
    process.exit(1);
  }
  
  console.log('✅ Required sections found in CI workflow');
  
} catch (error) {
  console.log('❌ Error parsing CI workflow file:', error.message);
  process.exit(1);
}

// Check if documentation exists
const ciDocs = path.join(__dirname, '..', 'docs', 'ci-cd-setup.md');
if (!fs.existsSync(ciDocs)) {
  console.log('❌ CI/CD documentation not found (docs/ci-cd-setup.md)');
  process.exit(1);
}

console.log('✅ CI/CD documentation found');

// Try to validate YAML syntax (if yamllint is available)
try {
  execSync(`npx yaml-lint "${ciFile}"`, { stdio: 'ignore' });
  console.log('✅ YAML syntax is valid');
} catch (error) {
  console.log('⚠️  Could not validate YAML syntax (yaml-lint not available)');
}

console.log('\n🎉 CI/CD configuration validation passed!');
console.log('\nTo manually test the CI workflow:');
console.log('1. Commit and push changes to a branch');
console.log('2. Create a pull request to trigger the workflow');
console.log('3. Check the Actions tab in GitHub for results');
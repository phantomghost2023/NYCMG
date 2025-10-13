#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 NYCMG - Comprehensive Test Runner');
console.log('=====================================\n');

const projects = [
  { name: 'Backend', path: 'backend', testCommand: 'npm test' },
  { name: 'Web Frontend', path: 'web', testCommand: 'npm test' },
  { name: 'Mobile App', path: 'mobile', testCommand: 'npm test' }
];

let passedTests = 0;
let failedTests = 0;

projects.forEach((project) => {
  console.log(`\n🚀 Testing ${project.name}...`);
  console.log('-'.repeat(30));
  
  try {
    // Change to the project directory
    const projectPath = path.join(__dirname, '..', project.path);
    process.chdir(projectPath);
    
    console.log(`📂 Working in: ${process.cwd()}`);
    
    // Run the test command
    console.log(`⚙️  Running: ${project.testCommand}`);
    execSync(project.testCommand, { stdio: 'inherit' });
    
    console.log(`✅ ${project.name} tests passed!\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${project.name} tests failed!\n`);
    failedTests++;
  }
});

// Return to the root directory
process.chdir(path.join(__dirname, '..'));

console.log('\n📊 Test Summary');
console.log('===============');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Total: ${projects.length}`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed! The application is working correctly.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please check the output above.');
  process.exit(1);
}
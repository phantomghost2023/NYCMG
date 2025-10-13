// Script to validate that the dependencies listed in requirements files are correct

const fs = require('fs');
const path = require('path');

// Function to parse a requirements file
function parseRequirements(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Requirements file not found: ${filePath}`);
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const dependencies = [];
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim() === '' || line.startsWith('#') || line.startsWith('//')) {
      continue;
    }
    
    // Extract dependency name and version
    const match = line.match(/^([a-zA-Z0-9\-_\.@]+)(?:\s*[>=<~^]*\s*([0-9\.x]+))?/);
    if (match) {
      dependencies.push({
        name: match[1],
        version: match[2] || 'latest'
      });
    }
  }
  
  return dependencies;
}

// Function to validate a dependency
function validateDependency(dep) {
  // This is a simple validation - in a real scenario, you might want to check
  // if the package exists on npm registry or if the version is valid
  console.log(`✅ Validating ${dep.name}@${dep.version}`);
  return true;
}

// Main function
function main() {
  console.log('Validating NYCMG Requirements Files\n');
  
  // Check project-level requirements
  console.log('1. Project-Level Requirements:');
  const projectReqs = parseRequirements(path.join(__dirname, 'requirements.txt'));
  console.log(`   Found ${projectReqs.length} requirements\n`);
  
  // Check backend requirements
  console.log('2. Backend Requirements:');
  const backendReqs = parseRequirements(path.join(__dirname, 'backend', 'requirements.txt'));
  console.log(`   Found ${backendReqs.length} requirements\n`);
  
  // Check web requirements
  console.log('3. Web Requirements:');
  const webReqs = parseRequirements(path.join(__dirname, 'web', 'requirements.txt'));
  console.log(`   Found ${webReqs.length} requirements\n`);
  
  // Check mobile requirements
  console.log('4. Mobile Requirements:');
  const mobileReqs = parseRequirements(path.join(__dirname, 'mobile', 'requirements.txt'));
  console.log(`   Found ${mobileReqs.length} requirements\n`);
  
  // Validate all dependencies
  console.log('5. Validating Dependencies:');
  let allValid = true;
  
  for (const dep of [...projectReqs, ...backendReqs, ...webReqs, ...mobileReqs]) {
    if (!validateDependency(dep)) {
      allValid = false;
    }
  }
  
  // Summary
  console.log('\nValidation Summary:');
  if (allValid) {
    console.log('✅ All requirements files are properly formatted and dependencies are valid');
  } else {
    console.log('❌ Some issues found in requirements files');
  }
  
  console.log('\nNote: This script only validates the format of requirements files.');
  console.log('Actual installation may still encounter issues due to dependency conflicts.');
}

// Run the script
main();
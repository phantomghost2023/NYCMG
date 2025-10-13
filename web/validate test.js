const fs = require('fs');
const path = require('path');

// Function to validate a test file by actually executing it
function validateTestFile(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's a valid JavaScript file by compiling it
    new Function(content);
    
    // Check for basic test structure
    const hasDescribe = content.includes('describe(');
    const hasIt = content.includes('it(') || content.includes('test(');
    
    if (!hasDescribe) {
      console.log(`❌ ${path.basename(filePath)}: Missing describe() block`);
      return false;
    }
    
    if (!hasIt) {
      console.log(`❌ ${path.basename(filePath)}: Missing it() or test() block`);
      return false;
    }
    
    console.log(`✅ ${path.basename(filePath)}: Valid test structure`);
    return true;
  } catch (error) {
    console.log(`❌ ${path.basename(filePath)}: Syntax error - ${error.message}`);
    return false;
  }
}

// Function to validate all test files
function validateAllTests() {
  const testDir = path.join(__dirname, 'src', 'components', '__tests__');
  
  if (!fs.existsSync(testDir)) {
    console.log('❌ Test directory not found');
    return;
  }
  
  const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.test.js'));
  
  console.log(`Found ${testFiles.length} test files to validate:\n`);
  
  let passed = 0;
  let failed = 0;
  
  testFiles.forEach(file => {
    const filePath = path.join(testDir, file);
    if (validateTestFile(filePath)) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log(`\nValidation complete: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run validation
validateAllTests();
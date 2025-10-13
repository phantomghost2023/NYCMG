const fs = require('fs');
const path = require('path');

// Function to validate a test file structure
function validateTestFile(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for basic test structure
    const hasDescribe = content.includes('describe(');
    const hasIt = content.includes('it(') || content.includes('test(');
    const hasImports = content.includes('import ') || content.includes('require(');
    
    if (!hasImports) {
      console.log(`⚠️  ${path.basename(filePath)}: No imports found (might be OK for simple tests)`);
    }
    
    if (!hasDescribe) {
      console.log(`❌ ${path.basename(filePath)}: Missing describe() block`);
      return false;
    }
    
    if (!hasIt) {
      console.log(`❌ ${path.basename(filePath)}: Missing it() or test() block`);
      return false;
    }
    
    // Check for common syntax errors
    const lines = content.split('\n');
    let bracketCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      bracketCount += (line.match(/{/g) || []).length;
      bracketCount -= (line.match(/}/g) || []).length;
      
      // Check for obvious syntax errors
      if (line.includes('import') && line.includes('from') && !line.includes(';') && !line.includes('\n')) {
        if (!line.trim().endsWith("'") && !line.trim().endsWith('"') && !line.trim().endsWith('`')) {
          console.log(`❌ ${path.basename(filePath)}: Line ${i+1}: Possible syntax error in import statement`);
          return false;
        }
      }
    }
    
    if (bracketCount !== 0) {
      console.log(`❌ ${path.basename(filePath)}: Mismatched brackets (diff: ${bracketCount})`);
      return false;
    }
    
    console.log(`✅ ${path.basename(filePath)}: Valid structure`);
    return true;
  } catch (error) {
    console.log(`❌ ${path.basename(filePath)}: Error reading file - ${error.message}`);
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
  } else {
    console.log('\n🎉 All test files have valid structure!');
  }
}

// Run validation
validateAllTests();
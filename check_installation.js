// Script to check if the installation has completed successfully

const fs = require('fs');
const path = require('path');

function checkInstallation() {
  console.log('Checking NYCMG installation status...\n');
  
  // Check if node_modules directories exist
  const modules = ['backend', 'web', 'mobile'];
  let allInstalled = true;
  
  for (const module of modules) {
    const nodeModulesPath = path.join(__dirname, module, 'node_modules');
    const packageJsonPath = path.join(__dirname, module, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      console.log(`✓ ${module} directory exists`);
      
      if (fs.existsSync(nodeModulesPath)) {
        const items = fs.readdirSync(nodeModulesPath);
        console.log(`✓ ${module}/node_modules installed (${items.length} packages)`);
      } else {
        console.log(`✗ ${module}/node_modules not found`);
        allInstalled = false;
      }
    } else {
      console.log(`ℹ ${module} directory not found (might be optional)`);
    }
  }
  
  // Check for key dependencies
  console.log('\nChecking for key dependencies...');
  
  // Check backend dependencies
  const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
  const backendDeps = ['express', 'sequelize', 'pg', 'jsonwebtoken'];
  
  for (const dep of backendDeps) {
    const depPath = path.join(backendNodeModules, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✓ ${dep} installed in backend`);
    } else {
      console.log(`✗ ${dep} not found in backend`);
      allInstalled = false;
    }
  }
  
  // Check web dependencies
  const webNodeModules = path.join(__dirname, 'web', 'node_modules');
  const webDeps = ['react', 'next', '@mui/material'];
  
  for (const dep of webDeps) {
    const depPath = path.join(webNodeModules, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✓ ${dep} installed in web`);
    } else {
      console.log(`ℹ ${dep} not found in web (might not be installed yet)`);
    }
  }
  
  // Final status
  console.log('\n' + '='.repeat(50));
  if (allInstalled) {
    console.log('✅ Installation completed successfully!');
    console.log('\nYou can now start the development servers:');
    console.log('- Backend: cd backend && npm run dev');
    console.log('- Web: cd web && npm run dev');
    console.log('- Mobile: cd mobile && npm start');
  } else {
    console.log('⚠️  Installation is still in progress or encountered issues');
    console.log('Please wait for the installation to complete or check the logs for errors');
  }
  console.log('='.repeat(50));
}

// Run the check
checkInstallation();
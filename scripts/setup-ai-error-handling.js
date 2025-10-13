#!/usr/bin/env node

/**
 * AI Error Handling Setup Script
 * 
 * This script sets up the AI-powered error handling system for NYCMG
 * It installs dependencies, creates necessary directories, and configures the system
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class AIErrorHandlingSetup {
  constructor() {
    this.rootDir = process.cwd();
    this.backendDir = path.join(this.rootDir, 'backend');
    this.webDir = path.join(this.rootDir, 'web');
    this.mobileDir = path.join(this.rootDir, 'mobile');
    this.docsDir = path.join(this.rootDir, 'docs');
  }

  async setup() {
    console.log('🚀 Setting up AI Error Handling System for NYCMG...\n');

    try {
      await this.createDirectories();
      await this.installDependencies();
      await this.createConfigurationFiles();
      await this.updatePackageJson();
      await this.createLogDirectories();
      await this.validateSetup();
      
      console.log('\n✅ AI Error Handling System setup completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Set GEMINI_API_KEY in your environment variables');
      console.log('2. Start your backend server');
      console.log('3. Navigate to /error-handling in your web app');
      console.log('4. Import AIErrorHandler in your mobile app');
      console.log('\n📚 Documentation: docs/AI_ERROR_HANDLING_GUIDE.md');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 Creating directories...');
    
    const directories = [
      path.join(this.backendDir, 'logs'),
      path.join(this.backendDir, 'logs', 'errors'),
      path.join(this.webDir, 'src', 'components', 'error-handling'),
      path.join(this.mobileDir, 'src', 'components', 'error-handling')
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`   ✓ Created ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing dependencies...');

    // Backend dependencies
    console.log('   Installing backend dependencies...');
    try {
      execSync('npm install axios winston', { 
        cwd: this.backendDir, 
        stdio: 'inherit' 
      });
      console.log('   ✓ Backend dependencies installed');
    } catch (error) {
      console.warn('   ⚠️  Failed to install backend dependencies:', error.message);
    }

    // Web dependencies
    console.log('   Installing web dependencies...');
    try {
      execSync('npm install recharts', { 
        cwd: this.webDir, 
        stdio: 'inherit' 
      });
      console.log('   ✓ Web dependencies installed');
    } catch (error) {
      console.warn('   ⚠️  Failed to install web dependencies:', error.message);
    }

    // Mobile dependencies
    console.log('   Installing mobile dependencies...');
    try {
      execSync('npm install react-native-vector-icons', { 
        cwd: this.mobileDir, 
        stdio: 'inherit' 
      });
      console.log('   ✓ Mobile dependencies installed');
    } catch (error) {
      console.warn('   ⚠️  Failed to install mobile dependencies:', error.message);
    }
  }

  async createConfigurationFiles() {
    console.log('\n⚙️  Creating configuration files...');

    // Environment configuration
    const envConfig = `
# AI Error Handling Configuration
GEMINI_API_KEY=AIzaSyCKje9QdGzu4QeNy0uwfeUmHHoGlFfHhVA
AI_ERROR_HANDLING_ENABLED=true
AI_ERROR_HANDLING_DEBUG=false
AI_ERROR_HANDLING_MAX_ERRORS=1000
AI_ERROR_HANDLING_RETENTION_DAYS=30
`;

    try {
      const envPath = path.join(this.backendDir, '.env');
      let existingEnv = '';
      
      try {
        existingEnv = await fs.readFile(envPath, 'utf8');
      } catch (error) {
        // File doesn't exist, that's okay
      }

      if (!existingEnv.includes('GEMINI_API_KEY')) {
        await fs.appendFile(envPath, envConfig);
        console.log('   ✓ Added AI error handling configuration to .env');
      } else {
        console.log('   ✓ AI error handling configuration already exists');
      }
    } catch (error) {
      console.warn('   ⚠️  Failed to update .env file:', error.message);
    }

    // Log configuration
    const logConfig = {
      level: 'info',
      format: 'json',
      transports: [
        { type: 'console' },
        { type: 'file', filename: 'logs/ai-error-handler.log' },
        { type: 'file', filename: 'logs/errors.log', level: 'error' }
      ]
    };

    try {
      const logConfigPath = path.join(this.backendDir, 'logs', 'config.json');
      await fs.writeFile(logConfigPath, JSON.stringify(logConfig, null, 2));
      console.log('   ✓ Created log configuration');
    } catch (error) {
      console.warn('   ⚠️  Failed to create log configuration:', error.message);
    }
  }

  async updatePackageJson() {
    console.log('\n📝 Updating package.json files...');

    // Update backend package.json
    try {
      const backendPackagePath = path.join(this.backendDir, 'package.json');
      const backendPackage = JSON.parse(await fs.readFile(backendPackagePath, 'utf8'));
      
      if (!backendPackage.scripts) {
        backendPackage.scripts = {};
      }
      
      backendPackage.scripts['ai-error-handling:test'] = 'node -e "console.log(\'AI Error Handling System Test\')"';
      backendPackage.scripts['ai-error-handling:health'] = 'node -e "require(\'./src/services/aiErrorHandler.service\').healthCheck()"';
      
      await fs.writeFile(backendPackagePath, JSON.stringify(backendPackage, null, 2));
      console.log('   ✓ Updated backend package.json');
    } catch (error) {
      console.warn('   ⚠️  Failed to update backend package.json:', error.message);
    }

    // Update web package.json
    try {
      const webPackagePath = path.join(this.webDir, 'package.json');
      const webPackage = JSON.parse(await fs.readFile(webPackagePath, 'utf8'));
      
      if (!webPackage.scripts) {
        webPackage.scripts = {};
      }
      
      webPackage.scripts['error-handling:dev'] = 'next dev -p 3001';
      
      await fs.writeFile(webPackagePath, JSON.stringify(webPackage, null, 2));
      console.log('   ✓ Updated web package.json');
    } catch (error) {
      console.warn('   ⚠️  Failed to update web package.json:', error.message);
    }
  }

  async createLogDirectories() {
    console.log('\n📊 Setting up logging...');

    const logDirs = [
      path.join(this.backendDir, 'logs'),
      path.join(this.backendDir, 'logs', 'errors'),
      path.join(this.backendDir, 'logs', 'ai-chat')
    ];

    for (const dir of logDirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`   ✓ Created log directory: ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          console.warn(`   ⚠️  Failed to create log directory ${dir}:`, error.message);
        }
      }
    }

    // Create initial log files
    const initialLogs = [
      { path: path.join(this.backendDir, 'logs', 'ai-error-handler.log'), content: '[]' },
      { path: path.join(this.backendDir, 'logs', 'errors.json'), content: '[]' },
      { path: path.join(this.backendDir, 'logs', 'ai-chat.log'), content: '[]' }
    ];

    for (const log of initialLogs) {
      try {
        await fs.writeFile(log.path, log.content);
        console.log(`   ✓ Created log file: ${log.path}`);
      } catch (error) {
        console.warn(`   ⚠️  Failed to create log file ${log.path}:`, error.message);
      }
    }
  }

  async validateSetup() {
    console.log('\n🔍 Validating setup...');

    const requiredFiles = [
      path.join(this.backendDir, 'src', 'services', 'aiErrorHandler.service.js'),
      path.join(this.backendDir, 'src', 'middleware', 'aiErrorHandling.middleware.js'),
      path.join(this.backendDir, 'src', 'controllers', 'aiErrorChat.controller.js'),
      path.join(this.backendDir, 'src', 'routes', 'aiErrorHandling.routes.js'),
      path.join(this.webDir, 'src', 'components', 'AIErrorChat.js'),
      path.join(this.webDir, 'src', 'components', 'ErrorDashboard.js'),
      path.join(this.mobileDir, 'src', 'components', 'AIErrorHandler.js'),
      path.join(this.docsDir, 'AI_ERROR_HANDLING_GUIDE.md')
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        console.log(`   ✓ ${path.basename(file)} exists`);
      } catch (error) {
        console.log(`   ❌ ${path.basename(file)} missing`);
        allFilesExist = false;
      }
    }

    if (!allFilesExist) {
      throw new Error('Some required files are missing. Please ensure all components are properly created.');
    }

    console.log('   ✓ All required files exist');
  }

  async createSampleUsage() {
    console.log('\n📝 Creating sample usage files...');

    const sampleUsage = `
// Sample usage of AI Error Handling System

// 1. Basic error handling in a controller
const aiErrorHandler = require('../services/aiErrorHandler.service');

async function someControllerFunction(req, res) {
  try {
    // Your code here
    const result = await someAsyncOperation();
    res.json(result);
  } catch (error) {
    // Let AI handle the error
    const errorRecord = await aiErrorHandler.processError(error, {
      component: 'your-component',
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    
    res.status(500).json({
      error: 'Something went wrong',
      message: errorRecord.ai_analysis.user_communication,
      suggestions: errorRecord.ai_analysis.suggested_fixes
    });
  }
}

// 2. Using AI chat in frontend
import AIErrorChat from './components/AIErrorChat';

function ErrorHandlingPage() {
  return (
    <div>
      <h1>AI Error Handling</h1>
      <AIErrorChat />
    </div>
  );
}

// 3. Using error handler in mobile app
import AIErrorHandler from './components/AIErrorHandler';

function ErrorScreen() {
  return <AIErrorHandler />;
}
`;

    try {
      const samplePath = path.join(this.docsDir, 'AI_ERROR_HANDLING_SAMPLE_USAGE.js');
      await fs.writeFile(samplePath, sampleUsage);
      console.log('   ✓ Created sample usage file');
    } catch (error) {
      console.warn('   ⚠️  Failed to create sample usage file:', error.message);
    }
  }
}

// Run the setup
if (require.main === module) {
  const setup = new AIErrorHandlingSetup();
  setup.setup().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = AIErrorHandlingSetup;

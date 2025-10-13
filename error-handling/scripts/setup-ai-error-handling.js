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
    this.errorHandlingDir = path.join(this.rootDir, 'error-handling');
    this.backendDir = path.join(this.errorHandlingDir, 'backend');
    this.frontendDir = path.join(this.errorHandlingDir, 'frontend');
    this.mobileDir = path.join(this.errorHandlingDir, 'mobile');
    this.docsDir = path.join(this.errorHandlingDir, 'docs');
  }

  async setup() {
    console.log('🚀 Setting up AI Error Handling System for NYCMG...\n');

    try {
      await this.createDirectories();
      await this.installDependencies();
      await this.createConfigurationFiles();
      await this.createLogDirectories();
      await this.validateSetup();
      
      console.log('\n✅ AI Error Handling System setup completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Set GEMINI_API_KEY in your environment variables');
      console.log('2. Integrate the error handling components into your main application');
      console.log('3. Start your backend server');
      console.log('4. Navigate to /error-handling in your web app');
      console.log('5. Import AIErrorHandler in your mobile app');
      console.log('\n📚 Documentation: docs/AI_ERROR_HANDLING_GUIDE.md');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 Creating directories...');
    
    const directories = [
      path.join(this.errorHandlingDir, 'logs'),
      path.join(this.errorHandlingDir, 'logs', 'errors'),
      path.join(this.errorHandlingDir, 'logs', 'ai-chat'),
      path.join(this.errorHandlingDir, 'docs'),
      path.join(this.errorHandlingDir, 'docs', 'api'),
      path.join(this.errorHandlingDir, 'docs', 'guides'),
      path.join(this.errorHandlingDir, 'docs', 'examples'),
      path.join(this.errorHandlingDir, 'tests'),
      path.join(this.errorHandlingDir, 'tests', 'backend'),
      path.join(this.errorHandlingDir, 'tests', 'frontend'),
      path.join(this.errorHandlingDir, 'tests', 'mobile')
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

    // Frontend dependencies
    console.log('   Installing frontend dependencies...');
    try {
      execSync('npm install recharts', { 
        cwd: this.frontendDir, 
        stdio: 'inherit' 
      });
      console.log('   ✓ Frontend dependencies installed');
    } catch (error) {
      console.warn('   ⚠️  Failed to install frontend dependencies:', error.message);
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
      const envPath = path.join(this.errorHandlingDir, '.env');
      await fs.writeFile(envPath, envConfig);
      console.log('   ✓ Created .env configuration');
    } catch (error) {
      console.warn('   ⚠️  Failed to create .env file:', error.message);
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
      const logConfigPath = path.join(this.errorHandlingDir, 'logs', 'config.json');
      await fs.writeFile(logConfigPath, JSON.stringify(logConfig, null, 2));
      console.log('   ✓ Created log configuration');
    } catch (error) {
      console.warn('   ⚠️  Failed to create log configuration:', error.message);
    }

    // Package.json for error handling
    const packageJson = {
      name: 'nycmg-ai-error-handling',
      version: '1.0.0',
      description: 'AI-powered error handling suite for NYCMG',
      main: 'index.js',
      scripts: {
        'setup': 'node scripts/setup-ai-error-handling.js',
        'test': 'npm run test:backend && npm run test:frontend && npm run test:mobile',
        'test:backend': 'cd backend && npm test',
        'test:frontend': 'cd frontend && npm test',
        'test:mobile': 'cd mobile && npm test',
        'lint': 'npm run lint:backend && npm run lint:frontend && npm run lint:mobile',
        'lint:backend': 'cd backend && npm run lint',
        'lint:frontend': 'cd frontend && npm run lint',
        'lint:mobile': 'cd mobile && npm run lint'
      },
      keywords: [
        'ai',
        'error-handling',
        'nycmg',
        'gemini',
        'automation'
      ],
      author: 'NYCMG Team',
      license: 'MIT',
      dependencies: {
        'axios': '^1.6.8',
        'winston': '^3.11.0'
      },
      devDependencies: {
        'jest': '^29.7.0',
        'eslint': '^8.57.0'
      }
    };

    try {
      const packageJsonPath = path.join(this.errorHandlingDir, 'package.json');
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('   ✓ Created package.json');
    } catch (error) {
      console.warn('   ⚠️  Failed to create package.json:', error.message);
    }
  }

  async createLogDirectories() {
    console.log('\n📊 Setting up logging...');

    const logDirs = [
      path.join(this.errorHandlingDir, 'logs'),
      path.join(this.errorHandlingDir, 'logs', 'errors'),
      path.join(this.errorHandlingDir, 'logs', 'ai-chat')
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
      { path: path.join(this.errorHandlingDir, 'logs', 'ai-error-handler.log'), content: '[]' },
      { path: path.join(this.errorHandlingDir, 'logs', 'errors.json'), content: '[]' },
      { path: path.join(this.errorHandlingDir, 'logs', 'ai-chat.log'), content: '[]' }
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
      path.join(this.backendDir, 'services', 'aiErrorHandler.service.js'),
      path.join(this.backendDir, 'middleware', 'aiErrorHandling.middleware.js'),
      path.join(this.backendDir, 'controllers', 'aiErrorChat.controller.js'),
      path.join(this.backendDir, 'routes', 'aiErrorHandling.routes.js'),
      path.join(this.frontendDir, 'components', 'AIErrorChat.js'),
      path.join(this.frontendDir, 'components', 'ErrorDashboard.js'),
      path.join(this.mobileDir, 'components', 'AIErrorHandler.js'),
      path.join(this.rootDir, 'docs', 'AI_ERROR_HANDLING_GUIDE.md')
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
const aiErrorHandler = require('../error-handling/backend/services/aiErrorHandler.service');

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
import AIErrorChat from './error-handling/frontend/components/AIErrorChat';

function ErrorHandlingPage() {
  return (
    <div>
      <h1>AI Error Handling</h1>
      <AIErrorChat />
    </div>
  );
}

// 3. Using error handler in mobile app
import AIErrorHandler from './error-handling/mobile/components/AIErrorHandler';

function ErrorScreen() {
  return <AIErrorHandler />;
}
`;

    try {
      const samplePath = path.join(this.docsDir, 'examples', 'sample-usage.js');
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

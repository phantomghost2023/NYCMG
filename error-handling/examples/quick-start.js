/**
 * Quick Start Example for AI Error Handling Suite
 * 
 * This example shows how to quickly integrate and use the AI error handling system
 */

// ============================================================================
// BACKEND INTEGRATION EXAMPLE
// ============================================================================

// 1. Basic Express app with AI error handling
const express = require('express');
const app = express();

// Import AI error handling middleware
const aiErrorHandling = require('./backend/middleware/aiErrorHandling.middleware');

// Add AI error handling routes
app.use('/api/v1/ai-error-handling', require('./backend/routes/aiErrorHandling.routes'));

// Replace existing error handling with AI-powered error handling
app.use(aiErrorHandling.handleValidationError());
app.use(aiErrorHandling.handleAuthError());
app.use(aiErrorHandling.handleDatabaseError());
app.use(aiErrorHandling.handleRateLimitError());
app.use(aiErrorHandling.handleFileUploadError());

// Main AI error handler
app.use(aiErrorHandling.handleError());

// 404 handler with AI analysis
app.use(aiErrorHandling.handleNotFound());

// Example controller with AI error handling
const aiErrorHandler = require('./backend/services/aiErrorHandler.service');

async function exampleController(req, res) {
  try {
    // Your existing code here
    const result = await someAsyncOperation();
    res.json(result);
  } catch (error) {
    // Let AI handle the error
    const errorRecord = await aiErrorHandler.processError(error, {
      component: 'example-controller',
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

// ============================================================================
// FRONTEND INTEGRATION EXAMPLE
// ============================================================================

// 2. React component with AI error handling
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Box
} from '@mui/material';
import AIErrorChat from './frontend/components/AIErrorChat';
import ErrorDashboard from './frontend/components/ErrorDashboard';

function ErrorHandlingPage() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Error Handling Suite
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Intelligent error management with AI-powered analysis and automated fixes.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={activeTab === 'chat' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('chat')}
        >
          AI Chat
        </Button>
        <Button
          variant={activeTab === 'dashboard' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </Button>
      </Box>

      {activeTab === 'chat' && <AIErrorChat />}
      {activeTab === 'dashboard' && <ErrorDashboard />}
    </Container>
  );
}

export default ErrorHandlingPage;

// ============================================================================
// MOBILE INTEGRATION EXAMPLE
// ============================================================================

// 3. React Native screen with AI error handling
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AIErrorHandler from './mobile/components/AIErrorHandler';

const ErrorHandlingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>AI Error Handler</Text>
        <Text style={styles.subtitle}>
          Intelligent error management for your mobile app
        </Text>
      </View>
      
      <AIErrorHandler />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default ErrorHandlingScreen;

// ============================================================================
// API USAGE EXAMPLES
// ============================================================================

// 4. Using the AI error handling API
async function useAIErrorHandlingAPI() {
  const baseURL = 'http://localhost:3001/api/v1/ai-error-handling';
  const token = 'your-auth-token';

  // Chat with AI about errors
  const chatResponse = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'What are the most common errors in this system?',
      context: {
        component: 'web',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    })
  });

  const chatData = await chatResponse.json();
  console.log('AI Response:', chatData.response);

  // Get error statistics
  const statsResponse = await fetch(`${baseURL}/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const statsData = await statsResponse.json();
  console.log('Error Statistics:', statsData.statistics);

  // Get recent errors
  const errorsResponse = await fetch(`${baseURL}/recent?limit=10`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const errorsData = await errorsResponse.json();
  console.log('Recent Errors:', errorsData.errors);

  // Analyze specific error
  const errorId = 'ERR_1234567890_abcdef123';
  const analysisResponse = await fetch(`${baseURL}/analyze/${errorId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const analysisData = await analysisResponse.json();
  console.log('Error Analysis:', analysisData.analysis);
}

// ============================================================================
// CONFIGURATION EXAMPLES
// ============================================================================

// 5. Environment configuration
const environmentConfig = {
  // Required environment variables
  GEMINI_API_KEY: 'AIzaSyCKje9QdGzu4QeNy0uwfeUmHHoGlFfHhVA',
  AI_ERROR_HANDLING_ENABLED: true,
  AI_ERROR_HANDLING_DEBUG: false,
  AI_ERROR_HANDLING_MAX_ERRORS: 1000,
  AI_ERROR_HANDLING_RETENTION_DAYS: 30,
  
  // Optional configuration
  AI_ERROR_HANDLING_TEMPERATURE: 0.3,
  AI_ERROR_HANDLING_TOP_K: 40,
  AI_ERROR_HANDLING_TOP_P: 0.95,
  AI_ERROR_HANDLING_MAX_OUTPUT_TOKENS: 2048
};

// 6. Custom error handling configuration
const customErrorConfig = {
  // Custom error severity mapping
  customSeverityMapping: {
    'CustomError': 'HIGH',
    'BusinessLogicError': 'MEDIUM',
    'ValidationError': 'LOW'
  },
  
  // Custom AI prompts
  customPrompts: {
    systemPrompt: 'You are an expert error analysis AI for the NYCMG music platform.',
    userPrompt: 'Analyze this error and provide detailed insights for the NYCMG platform.'
  },
  
  // Custom escalation rules
  customEscalationRules: {
    'HIGH': { escalationTime: 300, autoFix: true },
    'MEDIUM': { escalationTime: 900, autoFix: true },
    'LOW': { escalationTime: 3600, autoFix: false }
  }
};

// ============================================================================
// TESTING EXAMPLES
// ============================================================================

// 7. Testing the AI error handling system
async function testAIErrorHandling() {
  console.log('🧪 Testing AI Error Handling System...');
  
  // Test 1: Health check
  try {
    const healthResponse = await fetch('http://localhost:3001/api/v1/ai-error-handling/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
  }
  
  // Test 2: Chat functionality
  try {
    const chatResponse = await fetch('http://localhost:3001/api/v1/ai-error-handling/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello, can you help me with error handling?',
        context: { component: 'test' }
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('✅ Chat Test:', chatData.response ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Chat Test Failed:', error.message);
  }
  
  // Test 3: Error statistics
  try {
    const statsResponse = await fetch('http://localhost:3001/api/v1/ai-error-handling/stats', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    const statsData = await statsResponse.json();
    console.log('✅ Stats Test:', statsData.statistics ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Stats Test Failed:', error.message);
  }
  
  console.log('🎉 AI Error Handling System testing completed!');
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// 8. Common usage patterns
const usageExamples = {
  // Error handling in async functions
  asyncFunction: async (req, res) => {
    try {
      const result = await someAsyncOperation();
      res.json(result);
    } catch (error) {
      const errorRecord = await aiErrorHandler.processError(error, {
        component: 'async-function',
        path: req.path,
        method: req.method
      });
      
      res.status(500).json({
        error: 'Operation failed',
        message: errorRecord.ai_analysis.user_communication,
        suggestions: errorRecord.ai_analysis.suggested_fixes
      });
    }
  },
  
  // Error handling in database operations
  databaseOperation: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      res.json(user);
    } catch (error) {
      const errorRecord = await aiErrorHandler.processError(error, {
        component: 'database-operation',
        operation: 'findById',
        userId: req.params.id
      });
      
      res.status(404).json({
        error: 'User not found',
        message: errorRecord.ai_analysis.user_communication,
        suggestions: errorRecord.ai_analysis.suggested_fixes
      });
    }
  },
  
  // Error handling in file uploads
  fileUpload: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        throw new Error('No file uploaded');
      }
      
      // Process file
      const result = await processFile(file);
      res.json(result);
    } catch (error) {
      const errorRecord = await aiErrorHandler.processError(error, {
        component: 'file-upload',
        fileName: req.file?.originalname,
        fileSize: req.file?.size
      });
      
      res.status(400).json({
        error: 'File upload failed',
        message: errorRecord.ai_analysis.user_communication,
        suggestions: errorRecord.ai_analysis.suggested_fixes
      });
    }
  }
};

// Export for use in other files
module.exports = {
  exampleController,
  ErrorHandlingPage,
  ErrorHandlingScreen,
  useAIErrorHandlingAPI,
  environmentConfig,
  customErrorConfig,
  testAIErrorHandling,
  usageExamples
};

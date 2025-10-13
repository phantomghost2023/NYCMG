const aiErrorHandler = require('../services/aiErrorHandler.service');
const axios = require('axios');
const winston = require('winston');

class AIErrorChatController {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCKje9QdGzu4QeNy0uwfeUmHHoGlFfHhVA';
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/ai-error-chat.log' })
      ]
    });
  }

  // Chat with AI about errors
  async chatWithAI(req, res) {
    try {
      const { message, context = {}, errorId } = req.body;
      
      if (!message) {
        return res.status(400).json({
          error: 'Message required',
          message: 'Please provide a message to chat with the AI'
        });
      }

      // Get error context if errorId provided
      let errorContext = {};
      if (errorId) {
        errorContext = await this.getErrorContext(errorId);
      }

      // Build chat prompt
      const prompt = this.buildChatPrompt(message, context, errorContext);
      
      // Get AI response
      const aiResponse = await this.getAIResponse(prompt);
      
      // Log the chat interaction
      this.logger.info('AI Chat interaction', {
        message: message,
        errorId: errorId,
        responseLength: aiResponse.length,
        timestamp: new Date().toISOString()
      });

      res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        errorId: errorId,
        context: errorContext
      });

    } catch (error) {
      this.logger.error('AI Chat failed:', error);
      res.status(500).json({
        error: 'Chat failed',
        message: 'Unable to process chat request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get error analysis and suggestions
  async analyzeError(req, res) {
    try {
      const { errorId } = req.params;
      
      if (!errorId) {
        return res.status(400).json({
          error: 'Error ID required',
          message: 'Please provide an error ID to analyze'
        });
      }

      const errorContext = await this.getErrorContext(errorId);
      
      if (!errorContext) {
        return res.status(404).json({
          error: 'Error not found',
          message: 'The specified error ID was not found'
        });
      }

      // Get AI analysis
      const analysis = await aiErrorHandler.analyzeErrorWithAI(
        { message: errorContext.message, stack: errorContext.stack },
        errorContext.context
      );

      res.json({
        errorId: errorId,
        analysis: analysis,
        context: errorContext,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Error analysis failed:', error);
      res.status(500).json({
        error: 'Analysis failed',
        message: 'Unable to analyze error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get error statistics
  async getErrorStats(req, res) {
    try {
      const stats = await aiErrorHandler.getErrorStatistics();
      const trends = await aiErrorHandler.getErrorTrends();
      
      res.json({
        statistics: stats,
        trends: trends,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Error stats failed:', error);
      res.status(500).json({
        error: 'Stats failed',
        message: 'Unable to retrieve error statistics'
      });
    }
  }

  // Get error trends
  async getErrorTrends(req, res) {
    try {
      const { timeframe = '24h' } = req.query;
      const trends = await aiErrorHandler.getErrorTrends(timeframe);
      
      res.json({
        trends: trends,
        timeframe: timeframe,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Error trends failed:', error);
      res.status(500).json({
        error: 'Trends failed',
        message: 'Unable to retrieve error trends'
      });
    }
  }

  // Get recent errors
  async getRecentErrors(req, res) {
    try {
      const { limit = 50, severity } = req.query;
      
      const errors = await this.getErrorsFromStorage(limit, severity);
      
      res.json({
        errors: errors,
        count: errors.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Recent errors failed:', error);
      res.status(500).json({
        error: 'Recent errors failed',
        message: 'Unable to retrieve recent errors'
      });
    }
  }

  // Get error details
  async getErrorDetails(req, res) {
    try {
      const { errorId } = req.params;
      
      if (!errorId) {
        return res.status(400).json({
          error: 'Error ID required',
          message: 'Please provide an error ID'
        });
      }

      const errorDetails = await this.getErrorById(errorId);
      
      if (!errorDetails) {
        return res.status(404).json({
          error: 'Error not found',
          message: 'The specified error ID was not found'
        });
      }

      res.json({
        error: errorDetails,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Error details failed:', error);
      res.status(500).json({
        error: 'Error details failed',
        message: 'Unable to retrieve error details'
      });
    }
  }

  // Apply suggested fix
  async applyFix(req, res) {
    try {
      const { errorId, fix } = req.body;
      
      if (!errorId || !fix) {
        return res.status(400).json({
          error: 'Error ID and fix required',
          message: 'Please provide both error ID and fix to apply'
        });
      }

      const errorDetails = await this.getErrorById(errorId);
      
      if (!errorDetails) {
        return res.status(404).json({
          error: 'Error not found',
          message: 'The specified error ID was not found'
        });
      }

      // Apply the fix
      const fixResult = await aiErrorHandler.applyFix(fix, errorDetails);
      
      // Update error record
      await this.updateErrorRecord(errorId, {
        fix_applied: fix,
        fix_result: fixResult,
        fix_timestamp: new Date().toISOString()
      });

      res.json({
        success: fixResult.success,
        message: fixResult.message,
        errorId: errorId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Apply fix failed:', error);
      res.status(500).json({
        error: 'Apply fix failed',
        message: 'Unable to apply fix',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get AI suggestions for error prevention
  async getPreventionSuggestions(req, res) {
    try {
      const { errorPattern } = req.query;
      
      const prompt = this.buildPreventionPrompt(errorPattern);
      const suggestions = await this.getAIResponse(prompt);
      
      res.json({
        suggestions: suggestions,
        pattern: errorPattern,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Prevention suggestions failed:', error);
      res.status(500).json({
        error: 'Prevention suggestions failed',
        message: 'Unable to get prevention suggestions'
      });
    }
  }

  // Health check for AI chat system
  async healthCheck(req, res) {
    try {
      const health = await this.checkAIHealth();
      
      res.json({
        status: health.status,
        aiService: health.aiService,
        errorHandler: health.errorHandler,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Health check failed:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: 'Health check failed',
        message: error.message
      });
    }
  }

  buildChatPrompt(message, context, errorContext) {
    return `
You are an expert AI assistant for the NYCMG music platform error handling system. You help developers and administrators understand and resolve errors.

USER MESSAGE: ${message}

PLATFORM CONTEXT:
- Backend: Node.js/Express with PostgreSQL
- Frontend: Next.js (Web) + React Native (Mobile)
- Services: Authentication, Content Management, Streaming, Analytics
- Architecture: Microservices with shared components

ERROR CONTEXT: ${JSON.stringify(errorContext, null, 2)}

GENERAL CONTEXT: ${JSON.stringify(context, null, 2)}

Please provide helpful, actionable advice about error handling, debugging, and system maintenance. Be specific about the NYCMG platform and provide practical solutions.

Respond in a conversational, helpful tone. If the user is asking about a specific error, provide detailed analysis and step-by-step solutions.
    `.trim();
  }

  buildPreventionPrompt(errorPattern) {
    return `
You are an expert in error prevention for the NYCMG music platform. Analyze this error pattern and provide prevention strategies:

ERROR PATTERN: ${errorPattern || 'General error prevention'}

PLATFORM CONTEXT:
- Backend: Node.js/Express with PostgreSQL
- Frontend: Next.js (Web) + React Native (Mobile)
- Services: Authentication, Content Management, Streaming, Analytics

Please provide:
1. Root cause analysis
2. Prevention strategies
3. Monitoring recommendations
4. Code improvements
5. Testing strategies

Be specific and actionable for the NYCMG platform.
    `.trim();
  }

  async getAIResponse(prompt) {
    try {
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      this.logger.error('AI Response failed:', error);
      return 'I apologize, but I am currently unable to process your request. Please try again later.';
    }
  }

  async getErrorContext(errorId) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const errorLogPath = path.join(__dirname, '../../logs/errors.json');
      const data = await fs.readFile(errorLogPath, 'utf8');
      const errors = JSON.parse(data);
      
      return errors.find(error => error.id === errorId);
    } catch (error) {
      this.logger.error('Get error context failed:', error);
      return null;
    }
  }

  async getErrorsFromStorage(limit, severity) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const errorLogPath = path.join(__dirname, '../../logs/errors.json');
      const data = await fs.readFile(errorLogPath, 'utf8');
      let errors = JSON.parse(data);
      
      // Filter by severity if specified
      if (severity) {
        errors = errors.filter(error => error.severity === severity);
      }
      
      // Sort by timestamp (newest first) and limit
      errors = errors
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, parseInt(limit));
      
      return errors;
    } catch (error) {
      this.logger.error('Get errors from storage failed:', error);
      return [];
    }
  }

  async getErrorById(errorId) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const errorLogPath = path.join(__dirname, '../../logs/errors.json');
      const data = await fs.readFile(errorLogPath, 'utf8');
      const errors = JSON.parse(data);
      
      return errors.find(error => error.id === errorId);
    } catch (error) {
      this.logger.error('Get error by ID failed:', error);
      return null;
    }
  }

  async updateErrorRecord(errorId, updates) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const errorLogPath = path.join(__dirname, '../../logs/errors.json');
      const data = await fs.readFile(errorLogPath, 'utf8');
      const errors = JSON.parse(data);
      
      const errorIndex = errors.findIndex(error => error.id === errorId);
      if (errorIndex !== -1) {
        errors[errorIndex] = { ...errors[errorIndex], ...updates };
        await fs.writeFile(errorLogPath, JSON.stringify(errors, null, 2));
      }
    } catch (error) {
      this.logger.error('Update error record failed:', error);
    }
  }

  async checkAIHealth() {
    try {
      // Test AI service
      const testResponse = await this.getAIResponse('Test connection');
      const aiService = testResponse ? 'operational' : 'error';
      
      // Test error handler
      const stats = await aiErrorHandler.getErrorStatistics();
      const errorHandler = stats ? 'operational' : 'error';
      
      return {
        status: aiService === 'operational' && errorHandler === 'operational' ? 'healthy' : 'degraded',
        aiService: aiService,
        errorHandler: errorHandler
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        aiService: 'error',
        errorHandler: 'error',
        error: error.message
      };
    }
  }
}

module.exports = new AIErrorChatController();

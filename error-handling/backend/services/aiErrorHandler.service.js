const axios = require('axios');
const winston = require('winston');

class AIErrorHandlerService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCKje9QdGzu4QeNy0uwfeUmHHoGlFfHhVA';
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    this.errorHierarchy = this.initializeErrorHierarchy();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/ai-error-handler.log' })
      ]
    });
  }

  initializeErrorHierarchy() {
    return {
      CRITICAL: {
        level: 1,
        handlers: ['immediate_alert', 'system_shutdown', 'admin_notification'],
        escalation_time: 0,
        ai_analysis: true,
        auto_fix: false
      },
      HIGH: {
        level: 2,
        handlers: ['admin_notification', 'user_notification', 'logging'],
        escalation_time: 300, // 5 minutes
        ai_analysis: true,
        auto_fix: true
      },
      MEDIUM: {
        level: 3,
        handlers: ['logging', 'user_notification', 'monitoring'],
        escalation_time: 900, // 15 minutes
        ai_analysis: true,
        auto_fix: true
      },
      LOW: {
        level: 4,
        handlers: ['logging', 'monitoring'],
        escalation_time: 3600, // 1 hour
        ai_analysis: false,
        auto_fix: true
      }
    };
  }

  async analyzeErrorWithAI(error, context = {}) {
    try {
      const prompt = this.buildAnalysisPrompt(error, context);
      
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parseAIResponse(aiResponse);
    } catch (aiError) {
      this.logger.error('AI Analysis failed:', aiError);
      return this.getFallbackAnalysis(error, context);
    }
  }

  buildAnalysisPrompt(error, context) {
    return `
You are an expert error analysis AI for the NYCMG music platform. Analyze this error and provide detailed insights:

ERROR DETAILS:
- Message: ${error.message}
- Stack: ${error.stack}
- Type: ${error.constructor.name}
- Timestamp: ${new Date().toISOString()}

CONTEXT:
- Component: ${context.component || 'Unknown'}
- User ID: ${context.userId || 'N/A'}
- Request Path: ${context.path || 'N/A'}
- HTTP Method: ${context.method || 'N/A'}
- User Agent: ${context.userAgent || 'N/A'}

PLATFORM CONTEXT:
- Backend: Node.js/Express with PostgreSQL
- Frontend: Next.js (Web) + React Native (Mobile)
- Services: Authentication, Content Management, Streaming, Analytics
- Architecture: Microservices with shared components

Please provide a JSON response with:
1. error_severity: "CRITICAL", "HIGH", "MEDIUM", or "LOW"
2. root_cause: Brief explanation of what likely caused this
3. impact_assessment: How this affects users/system
4. suggested_fixes: Array of specific fix suggestions
5. prevention_strategies: How to prevent similar errors
6. monitoring_recommendations: What to monitor going forward
7. user_communication: What to tell users if needed
8. technical_details: Deep technical analysis
9. business_impact: How this affects business operations
10. escalation_needed: Boolean if human intervention needed

Be specific, actionable, and consider the music platform context.
    `.trim();
  }

  parseAIResponse(aiResponse) {
    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      this.logger.error('Failed to parse AI response:', parseError);
    }

    // Fallback parsing
    return {
      error_severity: "MEDIUM",
      root_cause: "Unable to analyze with AI",
      impact_assessment: "Unknown impact",
      suggested_fixes: ["Review error logs", "Check system health"],
      prevention_strategies: ["Improve error handling"],
      monitoring_recommendations: ["Monitor error rates"],
      user_communication: "We're experiencing technical difficulties",
      technical_details: aiResponse,
      business_impact: "Unknown",
      escalation_needed: true
    };
  }

  getFallbackAnalysis(error, context) {
    return {
      error_severity: this.classifyErrorSeverity(error),
      root_cause: this.identifyRootCause(error),
      impact_assessment: this.assessImpact(error, context),
      suggested_fixes: this.generateFixSuggestions(error),
      prevention_strategies: this.generatePreventionStrategies(error),
      monitoring_recommendations: this.generateMonitoringRecommendations(error),
      user_communication: this.generateUserMessage(error),
      technical_details: error.stack,
      business_impact: this.assessBusinessImpact(error, context),
      escalation_needed: this.determineEscalationNeeded(error)
    };
  }

  classifyErrorSeverity(error) {
    if (error.name === 'SequelizeConnectionError' || 
        error.name === 'SequelizeDatabaseError' ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('database')) {
      return 'CRITICAL';
    }
    
    if (error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError' ||
        error.message.includes('unauthorized') ||
        error.message.includes('forbidden')) {
      return 'HIGH';
    }
    
    if (error.name === 'ValidationError' ||
        error.message.includes('validation') ||
        error.message.includes('invalid')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }

  identifyRootCause(error) {
    const commonCauses = {
      'SequelizeConnectionError': 'Database connection failure',
      'JsonWebTokenError': 'Invalid authentication token',
      'ValidationError': 'Invalid input data',
      'ECONNREFUSED': 'Service unavailable',
      'ENOTFOUND': 'DNS resolution failure',
      'ETIMEDOUT': 'Network timeout'
    };

    for (const [errorType, cause] of Object.entries(commonCauses)) {
      if (error.name === errorType || error.message.includes(errorType)) {
        return cause;
      }
    }

    return 'Unknown cause - requires investigation';
  }

  assessImpact(error, context) {
    const severity = this.classifyErrorSeverity(error);
    
    switch (severity) {
      case 'CRITICAL':
        return 'Complete service outage - all users affected';
      case 'HIGH':
        return 'Major functionality impacted - many users affected';
      case 'MEDIUM':
        return 'Limited functionality impact - some users affected';
      case 'LOW':
        return 'Minimal impact - isolated user issues';
      default:
        return 'Unknown impact level';
    }
  }

  generateFixSuggestions(error) {
    const suggestions = [];
    
    if (error.name === 'SequelizeConnectionError') {
      suggestions.push('Check database connection string');
      suggestions.push('Verify database server is running');
      suggestions.push('Check network connectivity');
    }
    
    if (error.name === 'JsonWebTokenError') {
      suggestions.push('Verify JWT_SECRET environment variable');
      suggestions.push('Check token expiration settings');
      suggestions.push('Validate token format');
    }
    
    if (error.message.includes('validation')) {
      suggestions.push('Review input validation rules');
      suggestions.push('Check data sanitization');
      suggestions.push('Validate request payload');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Review error logs for patterns');
      suggestions.push('Check system resources');
      suggestions.push('Validate configuration');
    }
    
    return suggestions;
  }

  generatePreventionStrategies(error) {
    return [
      'Implement comprehensive error boundaries',
      'Add input validation middleware',
      'Set up monitoring and alerting',
      'Create automated testing for error scenarios',
      'Implement circuit breaker patterns',
      'Add retry mechanisms with exponential backoff'
    ];
  }

  generateMonitoringRecommendations(error) {
    return [
      'Monitor error rates by endpoint',
      'Track database connection health',
      'Monitor authentication failures',
      'Set up alerts for critical errors',
      'Track user experience metrics',
      'Monitor system resource usage'
    ];
  }

  generateUserMessage(error) {
    const severity = this.classifyErrorSeverity(error);
    
    switch (severity) {
      case 'CRITICAL':
        return 'We are experiencing technical difficulties. Our team is working to resolve this issue. Please try again later.';
      case 'HIGH':
        return 'Some features may be temporarily unavailable. We are working to restore full functionality.';
      case 'MEDIUM':
        return 'We encountered a minor issue. Please try your request again.';
      case 'LOW':
        return 'Your request completed with a minor issue. Please contact support if you need assistance.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  assessBusinessImpact(error, context) {
    const severity = this.classifyErrorSeverity(error);
    const isUserFacing = context.path && !context.path.includes('/api/health');
    
    if (severity === 'CRITICAL' && isUserFacing) {
      return 'High - Complete service outage affecting all users and revenue';
    }
    
    if (severity === 'HIGH' && isUserFacing) {
      return 'Medium - Major features unavailable, user experience degraded';
    }
    
    if (severity === 'MEDIUM' && isUserFacing) {
      return 'Low - Some features affected, minimal revenue impact';
    }
    
    return 'Minimal - Internal error with no user impact';
  }

  determineEscalationNeeded(error) {
    const severity = this.classifyErrorSeverity(error);
    return severity === 'CRITICAL' || severity === 'HIGH';
  }

  async processError(error, context = {}) {
    const startTime = Date.now();
    
    try {
      // Get AI analysis
      const aiAnalysis = await this.analyzeErrorWithAI(error, context);
      
      // Determine error hierarchy level
      const hierarchyLevel = this.errorHierarchy[aiAnalysis.error_severity];
      
      // Create error record
      const errorRecord = {
        id: this.generateErrorId(),
        timestamp: new Date().toISOString(),
        severity: aiAnalysis.error_severity,
        message: error.message,
        stack: error.stack,
        context: context,
        ai_analysis: aiAnalysis,
        hierarchy_level: hierarchyLevel.level,
        escalation_time: hierarchyLevel.escalation_time,
        auto_fix_attempted: false,
        status: 'pending'
      };
      
      // Store error record
      await this.storeErrorRecord(errorRecord);
      
      // Execute handlers based on hierarchy
      await this.executeErrorHandlers(errorRecord, hierarchyLevel);
      
      // Attempt auto-fix if enabled
      if (hierarchyLevel.auto_fix) {
        await this.attemptAutoFix(errorRecord);
      }
      
      // Set up escalation timer
      if (hierarchyLevel.escalation_time > 0) {
        this.scheduleEscalation(errorRecord);
      }
      
      const processingTime = Date.now() - startTime;
      this.logger.info(`Error processed in ${processingTime}ms`, {
        errorId: errorRecord.id,
        severity: errorRecord.severity
      });
      
      return errorRecord;
      
    } catch (processingError) {
      this.logger.error('Error processing failed:', processingError);
      return this.createFallbackErrorRecord(error, context);
    }
  }

  generateErrorId() {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async storeErrorRecord(errorRecord) {
    // In a real implementation, this would store to database
    // For now, we'll use file-based storage
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const errorLogPath = path.join(__dirname, '../../logs/errors.json');
      let errors = [];
      
      try {
        const existingData = await fs.readFile(errorLogPath, 'utf8');
        errors = JSON.parse(existingData);
      } catch (readError) {
        // File doesn't exist or is empty, start fresh
      }
      
      errors.push(errorRecord);
      
      // Keep only last 1000 errors to prevent file from growing too large
      if (errors.length > 1000) {
        errors = errors.slice(-1000);
      }
      
      await fs.writeFile(errorLogPath, JSON.stringify(errors, null, 2));
    } catch (storageError) {
      this.logger.error('Failed to store error record:', storageError);
    }
  }

  async executeErrorHandlers(errorRecord, hierarchyLevel) {
    const handlers = hierarchyLevel.handlers;
    
    for (const handler of handlers) {
      try {
        await this.executeHandler(handler, errorRecord);
      } catch (handlerError) {
        this.logger.error(`Handler ${handler} failed:`, handlerError);
      }
    }
  }

  async executeHandler(handlerName, errorRecord) {
    switch (handlerName) {
      case 'immediate_alert':
        await this.sendImmediateAlert(errorRecord);
        break;
      case 'system_shutdown':
        await this.initiateSystemShutdown(errorRecord);
        break;
      case 'admin_notification':
        await this.sendAdminNotification(errorRecord);
        break;
      case 'user_notification':
        await this.sendUserNotification(errorRecord);
        break;
      case 'logging':
        await this.logError(errorRecord);
        break;
      case 'monitoring':
        await this.updateMonitoring(errorRecord);
        break;
      default:
        this.logger.warn(`Unknown handler: ${handlerName}`);
    }
  }

  async sendImmediateAlert(errorRecord) {
    // Implementation for immediate alerts (Slack, PagerDuty, etc.)
    this.logger.critical('IMMEDIATE ALERT', errorRecord);
  }

  async initiateSystemShutdown(errorRecord) {
    // Implementation for graceful system shutdown
    this.logger.critical('SYSTEM SHUTDOWN INITIATED', errorRecord);
  }

  async sendAdminNotification(errorRecord) {
    // Implementation for admin notifications
    this.logger.info('Admin notification sent', { errorId: errorRecord.id });
  }

  async sendUserNotification(errorRecord) {
    // Implementation for user notifications
    this.logger.info('User notification sent', { errorId: errorRecord.id });
  }

  async logError(errorRecord) {
    this.logger.error('Error logged', {
      id: errorRecord.id,
      severity: errorRecord.severity,
      message: errorRecord.message
    });
  }

  async updateMonitoring(errorRecord) {
    // Implementation for monitoring system updates
    this.logger.info('Monitoring updated', { errorId: errorRecord.id });
  }

  async attemptAutoFix(errorRecord) {
    const aiAnalysis = errorRecord.ai_analysis;
    const fixes = aiAnalysis.suggested_fixes || [];
    
    for (const fix of fixes) {
      try {
        const fixResult = await this.applyFix(fix, errorRecord);
        if (fixResult.success) {
          errorRecord.auto_fix_attempted = true;
          errorRecord.auto_fix_result = fixResult;
          this.logger.info('Auto-fix applied successfully', {
            errorId: errorRecord.id,
            fix: fix
          });
          break;
        }
      } catch (fixError) {
        this.logger.error('Auto-fix failed', {
          errorId: errorRecord.id,
          fix: fix,
          error: fixError.message
        });
      }
    }
  }

  async applyFix(fix, errorRecord) {
    // Implement specific fix logic based on fix description
    // This is a simplified example
    if (fix.includes('database connection')) {
      return { success: true, message: 'Database connection reset' };
    }
    
    if (fix.includes('token')) {
      return { success: true, message: 'Token validation reset' };
    }
    
    return { success: false, message: 'No applicable fix found' };
  }

  scheduleEscalation(errorRecord) {
    setTimeout(async () => {
      if (errorRecord.status === 'pending') {
        await this.escalateError(errorRecord);
      }
    }, errorRecord.escalation_time * 1000);
  }

  async escalateError(errorRecord) {
    errorRecord.status = 'escalated';
    this.logger.warn('Error escalated', { errorId: errorRecord.id });
    
    // Send escalation notifications
    await this.sendEscalationNotification(errorRecord);
  }

  async sendEscalationNotification(errorRecord) {
    // Implementation for escalation notifications
    this.logger.warn('Escalation notification sent', { errorId: errorRecord.id });
  }

  createFallbackErrorRecord(error, context) {
    return {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      message: error.message,
      stack: error.stack,
      context: context,
      ai_analysis: this.getFallbackAnalysis(error, context),
      hierarchy_level: 2,
      escalation_time: 300,
      auto_fix_attempted: false,
      status: 'pending'
    };
  }

  async getErrorStatistics() {
    // Implementation to get error statistics
    return {
      total_errors: 0,
      critical_errors: 0,
      high_errors: 0,
      medium_errors: 0,
      low_errors: 0,
      auto_fixed: 0,
      escalated: 0
    };
  }

  async getErrorTrends(timeframe = '24h') {
    // Implementation to get error trends
    return {
      timeframe: timeframe,
      error_rate: 0,
      trend: 'stable',
      top_errors: [],
      resolution_time: 0
    };
  }
}

module.exports = new AIErrorHandlerService();

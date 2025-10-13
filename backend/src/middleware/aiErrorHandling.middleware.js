const aiErrorHandler = require('../services/aiErrorHandler.service');
const winston = require('winston');

class AIErrorHandlingMiddleware {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/ai-error-middleware.log' })
      ]
    });
  }

  // Main error handling middleware
  handleError() {
    return async (err, req, res, next) => {
      try {
        // Extract context from request
        const context = this.extractContext(req);
        
        // Process error with AI
        const errorRecord = await aiErrorHandler.processError(err, context);
        
        // Determine response based on error severity
        const response = this.buildErrorResponse(errorRecord, req);
        
        // Log the error
        this.logger.error('Error handled by AI middleware', {
          errorId: errorRecord.id,
          severity: errorRecord.severity,
          path: req.path,
          method: req.method,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        });
        
        // Send response
        res.status(response.status).json(response.body);
        
      } catch (middlewareError) {
        // Fallback to basic error handling
        this.logger.error('AI Error Middleware failed:', middlewareError);
        
        res.status(500).json({
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
          timestamp: new Date().toISOString(),
          requestId: req.id || 'unknown'
        });
      }
    };
  }

  // Async error wrapper for controllers
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(async (err) => {
        try {
          const context = this.extractContext(req);
          const errorRecord = await aiErrorHandler.processError(err, context);
          const response = this.buildErrorResponse(errorRecord, req);
          
          res.status(response.status).json(response.body);
        } catch (handlerError) {
          this.logger.error('Async handler failed:', handlerError);
          res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
          });
        }
      });
    };
  }

  // Request validation error handler
  handleValidationError() {
    return (err, req, res, next) => {
      if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
        const context = this.extractContext(req);
        context.errorType = 'validation';
        
        aiErrorHandler.processError(err, context).then(errorRecord => {
          res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid input data',
            details: err.errors || err.message,
            suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
            timestamp: new Date().toISOString()
          });
        }).catch(() => {
          res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid input data',
            details: err.errors || err.message
          });
        });
      } else {
        next(err);
      }
    };
  }

  // Authentication error handler
  handleAuthError() {
    return (err, req, res, next) => {
      if (err.name === 'JsonWebTokenError' || 
          err.name === 'TokenExpiredError' ||
          err.message.includes('unauthorized') ||
          err.message.includes('forbidden')) {
        
        const context = this.extractContext(req);
        context.errorType = 'authentication';
        
        aiErrorHandler.processError(err, context).then(errorRecord => {
          res.status(401).json({
            error: 'Authentication Error',
            message: 'Invalid or expired authentication',
            suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
            timestamp: new Date().toISOString()
          });
        }).catch(() => {
          res.status(401).json({
            error: 'Authentication Error',
            message: 'Invalid or expired authentication'
          });
        });
      } else {
        next(err);
      }
    };
  }

  // Database error handler
  handleDatabaseError() {
    return (err, req, res, next) => {
      if (err.name === 'SequelizeConnectionError' ||
          err.name === 'SequelizeDatabaseError' ||
          err.message.includes('ECONNREFUSED') ||
          err.message.includes('database')) {
        
        const context = this.extractContext(req);
        context.errorType = 'database';
        
        aiErrorHandler.processError(err, context).then(errorRecord => {
          res.status(503).json({
            error: 'Service Unavailable',
            message: 'Database connection issue',
            suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
            timestamp: new Date().toISOString()
          });
        }).catch(() => {
          res.status(503).json({
            error: 'Service Unavailable',
            message: 'Database connection issue'
          });
        });
      } else {
        next(err);
      }
    };
  }

  // Rate limiting error handler
  handleRateLimitError() {
    return (err, req, res, next) => {
      if (err.status === 429 || err.message.includes('rate limit')) {
        const context = this.extractContext(req);
        context.errorType = 'rate_limit';
        
        aiErrorHandler.processError(err, context).then(errorRecord => {
          res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            retryAfter: err.retryAfter || 60,
            suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
            timestamp: new Date().toISOString()
          });
        }).catch(() => {
          res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            retryAfter: err.retryAfter || 60
          });
        });
      } else {
        next(err);
      }
    };
  }

  // File upload error handler
  handleFileUploadError() {
    return (err, req, res, next) => {
      if (err.code === 'LIMIT_FILE_SIZE' ||
          err.code === 'LIMIT_UNEXPECTED_FILE' ||
          err.message.includes('file upload')) {
        
        const context = this.extractContext(req);
        context.errorType = 'file_upload';
        
        aiErrorHandler.processError(err, context).then(errorRecord => {
          res.status(400).json({
            error: 'File Upload Error',
            message: 'Invalid file upload',
            details: err.message,
            suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
            timestamp: new Date().toISOString()
          });
        }).catch(() => {
          res.status(400).json({
            error: 'File Upload Error',
            message: 'Invalid file upload',
            details: err.message
          });
        });
      } else {
        next(err);
      }
    };
  }

  // 404 handler with AI analysis
  handleNotFound() {
    return async (req, res, next) => {
      const context = this.extractContext(req);
      context.errorType = 'not_found';
      
      const notFoundError = new Error(`Route not found: ${req.method} ${req.path}`);
      notFoundError.status = 404;
      
      try {
        const errorRecord = await aiErrorHandler.processError(notFoundError, context);
        
        res.status(404).json({
          error: 'Not Found',
          message: 'The requested resource was not found',
          path: req.path,
          method: req.method,
          suggestions: errorRecord.ai_analysis?.suggested_fixes || [],
          timestamp: new Date().toISOString()
        });
      } catch (handlerError) {
        this.logger.error('404 handler failed:', handlerError);
        res.status(404).json({
          error: 'Not Found',
          message: 'The requested resource was not found'
        });
      }
    };
  }

  extractContext(req) {
    return {
      component: 'backend',
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || req.user?.userId,
      timestamp: new Date().toISOString(),
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      body: this.sanitizeBody(req.body),
      params: req.params
    };
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    return sanitized;
  }

  sanitizeBody(body) {
    if (!body) return body;
    
    const sanitized = { ...body };
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    return sanitized;
  }

  buildErrorResponse(errorRecord, req) {
    const severity = errorRecord.severity;
    const aiAnalysis = errorRecord.ai_analysis;
    
    let status = 500;
    let userMessage = 'Something went wrong';
    
    switch (severity) {
      case 'CRITICAL':
        status = 503;
        userMessage = aiAnalysis.user_communication || 'Service temporarily unavailable';
        break;
      case 'HIGH':
        status = 500;
        userMessage = aiAnalysis.user_communication || 'Internal server error';
        break;
      case 'MEDIUM':
        status = 400;
        userMessage = aiAnalysis.user_communication || 'Invalid request';
        break;
      case 'LOW':
        status = 200;
        userMessage = aiAnalysis.user_communication || 'Request completed with warnings';
        break;
    }
    
    const response = {
      status,
      body: {
        error: this.getErrorTitle(severity),
        message: userMessage,
        timestamp: errorRecord.timestamp,
        requestId: req.id || errorRecord.id,
        severity: severity
      }
    };
    
    // Add development details
    if (process.env.NODE_ENV === 'development') {
      response.body.stack = errorRecord.stack;
      response.body.context = errorRecord.context;
      response.body.aiAnalysis = aiAnalysis;
    }
    
    // Add suggestions for user-facing errors
    if (severity !== 'CRITICAL' && aiAnalysis.suggested_fixes) {
      response.body.suggestions = aiAnalysis.suggested_fixes.slice(0, 3);
    }
    
    return response;
  }

  getErrorTitle(severity) {
    const titles = {
      'CRITICAL': 'Service Unavailable',
      'HIGH': 'Internal Server Error',
      'MEDIUM': 'Bad Request',
      'LOW': 'Warning'
    };
    return titles[severity] || 'Error';
  }

  // Health check for AI error handling system
  async healthCheck() {
    try {
      const stats = await aiErrorHandler.getErrorStatistics();
      const trends = await aiErrorHandler.getErrorTrends();
      
      return {
        status: 'healthy',
        aiErrorHandler: 'operational',
        statistics: stats,
        trends: trends,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        aiErrorHandler: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new AIErrorHandlingMiddleware();

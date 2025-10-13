const request = require('supertest');
const app = require('../index');
const aiErrorHandler = require('../services/aiErrorHandler.service');

describe('AI Error Handling System', () => {
  let testToken;

  beforeAll(async () => {
    // Get test token for authenticated requests
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'AdminPass123!'
      });
    
    testToken = loginResponse.body.token;
  });

  describe('AI Error Handler Service', () => {
    test('should initialize error hierarchy correctly', () => {
      const hierarchy = aiErrorHandler.errorHierarchy;
      
      expect(hierarchy.CRITICAL).toBeDefined();
      expect(hierarchy.HIGH).toBeDefined();
      expect(hierarchy.MEDIUM).toBeDefined();
      expect(hierarchy.LOW).toBeDefined();
      
      expect(hierarchy.CRITICAL.level).toBe(1);
      expect(hierarchy.HIGH.level).toBe(2);
      expect(hierarchy.MEDIUM.level).toBe(3);
      expect(hierarchy.LOW.level).toBe(4);
    });

    test('should classify error severity correctly', () => {
      const criticalError = new Error('Database connection failed');
      criticalError.name = 'SequelizeConnectionError';
      
      const highError = new Error('Invalid token');
      highError.name = 'JsonWebTokenError';
      
      const mediumError = new Error('Validation failed');
      mediumError.name = 'ValidationError';
      
      const lowError = new Error('Minor issue');
      
      expect(aiErrorHandler.classifyErrorSeverity(criticalError)).toBe('CRITICAL');
      expect(aiErrorHandler.classifyErrorSeverity(highError)).toBe('HIGH');
      expect(aiErrorHandler.classifyErrorSeverity(mediumError)).toBe('MEDIUM');
      expect(aiErrorHandler.classifyErrorSeverity(lowError)).toBe('LOW');
    });

    test('should generate error ID', () => {
      const errorId = aiErrorHandler.generateErrorId();
      
      expect(errorId).toMatch(/^ERR_\d+_[a-z0-9]+$/);
      expect(errorId.length).toBeGreaterThan(10);
    });

    test('should create fallback analysis', () => {
      const error = new Error('Test error');
      const context = { component: 'test' };
      
      const analysis = aiErrorHandler.getFallbackAnalysis(error, context);
      
      expect(analysis).toHaveProperty('error_severity');
      expect(analysis).toHaveProperty('root_cause');
      expect(analysis).toHaveProperty('impact_assessment');
      expect(analysis).toHaveProperty('suggested_fixes');
      expect(analysis).toHaveProperty('prevention_strategies');
      expect(analysis).toHaveProperty('monitoring_recommendations');
      expect(analysis).toHaveProperty('user_communication');
      expect(analysis).toHaveProperty('technical_details');
      expect(analysis).toHaveProperty('business_impact');
      expect(analysis).toHaveProperty('escalation_needed');
    });
  });

  describe('AI Error Handling Routes', () => {
    test('should get health status', async () => {
      const response = await request(app)
        .get('/api/v1/ai-error-handling/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should chat with AI', async () => {
      const response = await request(app)
        .post('/api/v1/ai-error-handling/chat')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          message: 'Hello, can you help me with error handling?',
          context: {
            component: 'test',
            timestamp: new Date().toISOString()
          }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should get error statistics', async () => {
      const response = await request(app)
        .get('/api/v1/ai-error-handling/stats')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('statistics');
      expect(response.body.statistics).toHaveProperty('total_errors');
      expect(response.body.statistics).toHaveProperty('critical_errors');
      expect(response.body.statistics).toHaveProperty('high_errors');
      expect(response.body.statistics).toHaveProperty('medium_errors');
      expect(response.body.statistics).toHaveProperty('low_errors');
    });

    test('should get error trends', async () => {
      const response = await request(app)
        .get('/api/v1/ai-error-handling/trends')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('trends');
      expect(response.body).toHaveProperty('timeframe');
    });

    test('should get recent errors', async () => {
      const response = await request(app)
        .get('/api/v1/ai-error-handling/recent')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    test('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/v1/ai-error-handling/stats');
      
      expect(response.status).toBe(401);
    });
  });

  describe('Error Processing', () => {
    test('should process error with AI analysis', async () => {
      const error = new Error('Test error for AI processing');
      const context = {
        component: 'test',
        path: '/test',
        method: 'GET',
        userId: 'test-user'
      };
      
      const errorRecord = await aiErrorHandler.processError(error, context);
      
      expect(errorRecord).toHaveProperty('id');
      expect(errorRecord).toHaveProperty('timestamp');
      expect(errorRecord).toHaveProperty('severity');
      expect(errorRecord).toHaveProperty('message');
      expect(errorRecord).toHaveProperty('context');
      expect(errorRecord).toHaveProperty('ai_analysis');
      expect(errorRecord).toHaveProperty('hierarchy_level');
      expect(errorRecord).toHaveProperty('escalation_time');
      expect(errorRecord).toHaveProperty('auto_fix_attempted');
      expect(errorRecord).toHaveProperty('status');
    });

    test('should handle different error types', async () => {
      const errorTypes = [
        { name: 'SequelizeConnectionError', expectedSeverity: 'CRITICAL' },
        { name: 'JsonWebTokenError', expectedSeverity: 'HIGH' },
        { name: 'ValidationError', expectedSeverity: 'MEDIUM' },
        { name: 'GenericError', expectedSeverity: 'LOW' }
      ];
      
      for (const errorType of errorTypes) {
        const error = new Error(`Test ${errorType.name}`);
        error.name = errorType.name;
        
        const context = { component: 'test' };
        const errorRecord = await aiErrorHandler.processError(error, context);
        
        expect(errorRecord.severity).toBe(errorType.expectedSeverity);
      }
    });
  });

  describe('AI Chat Functionality', () => {
    test('should handle chat messages', async () => {
      const chatMessage = {
        message: 'What are the most common errors in this system?',
        context: {
          component: 'test',
          timestamp: new Date().toISOString()
        }
      };
      
      const response = await request(app)
        .post('/api/v1/ai-error-handling/chat')
        .set('Authorization', `Bearer ${testToken}`)
        .send(chatMessage);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(typeof response.body.response).toBe('string');
      expect(response.body.response.length).toBeGreaterThan(0);
    });

    test('should handle error-specific chat', async () => {
      // First, create a test error
      const error = new Error('Test error for chat');
      const context = { component: 'test' };
      const errorRecord = await aiErrorHandler.processError(error, context);
      
      // Then chat about that specific error
      const response = await request(app)
        .post('/api/v1/ai-error-handling/chat')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          message: 'Can you analyze this error?',
          errorId: errorRecord.id,
          context: { component: 'test' }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('errorId');
      expect(response.body.errorId).toBe(errorRecord.id);
    });
  });

  describe('Error Statistics and Analytics', () => {
    test('should provide error statistics', async () => {
      const stats = await aiErrorHandler.getErrorStatistics();
      
      expect(stats).toHaveProperty('total_errors');
      expect(stats).toHaveProperty('critical_errors');
      expect(stats).toHaveProperty('high_errors');
      expect(stats).toHaveProperty('medium_errors');
      expect(stats).toHaveProperty('low_errors');
      expect(stats).toHaveProperty('auto_fixed');
      expect(stats).toHaveProperty('escalated');
      
      expect(typeof stats.total_errors).toBe('number');
      expect(typeof stats.critical_errors).toBe('number');
      expect(typeof stats.high_errors).toBe('number');
      expect(typeof stats.medium_errors).toBe('number');
      expect(typeof stats.low_errors).toBe('number');
    });

    test('should provide error trends', async () => {
      const trends = await aiErrorHandler.getErrorTrends('24h');
      
      expect(trends).toHaveProperty('timeframe');
      expect(trends).toHaveProperty('error_rate');
      expect(trends).toHaveProperty('trend');
      expect(trends).toHaveProperty('top_errors');
      expect(trends).toHaveProperty('resolution_time');
      
      expect(trends.timeframe).toBe('24h');
      expect(typeof trends.error_rate).toBe('number');
      expect(typeof trends.trend).toBe('string');
      expect(Array.isArray(trends.top_errors)).toBe(true);
    });
  });

  describe('Error Escalation', () => {
    test('should escalate errors based on severity', async () => {
      const criticalError = new Error('Critical system failure');
      criticalError.name = 'SequelizeConnectionError';
      
      const context = { component: 'test' };
      const errorRecord = await aiErrorHandler.processError(criticalError, context);
      
      expect(errorRecord.severity).toBe('CRITICAL');
      expect(errorRecord.hierarchy_level).toBe(1);
      expect(errorRecord.escalation_time).toBe(0);
      expect(errorRecord.auto_fix_attempted).toBe(false);
    });

    test('should attempt auto-fix for appropriate errors', async () => {
      const mediumError = new Error('Validation error');
      mediumError.name = 'ValidationError';
      
      const context = { component: 'test' };
      const errorRecord = await aiErrorHandler.processError(mediumError, context);
      
      expect(errorRecord.severity).toBe('MEDIUM');
      expect(errorRecord.hierarchy_level).toBe(3);
      expect(errorRecord.escalation_time).toBe(900); // 15 minutes
    });
  });

  describe('Integration with Existing System', () => {
    test('should handle authentication errors', async () => {
      const response = await request(app)
        .get('/api/v1/artists')
        .send({});
      
      // Should be handled by AI error middleware
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    test('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: '123'
        });
      
      // Should be handled by AI error middleware
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent-route');
      
      // Should be handled by AI error middleware
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });
});

// Helper function to create test errors
function createTestError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

// Helper function to wait for async operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

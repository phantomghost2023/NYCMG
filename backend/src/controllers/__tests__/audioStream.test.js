const { setupAssociations } = require('../../models/associations');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../index');

// Set up associations for testing
setupAssociations();

// Mock the database connection in the app
jest.mock('../../config/db.config', () => {
  const { sequelize } = require('../../config/db.test.config');
  return { sequelize };
});

describe('Audio Streaming API', () => {
  // Create a test audio file
  const testFileName = 'test-audio.mp3';
  const testFilePath = path.join(__dirname, '../../uploads', testFileName);
  
  beforeAll(() => {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Create a dummy audio file for testing
    fs.writeFileSync(testFilePath, 'dummy audio content for testing');
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('GET /api/v1/audio/stream/:filename', () => {
    it('should stream an audio file', async () => {
      const response = await request(app)
        .get(`/api/v1/audio/stream/${testFileName}`)
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/audio/);
      expect(response.headers['accept-ranges']).toBe('bytes');
    });

    it('should handle range requests for partial content', async () => {
      const response = await request(app)
        .get(`/api/v1/audio/stream/${testFileName}`)
        .set('Range', 'bytes=0-10')
        .expect(206);
      
      expect(response.headers['content-range']).toBeDefined();
      expect(response.headers['accept-ranges']).toBe('bytes');
    });

    it('should return 404 for non-existent files', async () => {
      const response = await request(app)
        .get('/api/v1/audio/stream/non-existent-file.mp3')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
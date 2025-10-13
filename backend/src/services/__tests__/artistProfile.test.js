// Create mock functions
const mockFindByPk = jest.fn();

// Mock the Artist model
jest.mock('../../models/artist.model', () => {
  return {
    findByPk: mockFindByPk
  };
});

// Mock the associations to prevent errors
jest.doMock('../../models/associations', () => {
  return {
    setupAssociations: jest.fn()
  };
});

const request = require('supertest');
const app = require('../../index');

describe('Artist Profile API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('PUT /api/v1/artist-profile/:id/profile', () => {
    it('should reject requests without authentication', async () => {
      // Create a mock artist for the test
      const mockArtist = {
        id: 'artist123',
        user_id: 'user123',
        artist_name: 'Test Artist'
      };

      // Mock the Artist.findByPk method
      mockFindByPk.mockResolvedValue(mockArtist);

      const response = await request(app)
        .put('/api/v1/artist-profile/artist123/profile')
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
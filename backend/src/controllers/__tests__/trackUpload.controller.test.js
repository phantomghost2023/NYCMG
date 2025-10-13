const { uploadTrack } = require('../trackUpload.controller');
const { 
  uploadSingleFile, 
  uploadMixedFiles, 
  getFileUrl 
} = require('../../services/fileUpload.service');
const { createTrack } = require('../../services/track.service');

// Mock the file upload service functions
jest.mock('../../services/fileUpload.service');
jest.mock('../../services/track.service');

describe('Track Upload Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      files: {},
      body: {},
      user: { userId: 'currentUserId' }
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('uploadTrack', () => {
    it('should upload a track successfully', async () => {
      req.files = {
        audio: [{
          filename: 'test-audio.mp3'
        }]
      };
      
      req.body = {
        title: 'Test Track',
        description: 'Test Description',
        releaseDate: '2023-01-01',
        isExplicit: 'true',
        genreIds: '["genre1", "genre2"]'
      };
      
      const mockFileUrl = '/uploads/test-audio.mp3';
      getFileUrl.mockReturnValue(mockFileUrl);
      
      const mockTrack = { 
        id: '1', 
        title: 'Test Track',
        audio_url: mockFileUrl
      };
      createTrack.mockResolvedValue(mockTrack);

      await uploadTrack(req, res);

      expect(createTrack).toHaveBeenCalledWith('currentUserId', {
        title: 'Test Track',
        description: 'Test Description',
        release_date: new Date('2023-01-01'),
        is_explicit: true,
        genreIds: ['genre1', 'genre2'],
        audio_url: mockFileUrl
      });
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Track uploaded successfully',
        track: mockTrack
      });
    });

    it('should return 400 when no files are uploaded', async () => {
      req.files = undefined;

      await uploadTrack(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No files uploaded' });
    });

    it('should handle service errors', async () => {
      req.files = {
        audio: [{
          filename: 'test-audio.mp3'
        }]
      };
      
      req.body = {
        title: 'Test Track'
      };
      
      const mockFileUrl = '/uploads/test-audio.mp3';
      getFileUrl.mockReturnValue(mockFileUrl);
      
      const errorMessage = 'Upload failed';
      createTrack.mockRejectedValue(new Error(errorMessage));

      await uploadTrack(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
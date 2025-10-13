const express = require('express');
const router = express.Router();
const trackUploadController = require('../controllers/trackUpload.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

// Upload track with audio file and cover art
router.post(
  '/upload', 
  uploadLimiter,
  authenticateToken, 
  trackUploadController.uploadTrackWithFiles, 
  trackUploadController.uploadTrack
);

module.exports = router;
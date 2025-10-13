const { uploadSingleFile, uploadMixedFiles, getFileUrl } = require('../services/fileUpload.service');
const { createTrack } = require('../services/track.service');
const { Track } = require('../models');

// Handle track audio file upload
const uploadTrackAudio = uploadSingleFile('audio');

// Handle track cover art upload
const uploadTrackCoverArt = uploadSingleFile('coverArt');

// Upload track with audio file and metadata
const uploadTrack = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Extract artist ID from authenticated user
    const artistId = req.user.userId;

    // Prepare track data
    const trackData = {
      title: req.body.title,
      description: req.body.description,
      release_date: req.body.releaseDate ? new Date(req.body.releaseDate) : new Date(),
      is_explicit: req.body.isExplicit === 'true',
      genreIds: req.body.genreIds ? JSON.parse(req.body.genreIds) : []
    };

    // Add file URLs if files were uploaded
    if (req.files.audio && req.files.audio[0]) {
      trackData.audio_url = getFileUrl(req.files.audio[0].filename);
    }

    if (req.files.coverArt && req.files.coverArt[0]) {
      trackData.cover_art_url = getFileUrl(req.files.coverArt[0].filename);
    }

    // Create track in database
    const track = await createTrack(artistId, trackData);

    res.status(201).json({
      message: 'Track uploaded successfully',
      track
    });
  } catch (error) {
    console.error('Track upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload track' });
  }
};

// Handle mixed file upload (audio + cover art)
const uploadTrackMixed = uploadMixedFiles([
  { name: 'audio', maxCount: 1 },
  { name: 'coverArt', maxCount: 1 }
]);

// Upload track with mixed files middleware
const uploadTrackWithFiles = (req, res, next) => {
  uploadTrackMixed(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = {
  uploadTrack,
  uploadTrackWithFiles
};
const express = require('express');
const router = express.Router();
const artistProfileController = require('../controllers/artistProfile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Update artist profile with profile picture
router.put(
  '/:id/profile', 
  authenticateToken, 
  artistProfileController.uploadProfilePicture, 
  artistProfileController.updateArtistProfile
);

module.exports = router;
const { uploadSingleFile, getFileUrl, deleteFile } = require('../services/fileUpload.service');
const { updateArtist } = require('../services/artist.service');

// Handle artist profile picture upload
const uploadProfilePicture = uploadSingleFile('profilePicture');

// Update artist profile with profile picture
const updateArtistProfile = async (req, res) => {
  try {
    const artistId = req.params.id;
    const updateData = req.body;
    
    // If a profile picture was uploaded, add it to the update data
    if (req.file) {
      updateData.profile_picture_url = getFileUrl(req.file.filename);
    }
    
    // Update artist in database
    const updatedArtist = await updateArtist(artistId, updateData);
    
    res.json({
      message: 'Artist profile updated successfully',
      artist: updatedArtist
    });
  } catch (error) {
    console.error('Artist profile update error:', error);
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to update artist profile' });
  }
};

module.exports = {
  uploadProfilePicture,
  updateArtistProfile
};
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArtistProfile } from '../store/artistSlice';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@mui/material';
import { PhotoCamera, Edit } from '@mui/icons-material';

const ProfilePictureUpload = ({ artist }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    
    // Dispatch update action
    try {
      await dispatch(updateArtistProfile({ artistId: artist.id, formData }));
      handleClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {artist.profile_picture_url ? (
          <CardMedia
            component="img"
            image={artist.profile_picture_url}
            alt={artist.artist_name}
            sx={{ 
              width: 150, 
              height: 150, 
              borderRadius: '50%',
              border: '3px solid #fff',
              boxShadow: 3
            }}
          />
        ) : (
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #fff',
              boxShadow: 3
            }}
          >
            <Typography variant="h4" component="div" sx={{ color: '#FF4081' }}>
              {artist.artist_name.charAt(0)}
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={handleOpen}
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Edit />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {previewUrl ? (
              <CardMedia
                component="img"
                image={previewUrl}
                alt="Preview"
                sx={{ 
                  width: 200, 
                  height: 200, 
                  borderRadius: '50%',
                  margin: '0 auto',
                  mb: 2
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  border: '2px dashed #ccc'
                }}
              >
                <PhotoCamera sx={{ fontSize: 48, color: '#999' }} />
              </Box>
            )}
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                Choose Image
              </Button>
            </label>
            
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePictureUpload;
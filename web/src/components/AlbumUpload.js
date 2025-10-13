import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from 'nycmg-shared';

const AlbumUpload = ({ uploadType = 'album' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [genreIds, setGenreIds] = useState([]);
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [tracks, setTracks] = useState([{ title: '', audioFile: null, description: '' }]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.genres);
  
  const handleGenreChange = (event) => {
    const value = event.target.value;
    setGenreIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCoverArtFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCoverArtFile(event.target.files[0]);
    }
  };

  // Handle track field changes
  const handleTrackChange = (index, field, value) => {
    const newTracks = [...tracks];
    newTracks[index][field] = value;
    setTracks(newTracks);
  };

  // Add a new track field
  const addTrack = () => {
    setTracks([...tracks, { title: '', audioFile: null, description: '' }]);
  };

  // Remove a track field
  const removeTrack = (index) => {
    if (tracks.length > 1) {
      const newTracks = tracks.filter((_, i) => i !== index);
      setTracks(newTracks);
    }
  };

  // Handle track audio file change
  const handleTrackAudioFileChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      handleTrackChange(index, 'audioFile', event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!title || !coverArtFile) {
      setError('Title and cover art are required');
      return;
    }
    
    // Check if all tracks have titles and audio files
    for (let i = 0; i < tracks.length; i++) {
      if (!tracks[i].title || !tracks[i].audioFile) {
        setError(`Track ${i + 1} must have a title and audio file`);
        return;
      }
    }
    
    setUploading(true);
    setError('');
    setSuccess(false);
    
    try {
      // First, upload the album/EP
      const albumFormData = new FormData();
      albumFormData.append('title', title);
      albumFormData.append('description', description);
      albumFormData.append('releaseDate', releaseDate);
      albumFormData.append('isExplicit', isExplicit);
      albumFormData.append('coverArt', coverArtFile);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Upload album/EP
      const albumResponse = await fetch(`${API_BASE_URL}/albums`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: albumFormData
      });
      
      const albumData = await albumResponse.json();
      
      if (!albumResponse.ok) {
        throw new Error(albumData.error || `Failed to upload ${uploadType}`);
      }
      
      // Then upload each track
      for (let i = 0; i < tracks.length; i++) {
        const trackFormData = new FormData();
        trackFormData.append('title', tracks[i].title);
        trackFormData.append('description', tracks[i].description);
        trackFormData.append('audio', tracks[i].audioFile);
        trackFormData.append('album_id', albumData.id); // Associate track with album
        trackFormData.append('genreIds', JSON.stringify(genreIds));
        trackFormData.append('releaseDate', releaseDate);
        trackFormData.append('isExplicit', isExplicit);
        
        const trackResponse = await fetch(`${API_BASE_URL}/track-upload/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: trackFormData
        });
        
        const trackData = await trackResponse.json();
        
        if (!trackResponse.ok) {
          throw new Error(trackData.error || `Failed to upload track ${i + 1}`);
        }
      }
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setReleaseDate('');
      setIsExplicit(false);
      setGenreIds([]);
      setCoverArtFile(null);
      setTracks([{ title: '', audioFile: null, description: '' }]);
      
      console.log(`${uploadType} uploaded:`, albumData);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload New {uploadType === 'ep' ? 'EP' : 'Album'}
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        {uploadType === 'ep' 
          ? 'Upload an EP (Extended Play) with 3-6 tracks' 
          : 'Upload a full album with multiple tracks'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {uploadType === 'ep' ? 'EP' : 'Album'} uploaded successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={`${uploadType === 'ep' ? 'EP' : 'Album'} Title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        
        <TextField
          fullWidth
          label="Release Date"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={genreIds}
            onChange={handleGenreChange}
            renderValue={(selected) => selected.map(id => {
              const genre = genres.find(g => g.id === id);
              return genre ? genre.name : id;
            }).join(', ')}
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                <Checkbox checked={genreIds.indexOf(genre.id) > -1} />
                <Typography>{genre.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={isExplicit}
              onChange={(e) => setIsExplicit(e.target.checked)}
            />
          }
          label="Explicit Content"
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cover Art
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverArtFileChange}
            required
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Tracks
        </Typography>
        
        {tracks.map((track, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Track {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Track Title"
                  value={track.title}
                  onChange={(e) => handleTrackChange(index, 'title', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mt: 2 }}>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleTrackAudioFileChange(index, e)}
                    required
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Track Description (Optional)"
                  value={track.description}
                  onChange={(e) => handleTrackChange(index, 'description', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              {tracks.length > 1 && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeTrack(index)}
                  >
                    Remove Track
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        ))}
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={addTrack}
          >
            Add Another Track
          </Button>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? `Uploading ${uploadType}...` : `Upload ${uploadType}`}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AlbumUpload;
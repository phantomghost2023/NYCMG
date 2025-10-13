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

const EPUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [genreIds, setGenreIds] = useState([]);
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [tracks, setTracks] = useState([
    { title: '', audioFile: null, description: '' },
    { title: '', audioFile: null, description: '' },
    { title: '', audioFile: null, description: '' }
  ]);
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
      // First, upload the EP
      const epFormData = new FormData();
      epFormData.append('title', title);
      epFormData.append('description', description);
      epFormData.append('releaseDate', releaseDate);
      epFormData.append('isExplicit', isExplicit);
      epFormData.append('coverArt', coverArtFile);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Upload EP
      const epResponse = await fetch(`${API_BASE_URL}/albums`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: epFormData
      });
      
      const epData = await epResponse.json();
      
      if (!epResponse.ok) {
        throw new Error(epData.error || 'Failed to upload EP');
      }
      
      // Then upload each track
      for (let i = 0; i < tracks.length; i++) {
        const trackFormData = new FormData();
        trackFormData.append('title', tracks[i].title);
        trackFormData.append('description', tracks[i].description);
        trackFormData.append('audio', tracks[i].audioFile);
        trackFormData.append('album_id', epData.id); // Associate track with EP
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
      setTracks([
        { title: '', audioFile: null, description: '' },
        { title: '', audioFile: null, description: '' },
        { title: '', audioFile: null, description: '' }
      ]);
      
      console.log('EP uploaded:', epData);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload New EP
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Upload an EP (Extended Play) with 3-6 tracks
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          EP uploaded successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="EP Title"
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
            EP Cover Art
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
          EP Tracks (3-6 tracks)
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
            </Grid>
          </Paper>
        ))}
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading EP...' : 'Upload EP'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EPUpload;
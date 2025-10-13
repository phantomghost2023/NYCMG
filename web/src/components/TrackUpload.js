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
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from 'nycmg-shared';

const TrackUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [genreIds, setGenreIds] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.genres);
  
  const handleGenreChange = (event) => {
    const value = event.target.value;
    setGenreIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAudioFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleCoverArtFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCoverArtFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!title || !audioFile) {
      setError('Title and audio file are required');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('releaseDate', releaseDate);
      formData.append('isExplicit', isExplicit);
      formData.append('genreIds', JSON.stringify(genreIds));
      formData.append('audio', audioFile);
      if (coverArtFile) {
        formData.append('coverArt', coverArtFile);
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Upload track
      const response = await fetch(`${API_BASE_URL}/track-upload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload track');
      }
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setReleaseDate('');
      setIsExplicit(false);
      setGenreIds([]);
      setAudioFile(null);
      setCoverArtFile(null);
      
      // In a real app, you would dispatch an action to update the store
      console.log('Track uploaded:', data.track);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload New Track
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Track uploaded successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Track Title"
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
            Audio File
          </Typography>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioFileChange}
            required
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cover Art (Optional)
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverArtFileChange}
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload Track'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TrackUpload;
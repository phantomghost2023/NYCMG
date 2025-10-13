import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracks } from '../store/trackSlice';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import AudioPlayer from './AudioPlayer';

const ArtistTrackList = ({ artistId }) => {
  const dispatch = useDispatch();
  const { tracks, loading, error } = useSelector((state) => state.tracks);

  useEffect(() => {
    if (artistId) {
      // Fetch tracks for this specific artist
      dispatch(fetchTracks({ 
        artistId: artistId,
        limit: 10,
        offset: 0
      }));
    }
  }, [artistId, dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">Error loading tracks: {error}</Typography>
      </Box>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">No tracks available</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {tracks.map((track) => (
        <Grid item xs={12} key={track.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {track.cover_art_url ? (
                  <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80, mr: 2, borderRadius: 1 }}
                    image={track.cover_art_url}
                    alt={track.title}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="h5" color="textSecondary">
                      ♪
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {track.title}
                  </Typography>
                  
                  {track.genres && track.genres.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {track.genres.map((genre) => (
                        <Button
                          key={genre.id}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        >
                          {genre.name}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
            
            <AudioPlayer track={track} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ArtistTrackList;
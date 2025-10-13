import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums } from '../store/albumSlice';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box } from '@mui/material';

const AlbumList = ({ artistId }) => {
  const dispatch = useDispatch();
  const { albums, loading, error } = useSelector((state) => state.albums);

  useEffect(() => {
    if (artistId) {
      dispatch(fetchAlbums({ artistId }));
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
        <Typography color="error">Error loading albums: {error}</Typography>
      </Box>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">No albums available</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {albums.map((album) => (
        <Grid item xs={12} sm={6} md={4} key={album.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="div"
              sx={{ 
                height: 200, 
                bgcolor: '#e0e0e0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              <Typography variant="h1" component="div" sx={{ color: '#FF4081' }}>
                {album.title.charAt(0)}
              </Typography>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {album.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {album.tracks ? `${album.tracks.length} tracks` : 'No tracks'}
              </Typography>
              {album.release_date && (
                <Typography variant="body2" color="text.secondary">
                  Released: {new Date(album.release_date).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumList;
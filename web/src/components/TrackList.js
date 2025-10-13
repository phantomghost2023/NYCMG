import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracks } from '../store/trackSlice';
import AudioPlayer from './AudioPlayer';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const TrackList = () => {
  const dispatch = useDispatch();
  const { tracks, loading, error, totalCount, currentPage, totalPages } = useSelector((state) => state.tracks);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(fetchTracks({ 
      search: searchTerm,
      limit: 10,
      offset: (currentPage - 1) * 10
    }));
  }, [dispatch, searchTerm, currentPage]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    // The fetchTracks call with offset 0 will be triggered by the useEffect
  };
  
  const handlePageChange = (page) => {
    // The fetchTracks call with the new offset will be triggered by the useEffect
  };
  
  if (loading && tracks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && tracks.length === 0) {
    return (
      <Alert severity="error">
        Error loading tracks: {error}
      </Alert>
    );
  }
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Latest Tracks
      </Typography>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading && tracks.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      <Grid container spacing={3}>
        {tracks.map((track) => (
          <Grid item xs={12} key={track.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {track.cover_art_url ? (
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, mr: 2 }}
                      image={track.cover_art_url}
                      alt={track.title}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="h4" color="textSecondary">
                        ♪
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {track.title}
                    </Typography>
                    
                    {track.artist && (
                      <Typography variant="subtitle1" color="textSecondary">
                        by {track.artist.artist_name}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="textSecondary">
                      Released: {new Date(track.release_date).toLocaleDateString()}
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
              
              <CardActions>
                <AudioPlayer track={track} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {tracks.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No tracks found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {searchTerm ? 'Try a different search term' : 'Be the first to upload a track!'}
          </Typography>
        </Box>
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={10}
          onPageChange={(page) => dispatch(fetchTracks({ 
            search: searchTerm,
            limit: 10,
            offset: (page - 1) * 10
          }))}
        />
      )}
    </Box>
  );
};

export default TrackList;
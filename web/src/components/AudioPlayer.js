import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const AudioPlayer = ({ track, onTrackEnd, onTrackStart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleEnded = () => {
      setIsPlaying(false);
      if (onTrackEnd) onTrackEnd();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [onTrackEnd]);

  // Play/pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Check if we need to set the source
      if (!audio.src || audio.src === window.location.href) {
        // Extract filename from the audio URL
        const url = new URL(track.audio_url, window.location.origin);
        const filename = url.pathname.split('/').pop();
        audio.src = `/api/v1/audio/stream/${filename}`;
      }
      audio.play().catch(e => {
        console.error('Playback failed:', e);
      });
      if (onTrackStart) onTrackStart(track);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle time slider change
  const handleTimeSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  // Handle volume change
  const handleVolumeChange = (event, newValue) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newValue;
    setVolume(newValue);
  };

  // Format time in mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!track || !track.audio_url) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography>No audio track available</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <audio ref={audioRef} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={togglePlayPause} disabled={isLoading}>
          {isLoading ? (
            <div className="loading-spinner" style={{ width: 24, height: 24, border: '2px solid #f3f3f3', borderTop: '2px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>
        
        <Box sx={{ ml: 2, mr: 2, flexGrow: 1 }}>
          <Typography variant="subtitle1">{track.title}</Typography>
          {track.artist && (
            <Typography variant="body2" color="textSecondary">
              {track.artist.artist_name}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ minWidth: 40 }}>
          {formatTime(currentTime)}
        </Typography>
        
        <Slider
          value={currentTime}
          onChange={handleTimeSliderChange}
          max={duration || 100}
          sx={{ mx: 2, flexGrow: 1 }}
        />
        
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
          {formatTime(duration)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <VolumeUpIcon sx={{ mr: 1 }} />
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          max={1}
          step={0.01}
          sx={{ width: 100 }}
        />
      </Box>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Paper>
  );
};

export default AudioPlayer;
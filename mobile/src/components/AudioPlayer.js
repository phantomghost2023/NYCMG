import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  TrackPlayerEvents,
  State,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioPlayer = ({ track }) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Get playback state
  const playbackState = usePlaybackState();

  // Listen for track player events
  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], async (event) => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else if (event.state === State.Paused || event.state === State.Stopped) {
      setIsPlaying(false);
    }
  });

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_TRACK_CHANGED], async (event) => {
    if (event.nextTrack) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  // Initialize player and load track
  useEffect(() => {
    const setupPlayer = async () => {
      if (track) {
        // Reset player and add track to queue
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: track.id.toString(),
          url: track.audioUrl,
          title: track.title,
          artist: track.artist?.username || 'Unknown Artist',
          artwork: track.coverArtUrl,
          duration: track.duration,
        });

        // Get track duration
        const trackDuration = await TrackPlayer.getDuration();
        setDuration(trackDuration);
      }
    };

    setupPlayer();

    // Cleanup function
    return () => {
      // Don't reset here as it might interfere with other components
    };
  }, [track]);

  // Update position
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const currentPosition = await TrackPlayer.getPosition();
        const currentDuration = await TrackPlayer.getDuration();
        setPosition(currentPosition);
        // Only update duration if it's different (to avoid unnecessary re-renders)
        if (currentDuration && currentDuration !== duration) {
          setDuration(currentDuration);
        }
      } catch (error) {
        console.log('Error getting position/duration:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      if (currentTrack) {
        await TrackPlayer.play();
      } else if (track) {
        // If no current track, play the loaded track
        await TrackPlayer.skip(track.id.toString());
        await TrackPlayer.play();
      }
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      // Handle error if no next track
      console.log('No next track available');
    }
  };

  const skipToPrevious = async () => {
    try {
      // If we're more than 3 seconds into the track, restart it
      if (position > 3) {
        await TrackPlayer.seekTo(0);
      } else {
        // Otherwise, try to go to previous track
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      // Handle error if no previous track
      console.log('No previous track available');
    }
  };

  const seekTo = async (value) => {
    await TrackPlayer.seekTo(value);
    setPosition(value);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null || seconds === undefined) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Don't render if no track is provided
  if (!track) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {currentTrack?.title || track?.title || 'No track selected'}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {currentTrack?.artist || track?.artist?.username || 'Unknown Artist'}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.progressSlider}
          value={position}
          minimumValue={0}
          maximumValue={duration > 0 ? duration : 1}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#1db954"
          maximumTrackTintColor="#b3b3b3"
          thumbStyle={styles.thumb}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
          <Icon name="skip-previous" size={32} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Icon 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={40} 
            color="#fff" 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
          <Icon name="skip-next" size={32} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    width: 40,
  },
  progressSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  thumb: {
    width: 16,
    height: 16,
    backgroundColor: '#1db954',
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 16,
  },
  playButton: {
    backgroundColor: '#1db954',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioPlayer;
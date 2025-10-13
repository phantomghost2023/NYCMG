import TrackPlayer from 'react-native-track-player';

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      ],
    });
    return true;
  } catch (error) {
    console.log('Error setting up player:', error);
    return false;
  }
};

export const addTrack = async (track) => {
  await TrackPlayer.add({
    id: track.id.toString(),
    url: track.audioUrl,
    title: track.title,
    artist: track.artist?.username || 'Unknown Artist',
    artwork: track.coverArtUrl,
    duration: track.duration,
  });
};

export const playTrack = async (track) => {
  await TrackPlayer.reset();
  await addTrack(track);
  await TrackPlayer.play();
};

export const togglePlayback = async (playbackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (playbackState === TrackPlayer.STATE_PAUSED) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

export const skipToNext = async () => {
  try {
    await TrackPlayer.skipToNext();
  } catch (error) {
    console.log('No next track available');
  }
};

export const skipToPrevious = async () => {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (error) {
    console.log('No previous track available');
  }
};

export const seekTo = async (position) => {
  await TrackPlayer.seekTo(position);
};

export const getProgress = async () => {
  const position = await TrackPlayer.getPosition();
  const duration = await TrackPlayer.getDuration();
  return { position, duration };
};

export const getCurrentTrack = async () => {
  const trackId = await TrackPlayer.getCurrentTrack();
  if (trackId !== null) {
    return await TrackPlayer.getTrack(trackId);
  }
  return null;
};
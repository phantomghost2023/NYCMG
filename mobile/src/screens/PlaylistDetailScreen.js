import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPlaylist, removeTrackFromPlaylist } from '../store/playlistSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaylistDetailScreen = ({ route, navigation }) => {
  const { playlistId } = route.params;
  const dispatch = useDispatch();
  const { selectedPlaylist, loading, error } = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getPlaylist(playlistId));
  }, [playlistId, dispatch]);

  useEffect(() => {
    if (selectedPlaylist) {
      navigation.setOptions({
        title: selectedPlaylist.name,
      });
    }
  }, [selectedPlaylist, navigation]);

  const handleRemoveTrack = (track) => {
    Alert.alert(
      'Remove Track',
      `Are you sure you want to remove "${track.title}" from this playlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeTrackFromPlaylist({ playlistId, trackId: track.id })),
        },
      ]
    );
  };

  const playTrack = (track) => {
    // In a real implementation, this would play the track
    console.log('Playing track:', track.title);
  };

  const viewArtistProfile = (artist) => {
    if (artist && artist.id) {
      navigation.navigate('ArtistProfile', { artistId: artist.id });
    }
  };

  if (loading && !selectedPlaylist) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={styles.loadingText}>Loading playlist...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getPlaylist(playlistId))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedPlaylist) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Playlist not found</Text>
      </View>
    );
  }

  const trackCount = selectedPlaylist.tracks ? selectedPlaylist.tracks.length : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playlistImagePlaceholder}>
          <Icon name="queue-music" size={50} color="#FF4081" />
        </View>
        <Text style={styles.playlistName}>{selectedPlaylist.name}</Text>
        {selectedPlaylist.description ? (
          <Text style={styles.playlistDescription}>{selectedPlaylist.description}</Text>
        ) : null}
        <Text style={styles.trackCount}>{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</Text>
      </View>

      <View style={styles.content}>
        {selectedPlaylist.tracks && selectedPlaylist.tracks.length > 0 ? (
          selectedPlaylist.tracks.map((track, index) => (
            <View key={track.id} style={styles.trackItem}>
              <TouchableOpacity
                style={styles.trackInfoContainer}
                onPress={() => playTrack(track)}
              >
                <Text style={styles.trackNumber}>{index + 1}</Text>
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <TouchableOpacity onPress={() => viewArtistProfile(track.artist)}>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {track.artist?.username || 'Unknown Artist'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveTrack(track)}
              >
                <Icon name="close" size={20} color="#f44336" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>This playlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Add tracks to this playlist from the track details screen
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playlistImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  playlistDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  trackCount: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    padding: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trackInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackNumber: {
    fontSize: 16,
    color: '#999',
    width: 30,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  trackArtist: {
    fontSize: 14,
    color: '#FF4081',
    textDecorationLine: 'underline',
  },
  removeButton: {
    padding: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default PlaylistDetailScreen;
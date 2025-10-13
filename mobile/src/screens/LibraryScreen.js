import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OfflineService from '../services/OfflineService';
import Playlist from '../components/Playlist';
import { getUserPlaylists, createPlaylist, deletePlaylist, setSelectedPlaylist } from '../store/playlistSlice';
import { getUserFavorites } from '../store/favoriteSlice';

const LibraryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cachedTracks, loading: offlineLoading } = useSelector((state) => state.offline);
  const { playlists, loading: playlistLoading } = useSelector((state) => state.playlist);
  const { favorites, loading: favoriteLoading } = useSelector((state) => state.favorite);
  const [activeTab, setActiveTab] = useState('offline'); // offline, playlists, favorites

  useEffect(() => {
    loadCachedTracks();
    dispatch(getUserPlaylists());
    dispatch(getUserFavorites());
  }, [dispatch]);

  const loadCachedTracks = async () => {
    try {
      // This would be handled by the offline slice in a real implementation
      // For now, we'll use the OfflineService
    } catch (error) {
      console.error('Error loading cached tracks:', error);
    }
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

  const handleCreatePlaylist = () => {
    Alert.prompt(
      'Create Playlist',
      'Enter a name for your new playlist:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: (name) => {
            if (name && name.trim()) {
              dispatch(createPlaylist({ name: name.trim() }));
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleDeletePlaylist = (playlist) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deletePlaylist(playlist.id)),
        },
      ]
    );
  };

  const handlePlaylistPress = (playlist) => {
    dispatch(setSelectedPlaylist(playlist));
    navigation.navigate('PlaylistDetail', { playlistId: playlist.id });
  };

  const renderOfflineTrack = ({ item: track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => playTrack(track)}
    >
      {track.coverArtUrl ? (
        <Image source={{ uri: track.coverArtUrl }} style={styles.trackImage} />
      ) : (
        <View style={styles.trackImagePlaceholder}>
          <Text style={styles.trackImageText}>
            {track.title?.charAt(0) || 'T'}
          </Text>
        </View>
      )}
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
  );

  const renderPlaylist = ({ item: playlist }) => (
    <Playlist
      playlist={playlist}
      onPress={handlePlaylistPress}
      onLongPress={() => handleDeletePlaylist(playlist)}
    />
  );

  const renderFavorite = ({ item: track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => playTrack(track)}
    >
      {track.coverArtUrl ? (
        <Image source={{ uri: track.coverArtUrl }} style={styles.trackImage} />
      ) : (
        <View style={styles.trackImagePlaceholder}>
          <Text style={styles.trackImageText}>
            {track.title?.charAt(0) || 'T'}
          </Text>
        </View>
      )}
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
  );

  const loading = offlineLoading || playlistLoading || favoriteLoading;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'offline' && styles.activeTab]}
          onPress={() => setActiveTab('offline')}
        >
          <Text style={[styles.tabText, activeTab === 'offline' && styles.activeTabText]}>
            Offline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
            Playlists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Loading library...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {activeTab === 'offline' && (
            <>
              {cachedTracks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No offline tracks yet</Text>
                  <Text style={styles.emptySubtext}>
                    Download tracks in offline mode to listen without internet
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={cachedTracks}
                  renderItem={renderOfflineTrack}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </>
          )}

          {activeTab === 'playlists' && (
            <>
              <TouchableOpacity style={styles.createButton} onPress={handleCreatePlaylist}>
                <Text style={styles.createButtonText}>Create New Playlist</Text>
              </TouchableOpacity>
              {playlists.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No playlists yet</Text>
                  <Text style={styles.emptySubtext}>
                    Create your first playlist to organize your music
                  </Text>
                  <TouchableOpacity style={styles.emptyButton} onPress={handleCreatePlaylist}>
                    <Text style={styles.emptyButtonText}>Create Playlist</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={playlists}
                  renderItem={renderPlaylist}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No favorites yet</Text>
                  <Text style={styles.emptySubtext}>
                    Tap the heart icon on tracks to add them to your favorites
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={favorites}
                  renderItem={renderFavorite}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </>
          )}
        </View>
      )}
    </View>
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
    backgroundColor: '#FF4081',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4081',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF4081',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FF4081',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  trackImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  trackImageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4081',
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
});

export default LibraryScreen;
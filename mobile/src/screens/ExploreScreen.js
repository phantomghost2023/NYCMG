import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtists } from '../store/artistSlice';

const ExploreScreen = ({ route, navigation }) => {
  const { boroughId, boroughName } = route.params || {};
  const dispatch = useDispatch();
  const { artists, loading, error, totalCount } = useSelector((state) => state.artists);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtists, setFilteredArtists] = useState([]);

  useEffect(() => {
    if (boroughId) {
      // In a real app, you would filter artists by borough
      dispatch(fetchArtists());
    } else {
      // Load all artists if no borough specified
      dispatch(fetchArtists());
    }
  }, [boroughId, dispatch]);

  useEffect(() => {
    // Filter artists based on search query
    if (searchQuery.trim() === '') {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(artist => 
        artist.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (artist.user && artist.user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArtists(filtered);
    }
  }, [searchQuery, artists]);

  const handleArtistPress = (artist) => {
    navigation.navigate('ArtistProfile', { artistId: artist.id, artistName: artist.artist_name });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={styles.loadingText}>Loading artists...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchArtists())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore {boroughName || 'NYC'}</Text>
        <Text style={styles.subtitle}>Discover local artists</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search artists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Artists</Text>
        <Text style={styles.artistCount}>{filteredArtists.length} artists found</Text>
        
        {filteredArtists.length === 0 && searchQuery.trim() !== '' ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No artists found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        ) : (
          <View style={styles.artistsContainer}>
            {filteredArtists.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistCard}
                onPress={() => handleArtistPress(artist)}
              >
                <View style={styles.artistImagePlaceholder}>
                  <Text style={styles.artistInitial}>
                    {artist.artist_name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.artistName} numberOfLines={1}>
                  {artist.artist_name}
                </Text>
                {artist.user && (
                  <Text style={styles.artistUsername} numberOfLines={1}>
                    @{artist.user.username}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 5,
    color: '#333',
  },
  artistCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 20,
    marginBottom: 20,
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
  },
  artistsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  artistCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  artistImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  artistInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  artistUsername: {
    fontSize: 14,
    color: '#666',
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
});

export default ExploreScreen;
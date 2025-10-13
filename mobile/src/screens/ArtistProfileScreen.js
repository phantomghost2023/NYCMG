import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtist, clearSelectedArtist } from '../store/artistSlice';
import FollowButton from '../components/FollowButton';
import SocialInteractionBar from '../components/SocialInteractionBar';

const ArtistProfileScreen = ({ route, navigation }) => {
  const { artistId, artistName } = route.params || {};
  const dispatch = useDispatch();
  const { selectedArtist, loading, error } = useSelector((state) => state.artists);

  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtist(artistId));
    }

    // Set the screen title
    navigation.setOptions({
      title: artistName || 'Artist Profile',
    });

    // Cleanup function to clear selected artist when component unmounts
    return () => {
      dispatch(clearSelectedArtist());
    };
  }, [artistId, artistName, dispatch, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={styles.loadingText}>Loading artist profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchArtist(artistId))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedArtist) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Artist not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.artistImagePlaceholder}>
          <Text style={styles.artistInitial}>
            {selectedArtist.artist_name.charAt(0)}
          </Text>
        </View>
        <Text style={styles.artistName}>{selectedArtist.artist_name}</Text>
        {selectedArtist.user && (
          <Text style={styles.artistUsername}>@{selectedArtist.user.username}</Text>
        )}
        {selectedArtist.verified_nyc && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified NYC Artist</Text>
          </View>
        )}
        
        {/* Social Interaction Bar */}
        <SocialInteractionBar 
          artistId={selectedArtist.id}
          showLike={false}
          showShare={false}
          style={styles.socialBar}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            This is where the artist's biography would appear. In a full implementation,
            this would show detailed information about the artist, their history, and
            their connection to NYC.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Discography</Text>
          <Text style={styles.placeholderText}>
            Artist discography would appear here with albums and tracks.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.placeholderText}>
            Information about upcoming shows and events would appear here.
          </Text>
        </View>
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
  artistImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  artistInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  artistUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 15,
  },
  verifiedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialBar: {
    marginTop: 15,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
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
});

export default ArtistProfileScreen;
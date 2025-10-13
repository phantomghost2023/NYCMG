import React, { useEffect, useState } from 'react';
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
import { fetchBoroughs } from '../store/boroughSlice';
import AudioPlayer from '../components/AudioPlayer';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { boroughs, loading, error } = useSelector((state) => state.boroughs);
  const [sampleTrack, setSampleTrack] = useState(null);

  useEffect(() => {
    dispatch(fetchBoroughs());
    
    // Only set the sample track once, not on every render
    if (!sampleTrack) {
      // Create a sample track for demonstration
      const track = {
        id: 1,
        title: 'Sample Track',
        artist: { username: 'Sample Artist' },
        audioUrl: 'https://example.com/sample-track.mp3',
        coverArtUrl: 'https://example.com/sample-cover.jpg',
        duration: 180, // 3 minutes in seconds
      };
      setSampleTrack(track);
    }
  }, [dispatch, sampleTrack]);

  const handleBoroughPress = (borough) => {
    navigation.navigate('Explore', { boroughId: borough.id, boroughName: borough.name });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
        <Text style={styles.loadingText}>Loading boroughs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchBoroughs())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>NYCMG</Text>
          <Text style={styles.subtitle}>Discover NYC Music</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Explore by Borough</Text>
          <View style={styles.boroughsContainer}>
            {boroughs.map((borough) => (
              <TouchableOpacity
                key={borough.id}
                style={styles.boroughCard}
                onPress={() => handleBoroughPress(borough)}
              >
                <View style={styles.boroughImagePlaceholder}>
                  <Text style={styles.boroughInitial}>{borough.name.charAt(0)}</Text>
                </View>
                <Text style={styles.boroughName}>{borough.name}</Text>
                <Text style={styles.boroughDescription} numberOfLines={2}>
                  {borough.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Audio Player at the bottom */}
      {sampleTrack && (
        <View style={styles.playerContainer}>
          <AudioPlayer track={sampleTrack} />
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
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  boroughsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boroughCard: {
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
  boroughImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  boroughInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  boroughName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  boroughDescription: {
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
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;
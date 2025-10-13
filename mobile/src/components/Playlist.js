import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Playlist = ({ playlist, onPress, style }) => {
  const trackCount = playlist.tracks ? playlist.tracks.length : 0;
  
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={() => onPress(playlist)}>
      <View style={styles.imageContainer}>
        {playlist.coverArtUrl ? (
          <Image source={{ uri: playlist.coverArtUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="queue-music" size={30} color="#FF4081" />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
        </Text>
        {playlist.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {playlist.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  imageContainer: {
    marginRight: 15,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#999',
  },
});

export default Playlist;
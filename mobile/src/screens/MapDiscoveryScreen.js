import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
} from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoroughs } from '../store/boroughSlice';
import { fetchArtists } from '../store/artistSlice';

const MapDiscoveryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { boroughs, loading: boroughsLoading } = useSelector((state) => state.boroughs);
  const { artists, loading: artistsLoading } = useSelector((state) => state.artists);
  const [selectedBorough, setSelectedBorough] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBoroughs());
    dispatch(fetchArtists());
    
    // Request location permissions
    requestLocationPermission();
  }, [dispatch]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'NYCMG needs access to your location to show nearby artists.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleBoroughPress = (borough) => {
    setSelectedBorough(borough);
    navigation.navigate('Explore', { boroughId: borough.id, boroughName: borough.name });
  };

  const handleArtistPress = (artist) => {
    navigation.navigate('ArtistProfile', { 
      artistId: artist.id, 
      artistName: artist.artist_name 
    });
  };

  const handleMapPress = () => {
    setSelectedBorough(null);
  };

  // Get artists for a specific borough
  const getArtistsForBorough = (boroughId) => {
    return artists.filter(artist => artist.borough_id === boroughId);
  };

  // Generate mock coordinates for boroughs (in a real app, this would come from the API)
  const getBoroughCoordinates = (borough) => {
    const coordinates = {
      1: { latitude: 40.7831, longitude: -73.9712 }, // Manhattan
      2: { latitude: 40.6782, longitude: -73.9442 }, // Brooklyn
      3: { latitude: 40.7282, longitude: -73.7949 }, // Queens
      4: { latitude: 40.5795, longitude: -74.1502 }, // Staten Island
      5: { latitude: 40.8448, longitude: -73.8648 }, // The Bronx
    };
    
    return coordinates[borough.id] || {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    };
  };

  // Generate mock coordinates for artists (in a real app, this would come from the API)
  const getArtistCoordinates = (artist) => {
    // For demo purposes, place artists near their borough
    const boroughCoords = getBoroughCoordinates({ id: artist.borough_id });
    return {
      latitude: boroughCoords.latitude + (Math.random() - 0.5) * 0.02,
      longitude: boroughCoords.longitude + (Math.random() - 0.5) * 0.02,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover NYC Music</Text>
        <Text style={styles.subtitle}>Tap on markers to explore</Text>
      </View>
      
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Borough Markers */}
        {boroughs.map((borough) => {
          const coords = getBoroughCoordinates(borough);
          const boroughArtists = getArtistsForBorough(borough.id);
          
          return (
            <Marker
              key={`borough-${borough.id}`}
              coordinate={coords}
              pinColor="#FF4081"
              onPress={(e) => {
                e.stopPropagation();
                handleBoroughPress(borough);
              }}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{borough.name}</Text>
                  <Text style={styles.calloutSubtitle}>{boroughArtists.length} artists</Text>
                  <TouchableOpacity 
                    style={styles.calloutButton}
                    onPress={() => handleBoroughPress(borough)}
                  >
                    <Text style={styles.calloutButtonText}>Explore</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          );
        })}
        
        {/* Artist Markers */}
        {artists.map((artist) => {
          const coords = getArtistCoordinates(artist);
          
          return (
            <Marker
              key={`artist-${artist.id}`}
              coordinate={coords}
              pinColor="#1db954"
              onPress={(e) => {
                e.stopPropagation();
                handleArtistPress(artist);
              }}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{artist.artist_name}</Text>
                  {artist.user && (
                    <Text style={styles.calloutSubtitle}>@{artist.user.username}</Text>
                  )}
                  <TouchableOpacity 
                    style={styles.calloutButton}
                    onPress={() => handleArtistPress(artist)}
                  >
                    <Text style={styles.calloutButtonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF4081' }]} />
          <Text style={styles.legendText}>Boroughs</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#1db954' }]} />
          <Text style={styles.legendText}>Artists</Text>
        </View>
      </View>
      
      {selectedBorough && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedTitle}>{selectedBorough.name}</Text>
          <Text style={styles.selectedDescription}>{selectedBorough.description}</Text>
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
  header: {
    backgroundColor: '#FF4081',
    padding: 20,
    alignItems: 'center',
    paddingTop: 50,
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
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minWidth: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  calloutSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default MapDiscoveryScreen;
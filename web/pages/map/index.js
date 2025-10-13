import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoroughs } from '../../src/store/boroughSlice';
import { fetchArtists } from '../../src/store/artistSlice';
import Navigation from '../../src/components/Navigation';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapDiscovery = () => {
  const dispatch = useDispatch();
  const { boroughs, loading: boroughsLoading } = useSelector((state) => state.boroughs);
  const { artists, loading: artistsLoading } = useSelector((state) => state.artists);
  const [selectedBorough, setSelectedBorough] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC coordinates
  const [mapZoom, setMapZoom] = useState(11);
  const mapRef = useRef();

  useEffect(() => {
    dispatch(fetchBoroughs());
    dispatch(fetchArtists());
  }, [dispatch]);

  // Generate mock coordinates for boroughs (in a real app, this would come from the API)
  const getBoroughCoordinates = (borough) => {
    const coordinates = {
      1: { lat: 40.7831, lng: -73.9712 }, // Manhattan
      2: { lat: 40.6782, lng: -73.9442 }, // Brooklyn
      3: { lat: 40.7282, lng: -73.7949 }, // Queens
      4: { lat: 40.5795, lng: -74.1502 }, // Staten Island
      5: { lat: 40.8448, lng: -73.8648 }, // The Bronx
    };
    
    return coordinates[borough.id] || {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
    };
  };

  // Generate mock coordinates for artists (in a real app, this would come from the API)
  const getArtistCoordinates = (artist) => {
    // For demo purposes, place artists near their borough
    const boroughCoords = getBoroughCoordinates({ id: artist.borough_id });
    return {
      lat: boroughCoords.lat + (Math.random() - 0.5) * 0.02,
      lng: boroughCoords.lng + (Math.random() - 0.5) * 0.02,
    };
  };

  const handleBoroughSelect = (borough) => {
    setSelectedBorough(borough);
    const coords = getBoroughCoordinates(borough);
    setMapCenter([coords.lat, coords.lng]);
    setMapZoom(13);
  };

  const handleArtistSelect = (artist) => {
    const coords = getArtistCoordinates(artist);
    setMapCenter([coords.lat, coords.lng]);
    setMapZoom(15);
  };

  if (boroughsLoading || artistsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Head>
        <title>NYCMG - Map Discovery</title>
        <meta name="description" content="Discover NYC music on the map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Discover NYC Music on the Map
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Explore artists and venues across NYC boroughs
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          <Box sx={{ height: '600px', position: 'relative' }}>
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Borough Markers */}
              {boroughs.map((borough) => {
                const coords = getBoroughCoordinates(borough);
                const boroughArtists = artists.filter(artist => artist.borough_id === borough.id);
                
                return (
                  <Marker 
                    key={`borough-${borough.id}`} 
                    position={[coords.lat, coords.lng]}
                  >
                    <Popup>
                      <Card sx={{ minWidth: 200 }}>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            {borough.name}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {boroughArtists.length} artists
                          </Typography>
                          <Typography variant="body2">
                            {borough.description}
                          </Typography>
                          <Button 
                            size="small" 
                            onClick={() => handleBoroughSelect(borough)}
                            sx={{ mt: 1 }}
                          >
                            Explore
                          </Button>
                        </CardContent>
                      </Card>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Artist Markers */}
              {artists.map((artist) => {
                const coords = getArtistCoordinates(artist);
                
                return (
                  <Marker 
                    key={`artist-${artist.id}`} 
                    position={[coords.lat, coords.lng]}
                  >
                    <Popup>
                      <Card sx={{ minWidth: 200 }}>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            {artist.artist_name}
                          </Typography>
                          {artist.user && (
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              @{artist.user.username}
                            </Typography>
                          )}
                          <Button 
                            size="small" 
                            onClick={() => handleArtistSelect(artist)}
                            sx={{ mt: 1 }}
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Box>
          
          {selectedBorough && (
            <Box sx={{ mt: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {selectedBorough.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedBorough.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Container>
      </main>

      <footer style={{ backgroundColor: '#333', color: 'white', padding: '2rem 0' }}>
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} NYCMG - NYC Music Growth
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default MapDiscovery;
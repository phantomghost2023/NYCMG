import Head from 'next/head';
import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import Navigation from '../src/components/Navigation';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    displayName: 'NYC Music Fan',
    email: 'user@example.com',
    bio: 'Passionate about discovering new music in NYC.',
    location: 'Brooklyn, NY'
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      newsletter: false
    },
    privacy: {
      profileVisibility: 'public',
      showActivity: true
    },
    audio: {
      quality: 'high',
      offlineMode: false
    }
  });

  const handleProfileChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [field]: value
      }
    });
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', { profile, preferences });
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <Head>
        <title>NYCMG - Settings</title>
        <meta name="description" content="Manage your NYCMG account settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Manage your profile and preferences
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          <Grid container spacing={4}>
            {/* Profile Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={profile.displayName}
                    onChange={(e) => handleProfileChange('displayName', e.target.value)}
                    margin="normal"
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    margin="normal"
                    type="email"
                  />
                  
                  <TextField
                    fullWidth
                    label="Bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                  
                  <TextField
                    fullWidth
                    label="Location"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    margin="normal"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Preference Settings */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.notifications.email}
                        onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                      />
                    }
                    label="Email notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.notifications.push}
                        onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                      />
                    }
                    label="Push notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.notifications.newsletter}
                        onChange={(e) => handlePreferenceChange('notifications', 'newsletter', e.target.checked)}
                      />
                    }
                    label="Newsletter subscription"
                  />
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Profile Visibility</InputLabel>
                    <Select
                      value={preferences.privacy.profileVisibility}
                      label="Profile Visibility"
                      onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="followers">Followers Only</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.privacy.showActivity}
                        onChange={(e) => handlePreferenceChange('privacy', 'showActivity', e.target.checked)}
                      />
                    }
                    label="Show activity on profile"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Audio Preferences
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Audio Quality</InputLabel>
                    <Select
                      value={preferences.audio.quality}
                      label="Audio Quality"
                      onChange={(e) => handlePreferenceChange('audio', 'quality', e.target.value)}
                    >
                      <MenuItem value="low">Low (64 kbps)</MenuItem>
                      <MenuItem value="medium">Medium (128 kbps)</MenuItem>
                      <MenuItem value="high">High (320 kbps)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.audio.offlineMode}
                        onChange={(e) => handlePreferenceChange('audio', 'offlineMode', e.target.checked)}
                      />
                    }
                    label="Offline mode"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="large" onClick={handleSave}>
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
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

export default SettingsPage;
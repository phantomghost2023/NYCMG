import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OfflineService from '../services/OfflineService';
import { logout } from '../store/authSlice';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [offlineMode, setOfflineMode] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState('high');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [equalizer, setEqualizer] = useState('default');
  const [dataSaver, setDataSaver] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const offlineModeStatus = await OfflineService.isOfflineMode();
      setOfflineMode(offlineModeStatus);

      const quality = await OfflineService.getDownloadQuality();
      if (quality) setDownloadQuality(quality);

      const notifications = await OfflineService.getNotificationsEnabled();
      setNotificationsEnabled(notifications);

      const darkModeSetting = await OfflineService.getDarkMode();
      setDarkMode(darkModeSetting);

      // Load additional settings
      const autoPlaySetting = await OfflineService.getAutoPlay();
      setAutoPlay(autoPlaySetting !== false); // default to true

      const equalizerSetting = await OfflineService.getEqualizer();
      if (equalizerSetting) setEqualizer(equalizerSetting);

      const dataSaverSetting = await OfflineService.getDataSaver();
      setDataSaver(dataSaverSetting);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleOfflineMode = async (value) => {
    try {
      await OfflineService.setOfflineMode(value);
      setOfflineMode(value);
      Alert.alert(
        'Offline Mode',
        value 
          ? 'Offline mode enabled. You can now listen to cached music without internet.' 
          : 'Offline mode disabled. You will need internet connection to play music.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling offline mode:', error);
    }
  };

  const updateDownloadQuality = async (quality) => {
    try {
      await OfflineService.setDownloadQuality(quality);
      setDownloadQuality(quality);
    } catch (error) {
      console.error('Error updating download quality:', error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await OfflineService.setNotificationsEnabled(value);
      setNotificationsEnabled(value);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const toggleDarkMode = async (value) => {
    try {
      await OfflineService.setDarkMode(value);
      setDarkMode(value);
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };

  const toggleAutoPlay = async (value) => {
    try {
      await OfflineService.setAutoPlay(value);
      setAutoPlay(value);
    } catch (error) {
      console.error('Error toggling auto play:', error);
    }
  };

  const updateEqualizer = async (preset) => {
    try {
      await OfflineService.setEqualizer(preset);
      setEqualizer(preset);
    } catch (error) {
      console.error('Error updating equalizer:', error);
    }
  };

  const toggleDataSaver = async (value) => {
    try {
      await OfflineService.setDataSaver(value);
      setDataSaver(value);
    } catch (error) {
      console.error('Error toggling data saver:', error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will remove all downloaded music and offline content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await OfflineService.clearAllCache();
              Alert.alert('Cache Cleared', 'All cached data has been removed.', [{ text: 'OK' }]);
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    // In a real app, you would open the actual privacy policy URL
    Linking.openURL('https://example.com/privacy');
  };

  const openTermsOfService = () => {
    // In a real app, you would open the actual terms of service URL
    Linking.openURL('https://example.com/terms');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Logged in as</Text>
          <Text style={styles.settingValue}>{user?.username || 'Guest'}</Text>
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Text style={styles.settingLabel}>Logout</Text>
          <Text style={styles.settingValue}>Sign out of your account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Offline Mode</Text>
          <Switch
            value={offlineMode}
            onValueChange={toggleOfflineMode}
            trackColor={{ false: '#767577', true: '#FF4081' }}
            thumbColor={offlineMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto Play</Text>
          <Switch
            value={autoPlay}
            onValueChange={toggleAutoPlay}
            trackColor={{ false: '#767577', true: '#FF4081' }}
            thumbColor={autoPlay ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Download Quality</Text>
          <View style={styles.qualityOptions}>
            {['low', 'medium', 'high'].map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityButton,
                  downloadQuality === quality && styles.selectedQualityButton,
                ]}
                onPress={() => updateDownloadQuality(quality)}
              >
                <Text
                  style={[
                    styles.qualityButtonText,
                    downloadQuality === quality && styles.selectedQualityButtonText,
                  ]}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Equalizer</Text>
          <View style={styles.qualityOptions}>
            {['default', 'bass', 'treble', 'rock', 'pop', 'jazz'].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.qualityButton,
                  equalizer === preset && styles.selectedQualityButton,
                ]}
                onPress={() => updateEqualizer(preset)}
              >
                <Text
                  style={[
                    styles.qualityButtonText,
                    equalizer === preset && styles.selectedQualityButtonText,
                  ]}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Usage</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Data Saver</Text>
          <Switch
            value={dataSaver}
            onValueChange={toggleDataSaver}
            trackColor={{ false: '#767577', true: '#FF4081' }}
            thumbColor={dataSaver ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#FF4081' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#FF4081' }}
            thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={clearCache}>
          <Text style={styles.settingLabel}>Clear Cache</Text>
          <Text style={styles.settingValue}>Clear all downloaded content</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        
        <TouchableOpacity style={styles.settingItem} onPress={openTermsOfService}>
          <Text style={styles.settingLabel}>Terms of Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={openPrivacyPolicy}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  qualityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  qualityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedQualityButton: {
    backgroundColor: '#FF4081',
  },
  qualityButtonText: {
    color: '#333',
  },
  selectedQualityButtonText: {
    color: 'white',
  },
});

export default SettingsScreen;
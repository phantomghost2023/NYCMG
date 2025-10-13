import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { followArtist, unfollowArtist } from '../store/followSlice';

const FollowButton = ({ artistId, style }) => {
  const dispatch = useDispatch();
  const { following, loading } = useSelector((state) => state.follow);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const isFollowing = following[artistId] || false;
  
  const handlePress = () => {
    if (!isAuthenticated) {
      // In a real app, you would navigate to login screen
      console.log('User needs to login to follow artists');
      return;
    }
    
    if (isFollowing) {
      dispatch(unfollowArtist(artistId));
    } else {
      dispatch(followArtist(artistId));
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFollowing ? styles.followingButton : styles.followButton,
        style,
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    backgroundColor: '#FF4081',
  },
  followingButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FollowButton;
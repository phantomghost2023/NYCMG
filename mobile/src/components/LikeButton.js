import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { likeTrack, unlikeTrack } from '../store/likeSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LikeButton = ({ trackId, showCount = false, style }) => {
  const dispatch = useDispatch();
  const { liked, likesCount, loading } = useSelector((state) => state.like);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const isLiked = liked[trackId] || false;
  const count = likesCount[trackId] || 0;
  
  const handlePress = () => {
    if (!isAuthenticated) {
      // In a real app, you would navigate to login screen
      console.log('User needs to login to like tracks');
      return;
    }
    
    if (isLiked) {
      dispatch(unlikeTrack(trackId));
    } else {
      dispatch(likeTrack(trackId));
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={loading}
    >
      <Icon
        name={isLiked ? 'favorite' : 'favorite-border'}
        size={24}
        color={isLiked ? '#FF4081' : '#666'}
      />
      {showCount && (
        <Text style={[styles.count, isLiked && styles.likedCount]}>
          {count}
        </Text>
      )}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#FF4081"
          style={styles.loadingIndicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  likedCount: {
    color: '#FF4081',
  },
  loadingIndicator: {
    marginLeft: 5,
  },
});

export default LikeButton;
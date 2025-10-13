import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoriteSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoriteButton = ({ trackId, style }) => {
  const dispatch = useDispatch();
  const { favoriteStatus, loading } = useSelector((state) => state.favorite);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const isFavorited = favoriteStatus[trackId] || false;
  
  const handlePress = () => {
    if (!isAuthenticated) {
      // In a real app, you would navigate to login screen
      console.log('User needs to login to add favorites');
      return;
    }
    
    if (isFavorited) {
      dispatch(removeFavorite(trackId));
    } else {
      dispatch(addFavorite(trackId));
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FF4081" />
      ) : (
        <Icon
          name={isFavorited ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorited ? '#FF4081' : '#666'}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});

export default FavoriteButton;
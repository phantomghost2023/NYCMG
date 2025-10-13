import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import FollowButton from './FollowButton';
import LikeButton from './LikeButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SocialInteractionBar = ({ 
  artistId, 
  trackId, 
  showFollow = true, 
  showLike = true, 
  showShare = true,
  onSharePress,
  style 
}) => {
  const { followersCount } = useSelector((state) => state.follow);
  const { likesCount } = useSelector((state) => state.like);
  
  const followers = followersCount[artistId] || 0;
  const likes = likesCount[trackId] || 0;

  return (
    <View style={[styles.container, style]}>
      {showFollow && artistId && (
        <View style={styles.interactionItem}>
          <FollowButton artistId={artistId} />
          <Text style={styles.countText}>{followers} followers</Text>
        </View>
      )}
      
      {showLike && trackId && (
        <View style={styles.interactionItem}>
          <LikeButton trackId={trackId} />
          <Text style={styles.countText}>{likes} likes</Text>
        </View>
      )}
      
      {showShare && (
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={onSharePress}
        >
          <Icon name="share" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  countText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    padding: 5,
  },
});

export default SocialInteractionBar;
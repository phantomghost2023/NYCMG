import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import boroughReducer from './boroughSlice';
import artistReducer from './artistSlice';
import trackReducer from './trackSlice';
import albumReducer from './albumSlice';
import genreReducer from './genreSlice';
import notificationReducer from './notificationSlice';
import followReducer from './followSlice';
import commentReducer from './commentSlice';
import likeReducer from './likeSlice';
import shareReducer from './shareSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boroughs: boroughReducer,
    artists: artistReducer,
    tracks: trackReducer,
    albums: albumReducer,
    genres: genreReducer,
    notifications: notificationReducer,
    follows: followReducer,
    comments: commentReducer,
    likes: likeReducer,
    shares: shareReducer,
  },
});
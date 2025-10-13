import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import boroughReducer from './boroughSlice';
import artistReducer from './artistSlice';
import followReducer from './followSlice';
import likeReducer from './likeSlice';
import commentReducer from './commentSlice';
import playlistReducer from './playlistSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boroughs: boroughReducer,
    artists: artistReducer,
    follow: followReducer,
    like: likeReducer,
    comment: commentReducer,
    playlist: playlistReducer,
    favorite: favoriteReducer,
  },
});
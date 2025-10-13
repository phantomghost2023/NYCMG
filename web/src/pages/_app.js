import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect } from 'react';
import { loadUserFromStorage } from '../store/authSlice';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Load user from storage on app start
    store.dispatch(loadUserFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
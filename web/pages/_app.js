import '../src/styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useEffect } from 'react';
import { loadUserFromStorage } from '../src/store/authSlice';

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
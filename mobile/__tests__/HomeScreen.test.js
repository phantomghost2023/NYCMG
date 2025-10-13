import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HomeScreen from '../src/screens/HomeScreen';

const mockStore = configureStore([]);

describe('HomeScreen', () => {
  let store;
  
  const mockBoroughs = [
    { id: '1', name: 'Manhattan', description: 'The heart of NYC' },
    { id: '2', name: 'Brooklyn', description: 'The borough of hipsters' },
    { id: '3', name: 'Queens', description: 'The most diverse borough' }
  ];

  beforeEach(() => {
    store = mockStore({
      boroughs: {
        boroughs: mockBoroughs,
        loading: false,
        error: null
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    expect(getByText('NYCMG')).toBeTruthy();
    expect(getByText('Discover NYC Music')).toBeTruthy();
    expect(getByText('Explore by Borough')).toBeTruthy();
  });

  it('displays boroughs correctly', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that boroughs are displayed
    expect(getByText('Manhattan')).toBeTruthy();
    expect(getByText('Brooklyn')).toBeTruthy();
    expect(getByText('Queens')).toBeTruthy();
    
    // Check that descriptions are displayed
    expect(getByText('The heart of NYC')).toBeTruthy();
    expect(getByText('The borough of hipsters')).toBeTruthy();
    expect(getByText('The most diverse borough')).toBeTruthy();
  });

  it('dispatches fetchBoroughs on mount', () => {
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that dispatch was called with fetchBoroughs action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('boroughs/fetchBoroughs')
      })
    );
  });

  it('navigates to Explore screen when borough is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Press on Manhattan borough
    const manhattanCard = getByText('Manhattan');
    fireEvent.press(manhattanCard);
    
    // Check that navigation was called with correct parameters
    expect(navigation.navigate).toHaveBeenCalledWith('Explore', {
      boroughId: '1',
      boroughName: 'Manhattan'
    });
  });

  it('shows loading indicator when loading', () => {
    const loadingStore = mockStore({
      boroughs: {
        boroughs: [],
        loading: true,
        error: null
      }
    });
    
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={loadingStore}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that loading indicator is displayed
    expect(getByText('Loading boroughs...')).toBeTruthy();
  });

  it('shows error message when there is an error', () => {
    const errorStore = mockStore({
      boroughs: {
        boroughs: [],
        loading: false,
        error: 'Failed to load boroughs'
      }
    });
    
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that error message is displayed
    expect(getByText('Error: Failed to load boroughs')).toBeTruthy();
  });

  it('dispatches fetchBoroughs when retry button is pressed', () => {
    const errorStore = mockStore({
      boroughs: {
        boroughs: [],
        loading: false,
        error: 'Failed to load boroughs'
      }
    });
    
    errorStore.dispatch = jest.fn();
    
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <HomeScreen navigation={navigation} />
      </Provider>
    );
    
    // Press retry button
    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);
    
    // Check that dispatch was called with fetchBoroughs action
    expect(errorStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('boroughs/fetchBoroughs')
      })
    );
  });
});
import { measureRenders } from 'reassure';
import React from 'react';
import SettingsScreen from './SettingsScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {},
};

// Mock user data
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
};

describe('SettingsScreen', () => {
  it('renders correctly with user data', async () => {
    await measureRenders(
      <SettingsScreen 
        navigation={mockNavigation}
        route={mockRoute}
        user={mockUser}
        loading={false}
        error={null}
      />
    );
  });

  it('renders correctly while loading', async () => {
    await measureRenders(
      <SettingsScreen 
        navigation={mockNavigation}
        route={mockRoute}
        user={null}
        loading={true}
        error={null}
      />
    );
  });
});
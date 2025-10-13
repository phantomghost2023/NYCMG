describe('Navigation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to all main tabs', async () => {
    // Login first (assuming we have a way to skip login for tests)
    // await element(by.id('skipLoginButton')).tap();
    
    // Navigate to Explore tab
    await element(by.id('exploreTab')).tap();
    await expect(element(by.id('exploreScreen'))).toBeVisible();
    
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    await expect(element(by.id('mapScreen'))).toBeVisible();
    
    // Navigate to Library tab
    await element(by.id('libraryTab')).tap();
    await expect(element(by.id('libraryScreen')).atIndex(0)).toBeVisible();
    
    // Navigate to Profile tab
    await element(by.id('profileTab')).tap();
    await expect(element(by.id('profileScreen'))).toBeVisible();
    
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    await expect(element(by.id('settingsScreen'))).toBeVisible();
  });

  it('should navigate to artist profile', async () => {
    // Go to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist in the list
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Expect to be on artist profile screen
    await expect(element(by.id('artistProfileScreen'))).toBeVisible();
  });

  it('should navigate to playlist detail', async () => {
    // Go to Library screen
    await element(by.id('libraryTab')).tap();
    
    // Switch to Playlists tab
    await element(by.id('playlistsTab')).tap();
    
    // Tap on first playlist
    await element(by.id('playlistItem')).atIndex(0).tap();
    
    // Expect to be on playlist detail screen
    await expect(element(by.id('playlistDetailScreen'))).toBeVisible();
  });
});
describe('Library Management', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a new playlist', async () => {
    // Navigate to Library screen
    await element(by.id('libraryTab')).tap();
    
    // Switch to Playlists tab
    await element(by.id('playlistsTab')).tap();
    
    // Tap create playlist button
    await element(by.id('createPlaylistButton')).tap();
    
    // Enter playlist name
    await element(by.id('playlistNameInput')).typeText('My Test Playlist');
    
    // Tap create button
    await element(by.id('confirmCreateButton')).tap();
    
    // Expect new playlist to appear in list
    await expect(element(by.text('My Test Playlist'))).toBeVisible();
  });

  it('should add track to playlist', async () => {
    // Navigate to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Tap on first track menu button
    await element(by.id('trackMenuButton')).atIndex(0).tap();
    
    // Tap "Add to Playlist" option
    await element(by.id('addToPlaylistOption')).tap();
    
    // Select first playlist
    await element(by.id('playlistItem')).atIndex(0).tap();
    
    // Expect success message
    await expect(element(by.id('successMessage'))).toBeVisible();
  });

  it('should remove track from playlist', async () => {
    // Navigate to Library screen
    await element(by.id('libraryTab')).tap();
    
    // Switch to Playlists tab
    await element(by.id('playlistsTab')).tap();
    
    // Tap on first playlist
    await element(by.id('playlistItem')).atIndex(0).tap();
    
    // Tap on first track's remove button
    await element(by.id('removeTrackButton')).atIndex(0).tap();
    
    // Confirm removal
    await element(by.id('confirmRemoveButton')).tap();
    
    // Expect track to be removed
    await expect(element(by.id('emptyPlaylistMessage'))).toBeVisible();
  });

  it('should delete a playlist', async () => {
    // Navigate to Library screen
    await element(by.id('libraryTab')).tap();
    
    // Switch to Playlists tab
    await element(by.id('playlistsTab')).tap();
    
    // Long press on first playlist
    await element(by.id('playlistItem')).atIndex(0).longPress();
    
    // Tap delete option
    await element(by.id('deletePlaylistOption')).tap();
    
    // Confirm deletion
    await element(by.id('confirmDeleteButton')).tap();
    
    // Expect playlist to be removed from list
    await expect(element(by.text('My Test Playlist'))).not.toBeVisible();
  });
});
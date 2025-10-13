describe('Social Features', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should follow an artist', async () => {
    // Navigate to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Tap follow button
    await element(by.id('followButton')).tap();
    
    // Expect button text to change to "Following"
    await expect(element(by.text('Following'))).toBeVisible();
  });

  it('should like a track', async () => {
    // Navigate to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Tap on first track
    await element(by.id('trackItem')).atIndex(0).tap();
    
    // Tap like button
    await element(by.id('likeButton')).tap();
    
    // Expect like count to increase
    await expect(element(by.id('likeCount'))).toHaveText('1');
  });

  it('should add a comment', async () => {
    // Navigate to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Tap on first track
    await element(by.id('trackItem')).atIndex(0).tap();
    
    // Type comment
    await element(by.id('commentInput')).typeText('This is a great track!');
    
    // Tap send button
    await element(by.id('sendCommentButton')).tap();
    
    // Expect comment to appear in list
    await expect(element(by.text('This is a great track!'))).toBeVisible();
  });

  it('should add track to favorites', async () => {
    // Navigate to Explore screen
    await element(by.id('exploreTab')).tap();
    
    // Tap on first artist
    await element(by.id('artistItem')).atIndex(0).tap();
    
    // Tap on first track
    await element(by.id('trackItem')).atIndex(0).tap();
    
    // Tap favorite button
    await element(by.id('favoriteButton')).tap();
    
    // Navigate to Library and Favorites tab
    await element(by.id('libraryTab')).tap();
    await element(by.id('favoritesTab')).tap();
    
    // Expect track to appear in favorites
    await expect(element(by.id('favoriteTrackItem'))).toBeVisible();
  });
});
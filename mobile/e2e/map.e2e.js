describe('Map Discovery', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show map screen', async () => {
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    
    // Expect map to be visible
    await expect(element(by.id('mapView'))).toBeVisible();
  });

  it('should show borough markers', async () => {
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    
    // Expect borough markers to be visible
    await expect(element(by.id('boroughMarker'))).toBeVisible();
  });

  it('should show artist markers', async () => {
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    
    // Expect artist markers to be visible
    await expect(element(by.id('artistMarker'))).toBeVisible();
  });

  it('should tap on borough marker and navigate to explore', async () => {
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    
    // Tap on first borough marker
    await element(by.id('boroughMarker')).atIndex(0).tap();
    
    // Tap on callout explore button
    await element(by.id('exploreBoroughButton')).tap();
    
    // Expect to be on explore screen
    await expect(element(by.id('exploreScreen'))).toBeVisible();
  });

  it('should tap on artist marker and navigate to profile', async () => {
    // Navigate to Map tab
    await element(by.id('mapTab')).tap();
    
    // Tap on first artist marker
    await element(by.id('artistMarker')).atIndex(0).tap();
    
    // Tap on callout profile button
    await element(by.id('viewProfileButton')).tap();
    
    // Expect to be on artist profile screen
    await expect(element(by.id('artistProfileScreen'))).toBeVisible();
  });
});
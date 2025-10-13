describe('Settings and Preferences', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should toggle offline mode', async () => {
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    
    // Find offline mode switch
    const offlineSwitch = element(by.id('offlineModeSwitch'));
    
    // Toggle switch on
    await offlineSwitch.tap();
    
    // Expect switch to be on
    await expect(offlineSwitch).toHaveToggleValue(true);
    
    // Toggle switch off
    await offlineSwitch.tap();
    
    // Expect switch to be off
    await expect(offlineSwitch).toHaveToggleValue(false);
  });

  it('should change download quality', async () => {
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    
    // Tap on download quality section
    await element(by.id('downloadQualitySection')).tap();
    
    // Select medium quality
    await element(by.id('mediumQualityButton')).tap();
    
    // Expect medium quality to be selected
    await expect(element(by.id('mediumQualityButton'))).toHaveStyle({ backgroundColor: '#FF4081' });
  });

  it('should toggle notifications', async () => {
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    
    // Find notifications switch
    const notificationsSwitch = element(by.id('notificationsSwitch'));
    
    // Toggle switch off
    await notificationsSwitch.tap();
    
    // Expect switch to be off
    await expect(notificationsSwitch).toHaveToggleValue(false);
    
    // Toggle switch on
    await notificationsSwitch.tap();
    
    // Expect switch to be on
    await expect(notificationsSwitch).toHaveToggleValue(true);
  });

  it('should toggle dark mode', async () => {
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    
    // Find dark mode switch
    const darkModeSwitch = element(by.id('darkModeSwitch'));
    
    // Toggle switch on
    await darkModeSwitch.tap();
    
    // Expect switch to be on
    await expect(darkModeSwitch).toHaveToggleValue(true);
    
    // Toggle switch off
    await darkModeSwitch.tap();
    
    // Expect switch to be off
    await expect(darkModeSwitch).toHaveToggleValue(false);
  });

  it('should clear cache', async () => {
    // Navigate to Settings tab
    await element(by.id('settingsTab')).tap();
    
    // Scroll to storage section
    await element(by.id('settingsScrollView')).scrollTo('bottom');
    
    // Tap clear cache button
    await element(by.id('clearCacheButton')).tap();
    
    // Confirm in alert
    await element(by.text('Clear')).tap();
    
    // Expect success message
    await expect(element(by.text('Cache Cleared'))).toBeVisible();
  });
});
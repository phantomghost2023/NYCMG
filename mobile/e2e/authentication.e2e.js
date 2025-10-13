describe('Authentication', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should show login screen after tap', async () => {
    await element(by.id('loginButton')).tap();
    await expect(element(by.id('loginScreen'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('loginButton')).tap();
    
    // Enter invalid credentials
    await element(by.id('emailInput')).typeText('invalid@example.com');
    await element(by.id('passwordInput')).typeText('wrongpassword');
    
    // Tap login button
    await element(by.id('submitLoginButton')).tap();
    
    // Expect error message
    await expect(element(by.id('loginError'))).toBeVisible();
  });

  it('should login with valid credentials', async () => {
    await element(by.id('loginButton')).tap();
    
    // Enter valid credentials (these would be test credentials)
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    
    // Tap login button
    await element(by.id('submitLoginButton')).tap();
    
    // Expect to be on home screen
    await expect(element(by.id('homeScreen'))).toBeVisible();
  });
});
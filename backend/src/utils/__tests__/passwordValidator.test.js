const validatePassword = require('../passwordValidator');

describe('Password Validator', () => {
  it('should validate a strong password', () => {
    const result = validatePassword('MyStr0ngP@ssw0rd!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject password that is too short', () => {
    const result = validatePassword('Pass1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should reject password without uppercase letter', () => {
    const result = validatePassword('mypassword123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should reject password without lowercase letter', () => {
    const result = validatePassword('MYPASSWORD123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should reject password without number', () => {
    const result = validatePassword('MyPassword!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should reject password without special character', () => {
    const result = validatePassword('MyPassword123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should reject password with common words', () => {
    const result = validatePassword('Welcome123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password contains common words that are easy to guess');
  });

  it('should handle multiple validation errors', () => {
    const result = validatePassword('pass');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(4);
  });
});
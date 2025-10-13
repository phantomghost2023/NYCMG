// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models');
jest.mock('../../utils/passwordValidator');
jest.mock('../cache.service');

// Mock the associations to prevent errors
jest.mock('../../models/associations', () => ({
  setupAssociations: jest.fn()
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const validatePassword = require('../../utils/passwordValidator');
const { 
  getCachedUserProfile, 
  setCachedUserProfile, 
  clearUserProfileCache 
} = require('../cache.service');
const { 
  registerUser, 
  loginUser, 
  refreshUserToken, 
  getProfile, 
  updateProfile 
} = require('../auth.service');

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'MyStr0ngP@ssw0rd!'
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        password_hash: 'hashedpassword'
      };

      // Mock password validation
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      // Mock bcrypt hash
      bcrypt.hash.mockResolvedValue('hashedpassword');

      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);

      // Mock User.create
      User.create.mockResolvedValue(mockUser);

      // Mock jwt.sign
      jwt.sign.mockReturnValue('jwt-token');

      const result = await registerUser(userData);

      expect(validatePassword).toHaveBeenCalledWith(userData.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.findOne).toHaveBeenCalledWith({
        attributes: ['id', 'email', 'username'],
        where: {
          [require('sequelize').Op.or]: [
            { email: userData.email },
            { username: userData.username }
          ]
        },
        logging: false
      });
      expect(User.create).toHaveBeenCalledWith({
        email: userData.email,
        username: userData.username,
        password_hash: 'hashedpassword'
      }, {
        logging: false
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role
        },
        token: 'jwt-token'
      });
    });

    it('should throw an error if password validation fails', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'weakpassword'
      };

      // Mock password validation to fail
      validatePassword.mockReturnValue({ 
        isValid: false, 
        errors: ['Password must contain at least one uppercase letter'] 
      });

      await expect(registerUser(userData)).rejects.toThrow(
        'Failed to register user: Password validation failed: Password must contain at least one uppercase letter'
      );
    });

    it('should throw an error if email is already registered', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'MyStr0ngP@ssw0rd!'
      };

      const existingUser = {
        id: '2',
        email: 'test@example.com',
        username: 'existinguser'
      };

      // Mock password validation
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue(existingUser);

      await expect(registerUser(userData)).rejects.toThrow(
        'Failed to register user: Email already registered'
      );
    });

    it('should throw an error if username is already taken', async () => {
      const userData = {
        email: 'new@example.com',
        username: 'testuser',
        password: 'MyStr0ngP@ssw0rd!'
      };

      const existingUser = {
        id: '2',
        email: 'existing@example.com',
        username: 'testuser'
      };

      // Mock password validation
      validatePassword.mockReturnValue({ isValid: true, errors: [] });

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue(existingUser);

      await expect(registerUser(userData)).rejects.toThrow(
        'Failed to register user: Username already taken'
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'MyStr0ngP@ssw0rd!'
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        password_hash: 'hashedpassword'
      };

      // Mock User.findOne
      User.findOne.mockResolvedValue(mockUser);

      // Mock bcrypt.compare
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign
      jwt.sign.mockReturnValue('jwt-token');

      const result = await loginUser(credentials);

      expect(User.findOne).toHaveBeenCalledWith({
        attributes: ['id', 'email', 'username', 'role', 'password_hash'],
        where: { email: credentials.email },
        logging: false
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password_hash);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role
        },
        token: 'jwt-token'
      });
    });

    it('should throw an error if user is not found', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'MyStr0ngP@ssw0rd!'
      };

      // Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      await expect(loginUser(credentials)).rejects.toThrow(
        'Failed to login user: Invalid credentials'
      );
    });

    it('should throw an error if password is invalid', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        password_hash: 'hashedpassword'
      };

      // Mock User.findOne
      User.findOne.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginUser(credentials)).rejects.toThrow(
        'Failed to login user: Invalid credentials'
      );
    });
  });

  describe('refreshUserToken', () => {
    it('should refresh user token successfully', async () => {
      const userData = {
        userId: '1',
        email: 'test@example.com'
      };

      // Mock jwt.sign
      jwt.sign.mockReturnValue('new-jwt-token');

      const result = await refreshUserToken(userData);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: userData.userId, email: userData.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(result).toEqual({ token: 'new-jwt-token' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile from cache', async () => {
      const userId = '1';
      const cachedProfile = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        }
      };

      // Mock getCachedUserProfile to return cached profile
      getCachedUserProfile.mockReturnValue(cachedProfile);

      const result = await getProfile(userId);

      expect(getCachedUserProfile).toHaveBeenCalledWith(userId);
      expect(result).toEqual(cachedProfile);
    });

    it('should fetch user profile from database if not in cache', async () => {
      const userId = '1';
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      };

      const expectedProfile = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role
        }
      };

      // Mock getCachedUserProfile to return null
      getCachedUserProfile.mockReturnValue(null);

      // Mock User.findByPk
      User.findByPk.mockResolvedValue(mockUser);

      // Mock setCachedUserProfile
      setCachedUserProfile.mockReturnValue();

      const result = await getProfile(userId);

      expect(getCachedUserProfile).toHaveBeenCalledWith(userId);
      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        attributes: ['id', 'email', 'username', 'role', 'created_at', 'updated_at'],
        logging: false
      });
      expect(setCachedUserProfile).toHaveBeenCalledWith(userId, expectedProfile);
      expect(result).toEqual(expectedProfile);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'nonexistent';

      // Mock getCachedUserProfile to return null
      getCachedUserProfile.mockReturnValue(null);

      // Mock User.findByPk to return null
      User.findByPk.mockResolvedValue(null);

      await expect(getProfile(userId)).rejects.toThrow(
        'Failed to fetch profile: User not found'
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = '1';
      const updateData = { username: 'newusername' };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        update: jest.fn().mockResolvedValue({
          id: '1',
          email: 'test@example.com',
          username: 'newusername',
          role: 'user'
        })
      };

      const expectedProfile = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'newusername',
          role: 'user'
        }
      };

      // Mock User.findByPk
      User.findByPk.mockResolvedValue(mockUser);

      // Mock User.findOne to return null (username not taken)
      User.findOne.mockResolvedValue(null);

      // Mock clearUserProfileCache
      clearUserProfileCache.mockReturnValue();

      const result = await updateProfile(userId, updateData);

      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        attributes: ['id', 'email', 'username', 'role'],
        logging: false
      });
      expect(User.findOne).toHaveBeenCalledWith({
        attributes: ['id'],
        where: { username: updateData.username },
        logging: false
      });
      expect(mockUser.update).toHaveBeenCalledWith(updateData, { logging: false });
      expect(clearUserProfileCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedProfile);
    });

    it('should throw an error if username is already taken', async () => {
      const userId = '1';
      const updateData = { username: 'takenusername' };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user'
      };

      const existingUser = {
        id: '2',
        username: 'takenusername'
      };

      // Mock User.findByPk
      User.findByPk.mockResolvedValue(mockUser);

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue(existingUser);

      await expect(updateProfile(userId, updateData)).rejects.toThrow(
        'Failed to update profile: Username already taken'
      );
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'nonexistent';
      const updateData = { username: 'newusername' };

      // Mock User.findByPk to return null
      User.findByPk.mockResolvedValue(null);

      await expect(updateProfile(userId, updateData)).rejects.toThrow(
        'Failed to update profile: User not found'
      );
    });
  });
});
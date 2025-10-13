const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const validatePassword = require('../utils/passwordValidator');
const { 
  getCachedUserProfile, 
  setCachedUserProfile, 
  clearUserProfileCache 
} = require('./cache.service');

const registerUser = async (userData) => {
  try {
    const { email, username, password } = userData;
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Check if user already exists with optimized query
    const existingUser = await User.findOne({
      attributes: ['id', 'email', 'username'], // Only necessary fields
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      },
      logging: false // Disable logging in production for better performance
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
      if (existingUser.username === username) {
        throw new Error('Username already taken');
      }
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create({
      email,
      username,
      password_hash: hashedPassword
    }, {
      logging: false // Disable logging in production for better performance
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    };
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
};

const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Find user by email with optimized query
    const user = await User.findOne({ 
      attributes: ['id', 'email', 'username', 'role', 'password_hash'], // Only necessary fields
      where: { email },
      logging: false // Disable logging in production for better performance
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    };
  } catch (error) {
    throw new Error(`Failed to login user: ${error.message}`);
  }
};

const refreshUserToken = async (userData) => {
  try {
    const { userId, email } = userData;
    
    // Generate new JWT token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { token };
  } catch (error) {
    throw new Error(`Failed to refresh token: ${error.message}`);
  }
};

const getProfile = async (userId) => {
  try {
    // Check cache first
    let cachedProfile = getCachedUserProfile(userId);
    if (cachedProfile) {
      return cachedProfile;
    }
    
    // Optimized query with specific attributes
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'username', 'role', 'created_at', 'updated_at'], // Only necessary fields
      logging: false // Disable logging in production for better performance
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const profile = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
    
    // Cache the result
    setCachedUserProfile(userId, profile);
    
    return profile;
  } catch (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
};

const updateProfile = async (userId, updateData) => {
  try {
    // Optimized query with specific attributes
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'username', 'role'], // Only necessary fields
      logging: false // Disable logging in production for better performance
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if username is being updated and if it's already taken
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({
        attributes: ['id'], // Only necessary fields
        where: { username: updateData.username },
        logging: false // Disable logging in production for better performance
      });
      
      if (existingUser) {
        throw new Error('Username already taken');
      }
    }
    
    // Update user
    const updatedUser = await user.update(updateData, {
      logging: false // Disable logging in production for better performance
    });
    
    const profile = {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role
      }
    };
    
    // Clear user profile cache
    clearUserProfileCache(userId);
    
    return profile;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  getProfile,
  updateProfile
};
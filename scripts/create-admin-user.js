#!/usr/bin/env node

/**
 * NYCMG Admin User Creation Script
 * 
 * This script creates an admin user for development purposes.
 */

const { User } = require('../backend/src/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../backend/.env' });

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);
      
      // Generate a new token for the existing admin
      const token = jwt.sign(
        { userId: existingAdmin.id, email: existingAdmin.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      
      console.log(`\nJWT Token for admin: ${token}`);
      return;
    }
    
    // Create admin user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('AdminPass123!', saltRounds);
    
    const adminUser = await User.create({
      email: 'admin@example.com',
      username: 'admin',
      password_hash: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created successfully:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Username: ${adminUser.username}`);
    console.log(`Role: ${adminUser.role}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser.id, email: adminUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    console.log(`\nJWT Token for admin: ${token}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
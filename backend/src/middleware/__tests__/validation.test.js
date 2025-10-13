const request = require('supertest');
const express = require('express');
const { validate, registerSchema } = require('../validation.middleware');

describe('Validation Middleware', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Create a test route that uses validation middleware
    app.post('/test', validate(registerSchema), (req, res) => {
      res.status(200).json({ message: 'Validation passed' });
    });
  });

  it('should pass validation for valid data', async () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/test')
      .send(validData)
      .expect(200);

    expect(response.body.message).toBe('Validation passed');
  });

  it('should fail validation for invalid email', async () => {
    const invalidData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/test')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toContain('email');
  });

  it('should fail validation for short password', async () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass'
    };

    const response = await request(app)
      .post('/test')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toContain('password');
  });

  it('should fail validation for short username', async () => {
    const invalidData = {
      username: 'tu',
      email: 'test@example.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/test')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toContain('username');
  });
});
# NYCMG Testing Guide

This document provides instructions on how to run tests for all parts of the NYCMG application.

## Overview

The NYCMG application has comprehensive test coverage across three main components:
1. **Backend API** - Server-side logic and database interactions
2. **Web Frontend** - React/Next.js web application
3. **Mobile App** - React Native mobile application

## Prerequisites

Before running tests, ensure you have:
- Node.js installed
- All dependencies installed (`npm install` in each project directory)
- Database services running (for backend tests)

## Running Tests

### Option 1: Run All Tests (Recommended)

From the root directory, run:

```bash
node scripts/run-all-tests.js
```

This script will automatically run tests for all three components and provide a summary.

### Option 2: Run Tests for Individual Components

#### Backend Tests

```bash
cd backend
npm test
```

#### Web Frontend Tests

```bash
cd web
npm test
```

#### Mobile App Tests

```bash
cd mobile
npm test
```

## Test Structure

### Backend
- Location: `backend/src/**/*.test.js`
- Framework: Jest with Supertest
- Coverage: API endpoints, services, models, and utilities

### Web Frontend
- Location: `web/src/components/__tests__/*.test.js`
- Framework: Jest with React Testing Library
- Coverage: All React components, hooks, and utilities

### Mobile App
- Location: `mobile/__tests__/*.test.js`
- Framework: Jest with React Native Testing Library
- Coverage: Screen components and Redux slices

## Continuous Integration

The project is configured to run all tests automatically on:
- Every pull request
- Every merge to main branch
- Scheduled weekly runs

## Adding New Tests

When adding new features:
1. Create test files following the existing naming convention (`*.test.js`)
2. Place tests in the appropriate directory structure
3. Follow the existing testing patterns
4. Ensure tests cover both positive and negative cases
5. Run all tests to verify nothing is broken

## Troubleshooting

### Common Issues

1. **Dependency Issues**
   - Run `npm install` in the affected project directory
   - Clear npm cache: `npm cache clean --force`

2. **Database Connection Errors** (Backend)
   - Ensure PostgreSQL is running
   - Check `.env` configuration

3. **Module Not Found Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install`

### Test Environment

All tests are designed to run in isolated environments:
- Backend tests use an in-memory SQLite database
- Frontend tests use Jest's JSDOM environment
- Mobile tests use React Native Testing Library

## Code Coverage

The project maintains high code coverage:
- Backend: >90%
- Web Frontend: >85%
- Mobile App: >80%

Run `npm test -- --coverage` in each project directory to view detailed coverage reports.
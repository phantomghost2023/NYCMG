# CI/CD Setup Guide

This document explains how to set up and use the Continuous Integration/Continuous Deployment pipeline for the NYCMG application.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and includes the following jobs:

1. **Backend Testing** - Runs tests for the backend API
2. **Web Frontend Testing** - Runs tests for the web application
3. **Mobile App Testing** - Runs tests for the mobile application
4. **Dependency Check** - Validates dependency consistency across packages
5. **Test Structure Validation** - Ensures all test files are present
6. **Code Coverage Report** - Generates and uploads code coverage reports

## GitHub Actions Workflow

The workflow is defined in `.github/workflows/ci.yml` and is triggered on:
- Pushes to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

### Jobs

#### Backend Testing
- Runs on Ubuntu with Node.js 18.x and 20.x
- Installs dependencies using `npm ci`
- Runs backend tests with `npm test`
- Runs ESLint with `npm run lint`

#### Web Frontend Testing
- Runs on Ubuntu with Node.js 18.x and 20.x
- Installs dependencies using `npm ci`
- Runs web tests with `npm test`
- Runs ESLint with `npm run lint`

#### Mobile App Testing
- Runs on Ubuntu with Node.js 18.x and 20.x
- Installs dependencies using `npm ci`
- Runs mobile tests with `npm test`
- Runs ESLint with `npm run lint`

#### Dependency Check
- Runs on Ubuntu with Node.js 18.x
- Validates dependency consistency using `check_installation.js`

#### Test Structure Validation
- Runs on Ubuntu with Node.js 18.x
- Ensures all test files are present using `scripts/validate-test-structure.js`

#### Code Coverage Report
- Runs after all test jobs complete successfully
- Generates combined coverage reports
- Uploads to Codecov (requires `CODECOV_TOKEN` secret)

## Setting Up CI/CD

### Prerequisites

1. Fork or clone the repository to GitHub
2. Enable GitHub Actions in repository settings
3. (Optional) Set up Codecov for coverage reporting

### Required Secrets

To enable full functionality, set the following secrets in your GitHub repository:

1. `CODECOV_TOKEN` - For uploading coverage reports to Codecov

To set secrets:
1. Go to Repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the required secrets

## Customizing the Pipeline

### Adding New Jobs

To add new jobs to the pipeline:

1. Edit `.github/workflows/ci.yml`
2. Add a new job under the `jobs` section
3. Define the steps for the job
4. Set appropriate dependencies using `needs`

### Modifying Existing Jobs

To modify existing jobs:

1. Edit `.github/workflows/ci.yml`
2. Find the job you want to modify
3. Make the necessary changes to steps or configuration

### Environment Variables

To add environment variables:

```yaml
env:
  NODE_ENV: test
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoring CI/CD

### GitHub Actions Dashboard

View pipeline status and logs:
1. Go to the "Actions" tab in your GitHub repository
2. Click on a workflow run to view details
3. Expand job steps to see logs

### Test Results

Test results are displayed directly in the GitHub Actions interface:
- Passing tests show a green checkmark
- Failing tests show a red X with error details
- Test duration and coverage information is displayed

## Troubleshooting

### Common Issues

1. **Dependency Installation Failures**
   - Ensure `package-lock.json` is committed
   - Run `npm ci` locally to verify lock file consistency

2. **Test Failures**
   - Check the job logs for specific error messages
   - Run tests locally with the same Node.js version

3. **Linting Errors**
   - Run `npm run lint` locally to identify issues
   - Check ESLint configuration files

4. **Missing Secrets**
   - Verify all required secrets are set in repository settings
   - Check that secret names match those used in the workflow

### Debugging Tips

1. **Enable Step Debug Logging**
   ```yaml
   env:
     ACTIONS_STEP_DEBUG: true
   ```

2. **Add Debug Steps**
   ```yaml
   - name: Debug information
     run: |
       node --version
       npm --version
       ls -la
   ```

## Best Practices

1. **Keep Workflows Fast**
   - Use caching for dependencies
   - Run only necessary tests for each change
   - Parallelize independent jobs

2. **Use Matrix Strategies**
   - Test against multiple Node.js versions
   - Test on different operating systems when needed

3. **Fail Fast**
   - Configure jobs to fail quickly on errors
   - Use appropriate exit codes in scripts

4. **Secure Secrets**
   - Never commit secrets to the repository
   - Use GitHub Secrets for sensitive information

5. **Monitor Coverage**
   - Set coverage thresholds to prevent regression
   - Regularly review coverage reports

## Extending the Pipeline

### Adding Deployment

To add deployment to the pipeline:

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: [backend-test, web-test, mobile-test]
  steps:
    - name: Deploy to production
      run: |
        # Add deployment commands here
```

### Adding Security Scanning

To add security scanning:

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Run security audit
      run: npm audit
```

### Adding Performance Testing

To add performance testing:

```yaml
performance-test:
  runs-on: ubuntu-latest
  steps:
    - name: Run performance tests
      run: npm run test:performance
```
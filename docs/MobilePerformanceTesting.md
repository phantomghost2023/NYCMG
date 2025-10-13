# Mobile App Performance Testing

This document describes the performance testing implementation for the NYCMG mobile application using Reassure.

## Overview

Performance testing is crucial for ensuring that the mobile application maintains smooth user experiences, especially as new features are added. We use Reassure, a performance testing companion for React and React Native apps, to automate performance regression testing.

## Performance Testing Setup

### Tools Used

1. **Reassure** - Performance testing framework for React and React Native
2. **Jest** - Testing framework (already in use)
3. **React Native Testing Library** - Component testing utilities (already in use)

### Installation

Reassure was installed as a development dependency:

```bash
npm install --save-dev reassure
```

### Initialization

Reassure was initialized using:

```bash
npx reassure init
```

This created the following files:
- `reassure-tests.sh` - CI script for running performance tests
- `dangerfile.js` - Integration with Danger.js for CI reporting
- Updated `.gitignore` to exclude performance test results

## Performance Tests Created

Performance tests have been created for the following key components and screens:

### Components
1. **AudioPlayer** - Critical for playback performance
2. **SocialInteractionBar** - Frequently used social features
3. **Playlist** - Playlist display and management

### Screens
1. **HomeScreen** - Main entry point with track listings
2. **LibraryScreen** - User's library with playlists
3. **MapDiscoveryScreen** - Map-based discovery feature
4. **SettingsScreen** - User preferences and settings

## Running Performance Tests

### Local Testing

To run performance tests locally:

```bash
# Run all performance tests
npx reassure

# Run specific performance test
npx reassure --testMatch "**/AudioPlayer.perf-test.js"
```

### CI Testing

The `reassure-tests.sh` script is designed to run on CI environments:

```bash
./reassure-tests.sh
```

This script:
1. Switches to the baseline branch (main)
2. Runs performance tests to gather baseline measurements
3. Switches back to the current branch
4. Runs performance tests to gather current measurements
5. Compares results to detect performance regressions

## Test Structure

Performance tests follow the `.perf-test.js` naming convention and use the `measureRenders` function from Reassure:

```javascript
import { measureRenders } from 'reassure';
import React from 'react';
import { ComponentUnderTest } from './ComponentUnderTest';

it('renders correctly', async () => {
  await measureRenders(<ComponentUnderTest />);
});
```

### Async Tests

For components with async behavior or interactions:

```javascript
import { measureRenders } from 'reassure';
import { screen, fireEvent } from '@testing-library/react-native';

it('Test with scenario', async () => {
  const scenario = async () => {
    fireEvent.press(screen.getByText('Go'));
    await screen.findByText('Done');
  };
  
  await measureRenders(<ComponentUnderTest />, { scenario });
});
```

## Performance Metrics

Reassure measures several key performance metrics:

1. **Mount Time** - Time taken to mount the component
2. **Render Count** - Number of renders during mounting
3. **Render Time** - Total time spent rendering
4. **Average Render Time** - Average time per render
5. **Slowest Render** - Slowest individual render time

## Best Practices

### 1. Test Realistic Scenarios
- Use realistic data sets and component states
- Test both empty and populated states
- Test loading and error states

### 2. Focus on Critical Components
- Prioritize performance testing for frequently used components
- Test components with complex rendering logic
- Test components with animations or transitions

### 3. Regular Monitoring
- Run performance tests regularly during development
- Monitor performance trends over time
- Set performance budgets for critical components

### 4. CI Integration
- Run performance tests on CI for pull requests
- Fail builds that introduce significant performance regressions
- Use Danger.js to report performance changes in PR comments

## Performance Baselines

Performance baselines are stored in the `.reassure/` directory:
- `current.perf` - Current branch performance measurements
- `baseline.perf` - Baseline branch performance measurements
- `output.md` - Comparison results and markdown report

## Future Improvements

1. **Add more performance tests** for additional components and screens
2. **Set performance budgets** to prevent regressions
3. **Integrate with CI/CD pipeline** for automated performance monitoring
4. **Add device-specific testing** for different screen sizes and hardware
5. **Monitor memory usage** in addition to render performance

## Troubleshooting

### Common Issues

1. **Missing dependencies** - Ensure all testing libraries are installed
2. **Test file naming** - Use `.perf-test.js` extension for performance tests
3. **Component imports** - Ensure components are properly exported and imported

### Debugging Performance Issues

1. **Profile components** using React DevTools
2. **Check render counts** - Look for unnecessary re-renders
3. **Optimize expensive operations** - Use memoization and useCallback
4. **Lazy load components** - Use React.lazy for heavy components

## References

- [Reassure Documentation](https://callstack.github.io/reassure/)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
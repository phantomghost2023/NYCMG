module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-clone-referenced-element|@react-native-community|rollbar-react-native|@freakycoder/react-native-helpers|react-native|react-redux|react-native-vector-icons|react-native-track-player|@react-native-async-storage|react-native-maps|immer)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.test.jsx',
    '**/*.perf-test.js',
    '**/*.perf-test.jsx'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js'
  ],
  moduleNameMapper: {
    'nycmg-shared': '<rootDir>/__mocks__/nycmg-shared.js'
  }
};
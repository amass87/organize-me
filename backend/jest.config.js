// backend/jest.config.js
export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['./tests/setup.js'],
  transformIgnorePatterns: [],
  moduleDirectories: ['node_modules', 'src'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  maxWorkers: 1
};

// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: [
    "**/tests/**/*.test.js"
  ],
  setupFilesAfterEnv: ['./setup.js'],
  transformIgnorePatterns: [],
  moduleDirectories: ['node_modules', '<rootDir>/src']
};

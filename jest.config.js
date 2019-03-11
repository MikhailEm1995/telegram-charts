const path = require('path');

module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  // A set of global variables that need to be available in all test environments
  globals: {},

  // Activates notifications for test results
  notify: true,

  // The root directory that Jest should scan for tests and modules within
  rootDir: path.resolve(__dirname, './src/'),

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/*.test.js"
  ]
};

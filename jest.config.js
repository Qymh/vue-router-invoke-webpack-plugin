module.exports = {
  moduleFileExtensions: ['js'],
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.spec.js'],
  collectCoverageFrom: ['core/**/*.js'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
};

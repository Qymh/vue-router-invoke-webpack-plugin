module.exports = {
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.spec.js'],
  collectCoverageFrom: ['core/**/*.js'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
};

require('dotenv').config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'd.ts', 'ts']
  // testMatch: ['tests/**/*.test.ts']
  // setupFiles: ['./tests/setup.ts']
}

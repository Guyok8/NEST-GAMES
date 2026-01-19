// jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest', // tells Jest to use the ts-jest preset
    testEnvironment: 'node', // tells Jest to use the node environment
    testMatch: ['**/*.spec.ts'], // tells Jest to look for test files in the spec.ts files
    moduleFileExtensions: ['ts', 'js', 'json'], // tells Jest the file extensions to look for
  };
  
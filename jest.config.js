/* eslint-disable */

process.env.TZ = 'UTC';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './jest.setup.js',
};

// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Include source files
    '!src/**/*.d.ts', // Exclude declaration files
  ],    
  coveragePathIgnorePatterns: [
    '/node_modules/', // Exclude node modules
  ],
};

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Include source files
    '!src/**/*.d.ts', // Exclude declaration files
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/', // Exclude node modules
  ],
};
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
};

export default createJestConfig(config);
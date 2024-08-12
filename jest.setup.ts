import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { loadEnvConfig } from '@next/env';
import { mockAuth } from './src/mocks/auth.mock';
import { mockRouter } from './src/mocks/router.mock';
import { server } from './src/mocks/server';
import { useRouter } from 'next/navigation';

// Mock next/image
interface ImageProps {
  src: string;
  alt: string;
}
test('should render with correct router pathname', () => {
  const mockRouter = {
    pathname: '/example',
    // other properties...
  }
};

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));
test('should render with correct router pathname', () => {
  const mockRouter = {
    pathname: '/example',
    // other properties...
  };

  // Mock the useRouter hook
  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
  }));

  // Your component that uses useRouter
  const { getByText } = render<MyComponent>;
  const element = getByText('Example Page');
  expect(element).toBeInTheDocument();
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));
return {
  __esModule: true,
  default: Image,
  "test-utils": {
    toJSON: (component: React.ReactElement) => {
      return component.props;
    }
  }
};
// Load environment variables
loadEnvConfig(process.cwd());

// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = typeof TextDecoder;

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => mockAuth),
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
    organizations: {
      getOrganization: jest.fn(),
      getOrganizationMembership: jest.fn(),
    },
  },
  useOrganization: jest.fn(),
  useUser: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global fetch mock
global.fetch = jest.fn();

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

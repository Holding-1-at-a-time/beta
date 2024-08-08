// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { loadEnvConfig } from '@next/env';
import { mockAuth } from './src/mocks/auth.mock'; // We'll create this file next
import { mockRouter } from './src/mocks/router.mock'; // We'll create this file next
import { server } from './src/mocks/server'; // We'll create this file for MSW
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />
  },
}));

// Load environment variables
loadEnvConfig(process.cwd());

// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

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
jest.mock('next/router', () => ({
    useRouter: jest.fn(() => mockRouter),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img { ...props } alt = { props.alt } />;
    },
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global fetch mock
global.fetch = jest.fn();

// Suppress console.error and console.warn in tests
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Clean up mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});
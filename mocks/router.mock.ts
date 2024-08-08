// src/mocks/router.mock.ts
export const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
};
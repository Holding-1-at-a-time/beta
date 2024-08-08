// src/mocks/auth.mock.ts
export const mockAuth = {
    userId: 'user_123',
    sessionId: 'session_123',
    getToken: jest.fn().mockResolvedValue('mock_token'),
};
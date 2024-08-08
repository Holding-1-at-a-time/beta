// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers'; // We'll create this next

export const server = setupServer(...handlers);
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
    rest.get('/api/example', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({ message: 'Mocked API response' })
        );
    }),
    // Add more handlers as needed
];
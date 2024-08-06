export class Logger {
    info(message: string, meta?: Record<string, unknown>) {
        Console.log(JSON.stringify({ level: 'info', message, ...meta }));
    }

    warn(message: string, meta?: Record<string, unknown>) {
        Console.warn(JSON.stringify({ level: 'warn', message, ...meta }));
    }

    error(message: string, meta?: Record<string, unknown>) {
        Console.error(JSON.stringify({ level: 'error', message, ...meta }));
    }
}
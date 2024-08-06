import { ConvexError } from "convex/values";

export class RateLimiter {
    private requests: Map<string, number[]> = new Map();
    private limit: number = 100;
    private window: number = 60000; // 1 minute

    async check(request: Request): Promise<boolean> {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        let timestamps = this.requests.get(ip) || [];
        timestamps = timestamps.filter(time => now - time < this.window);

        if (timestamps.length >= this.limit) {
            return false;
        }

        timestamps.push(now);
        this.requests.set(ip, timestamps);
        return true;
    }
}


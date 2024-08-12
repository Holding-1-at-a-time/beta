// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";
import { z } from "zod";
import { ConvexError } from "convex/values";
import { RateLimiter } from "./utils/rateLimiter";
import { Logger } from "./utils/logger";

const http = httpRouter();

const logger = new Logger();
const rateLimiter = new RateLimiter();

const WebhookPayloadSchema = z.object({
    type: z.string(),
    data: z.unknown(),
});

const handleWebhook = httpAction(async ({ runAction }, request) => {
    const startTime = Date.now();
    logger.info("Received webhook request");

    try {
        if (!await rateLimiter.check(request)) {
            logger.warn("Rate limit exceeded");
            return new Response("Too Many Requests", { status: 429 });
        }

        const payload = WebhookPayloadSchema.parse(await request.json());
        const headers = request.headers;

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_ROLES_PERMISSION;
        if (!webhookSecret) {
            throw new ConvexError("Missing CLERK_WEBHOOK_SECRET");
        }
        // no-dd-sa:typescript-code-style/assignment-name        
        const svix_id = headers.get('svix-id');
        // no-dd-sa:typescript-code-style/assignment-name        
        const svix_timestamp = headers.get('svix-timestamp');
        // no-dd-sa:typescript-code-style/assignment-name        
        const svix_signature = headers.get('svix-signature');

        if (!svix_id || !svix_timestamp || !svix_signature) {
            logger.warn("Missing svix headers");
            return new Response('Missing svix headers', { status: 400 });
        }

        try {
            const wh = new Webhook(webhookSecret);
            wh.verify(JSON.stringify(payload), {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            logger.error("Error verifying webhook", { error: err });
            return new Response('Error verifying webhook', { status: 400 });
        }

        const { type, data } = payload;

        await runAction(api.webhooks.processWebhook, { type, data });

        logger.info("Webhook processed successfully", {
            type,
            processingTime: Date.now() - startTime
        });
        return new Response('Webhook processed successfully', { status: 200 });
    } catch (error) {
        logger.error("Error processing webhook", { error });
        return new Response('Internal Server Error', { status: 500 });
    }
});

// Move the http.route call after the handleWebhook function is defined
http.route({
    path: "/api/clerk-webhook",
    method: "POST",
    handler: handleWebhook,
});

export default http;
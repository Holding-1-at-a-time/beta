// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";
import { z } from "zod";
import { v } from 'convex/values';
import { ConvexError } from "convex/values";
import { RateLimiter } from "./utils/rateLimiter";
import { Logger } from "./utils/logger";
import { DatabaseSchema } from "./schema";

const http = httpRouter();

const logger = new Logger();
const rateLimiter = new RateLimiter();

const OrganizationMembershipSchema = z.object({
    id: z.string(),
    organization: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
    public_user_data: z.object({
        user_id: z.string(),
        identifier: z.string(),
    }),
    role: z.string(),
});

const RoleSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
    permissions: z.array(z.string()),
});

const PermissionSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
});

const WebhookPayloadSchema = z.object({
    type: z.string(),
    data: z.unknown(),
});

const handleWebhook = httpAction(async ({ runMutation, runAction }, request) => {
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

        const svixId = headers.get('svix-id');
        const svixTimestamp = headers.get('svix-timestamp');
        const svixSignature = headers.get('svix-signature');

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

http.route({
    path: "/api/clerk-webhook",
    method: "POST",
    handler: handleWebhook,
});

http.route({
    path: "/api/clerk-webhook",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        const headers = request.headers;
        if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
        ) {
            return new Response(null, {
                headers: new Headers({
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type, svix-id, svix-timestamp, svix-signature",
                    "Access-Control-Max-Age": "86400",
                }),
            });
        } else {
            return new Response();
        }
    }),
});

export default http;
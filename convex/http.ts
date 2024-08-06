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

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_ROLES_PERMISSION;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!webhookSecret) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
}

if (!convexUrl) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL');
}

const convex = new ConvexHttpClient(convexUrl);

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const headers = req.headers as WebhookRequiredHeaders;
    const payload = await getRawBody(req);

    let evt: WebhookEvent;

    try {
        evt = verifyWebhook(payload, headers);
    } catch (err) {
        logger.error('Error verifying webhook:', err);
        return res.status(400).json({ error: 'Invalid webhook' });
    }

    try {
        await processWebhookEvent(evt);
        res.status(200).json({ success: true });
    } catch (err) {
        logger.error('Error processing webhook event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function verifyWebhook(payload: string, headers: WebhookRequiredHeaders): WebhookEvent {
    const wh = new Webhook(webhookSecret);
    return wh.verify(payload, headers) as WebhookEvent;
}

async function processWebhookEvent(evt: WebhookEvent): Promise<void> {
    switch (evt.type) {
        case 'organizationMembership.created':
        case 'organizationMembership.updated':
        case 'organizationMembership.deleted':
            await handleOrganizationMembershipEvent(evt);
            break;
        case 'role.created':
        case 'role.updated':
        case 'role.deleted':
            await handleRoleEvent(evt);
            break;
        case 'permission.created':
        case 'permission.updated':
        case 'permission.deleted':
            await handlePermissionEvent(evt);
            break;
        default:
            logger.warn(`Unhandled event type: ${evt.type}`);
    }
}

async function handleOrganizationMembershipEvent(evt: WebhookEvent): Promise<void> {
    const data = OrganizationMembershipSchema.parse(evt.data);

    try {
        await convex.mutation(api.organizationMemberships.upsert, {
            id: data.id,
            organizationId: data.organization.id,
            userId: data.public_user_data.user_id,
            role: data.role,
            isDeleted: evt.type === 'organizationMembership.deleted'
        });
    } catch (err) {
        logger.error('Error upserting organization membership:', err);
        throw err;
    }
}

async function handleRoleEvent(evt: WebhookEvent): Promise<void> {
    const data = RoleSchema.parse(evt.data);

    try {
        if (evt.type === 'role.deleted') {
            await convex.mutation(api.roles.remove, { id: data.id });
        } else {
            await convex.mutation(api.roles.upsert, {
                id: data.id,
                key: data.key,
                name: data.name,
                description: data.description,
                permissions: data.permissions
            });
        }
    } catch (err) {
        logger.error('Error handling role event:', err);
        throw err;
    }
}

async function handlePermissionEvent(evt: WebhookEvent): Promise<void> {
    const data = PermissionSchema.parse(evt.data);

    try {
        if (evt.type === 'permission.deleted') {
            await convex.mutation(api.permissions.remove, { id: data.id });
        } else {
            await convex.mutation(api.permissions.upsert, {
                id: data.id,
                key: data.key,
                name: data.name,
                description: data.description
            });
        }
    } catch (err) {
        logger.error('Error handling permission event:', err);
        throw err;
    }
}

async function getRawBody(req: NextApiRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', reject);
    });
}

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: handleWebhook,
});

export default http;
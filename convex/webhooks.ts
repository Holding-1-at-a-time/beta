// convex/webhooks.ts
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { http } from './http';
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Logger } from './utils/logger';

const http = httpRouter();
const logger = new Logger();
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
        const svix_Id = headers.get('svix-id');
        // no-dd-sa:typescript-code-style/assignment-name
        const svix_Timestamp = headers.get('svix-timestamp');
        // no-dd-sa:typescript-code-style/assignment-name        
        const svix_Signature = headers.get('svix-signature');

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

export const processWebhook = action({
    args: {
        type: v.string(),
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const { type, data } = args;

        try {
            switch (type) {
                case 'organizationMembership.created':
                case 'organizationMembership.updated':
                case 'organizationMembership.deleted':
                    await handleOrganizationMembership(ctx, type, data);
                    break;
                case 'role.created':
                case 'role.updated':
                case 'role.deleted':
                    await handleRole(ctx, type, data);
                    break;
                case 'permission.created':
                case 'permission.updated':
                case 'permission.deleted':
                    await handlePermission(ctx, type, data);
                    break;
                default:
                    logger.warn(`Unhandled event type: ${type}`);
            }
        } catch (error) {
            logger.error("Error processing webhook", { type, error });
            throw error;
        }
    },
});

async function handleOrganizationMembership(ctx: ActionCtx, type: string, data: unknown) {
    const membershipData = OrganizationMembershipSchema.parse(data);
    await ctx.runMutation(api.organizationMemberships.upsert, {
        id: membershipData.id,
        organizationId: membershipData.organization.id,
        userId: membershipData.public_user_data.user_id,
        role: membershipData.role,
        isDeleted: type === 'organizationMembership.deleted'
    });
}

async function handleRole(ctx: ActionCtx, type: string, data: unknown) {
    const roleData = RoleSchema.parse(data);
    if (type === 'role.deleted') {
        await ctx.runMutation(api.roles.remove, { id: roleData.id });
    } else {
        await ctx.runMutation(api.roles.upsert, {
            id: roleData.id,
            key: roleData.key,
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.permissions
        });
    }
}

async function handlePermission(ctx: ActionCtx, type: string, data: unknown) {
    const permissionData = PermissionSchema.parse(data);
    if (type === 'permission.deleted') {
        await ctx.runMutation(api.permissions.remove, { id: permissionData.id });
    } else {
        await ctx.runMutation(api.permissions.upsert, {
            id: permissionData.id,
            key: permissionData.key,
            name: permissionData.name,
            description: permissionData.description
        });
    }
}

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: handleWebhook,
});

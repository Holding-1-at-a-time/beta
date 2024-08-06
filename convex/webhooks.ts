// convex/webhooks.ts
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { OrganizationMembershipSchema, RoleSchema, PermissionSchema } from './schema';
import { Logger } from './utils/logger';

const logger = new Logger();

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
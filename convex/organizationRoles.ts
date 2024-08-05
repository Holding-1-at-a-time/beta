// convex/organizationRoles.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        const { tenantId } = args;

        // Fetch roles from your database based on tenantId
        const roles = await ctx.db
            .query('roles')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .collect();

        return roles.map(role => ({
            key: role.key,
            name: role.name,
            description: role.description,
        }));
    },
});

export const updateMemberRole = mutation({
    args: {
        tenantId: v.id('tenants'),
        organizationId: v.string(),
        role: v.string(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { tenantId, organizationId, role, isActive } = args;

        // Update the role in your database
        await ctx.db.patch(q => q
            .filter(q.eq(q.field('tenantId'), tenantId))
            .filter(q.eq(q.field('organizationId'), organizationId)),
            { [`roles.${role}`]: isActive }
        );

        return { success: true };
    },
});
// convex/integrations.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('integrations')
            .filter(q => q.eq(q.field('tenantId'), args.tenantId))
            .collect();
    },
});

export const toggle = mutation({
    args: {
        tenantId: v.id('tenants'),
        integrationId: v.string(),
        isConnected: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { tenantId, integrationId, isConnected } = args;

        const existingIntegration = await ctx.db
            .query('integrations')
            .filter(q => q.and(
                q.eq(q.field('tenantId'), tenantId),
                q.eq(q.field('id'), integrationId)
            ))
            .first();

        if (!existingIntegration) {
            throw new Error('Integration not found');
        }

        await ctx.db.patch(existingIntegration._id, { isConnected });

        // Here you would typically add logic to actually connect or disconnect
        // the integration with the third-party service

        return { success: true };
    },
});
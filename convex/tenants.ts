// convex/tenants.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getBusinessDetails = query({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error('Tenant not found');
        return {
            companyName: tenant.companyName,
            address: tenant.address,
            phoneNumber: tenant.phoneNumber,
        };
    },
});

export const updateBusinessDetails = mutation({
    args: {
        tenantId: v.id('tenants'),
        companyName: v.string(),
        address: v.string(),
        phoneNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, ...updateData } = args;
        const existingTenant = await ctx.db.get(tenantId);
        if (!existingTenant) throw new Error('Tenant not found');

        await ctx.db.patch(tenantId, updateData);
        return { success: true };
    },
});
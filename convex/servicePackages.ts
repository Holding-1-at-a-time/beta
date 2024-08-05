// convex/servicePackages.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const packageSchema = v.object({
    id: v.optional(v.string()),
    name: v.string(),
    description: v.string(),
    price: v.number(),
});

export const list = query({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('servicePackages')
            .filter(q => q.eq(q.field('tenantId'), args.tenantId))
            .collect();
    },
});

export const update = mutation({
    args: {
        tenantId: v.id('tenants'),
        packages: v.array(packageSchema),
    },
    handler: async (ctx, args) => {
        const { tenantId, packages } = args;

        // Remove existing packages
        const existingPackages = await ctx.db
            .query('servicePackages')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .collect();

        for (const pkg of existingPackages) {
            await ctx.db.delete(pkg._id);
        }

        // Add new packages
        for (const pkg of packages) {
            await ctx.db.insert('servicePackages', {
                tenantId,
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
            });
        }

        return { success: true };
    },
});
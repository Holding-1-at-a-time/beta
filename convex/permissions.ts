
// convex/permissions.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const upsert = mutation({
    args: {
        id: v.string(),
        key: v.string(),
        name: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, key, name, description } = args;

        const existingPermission = await ctx.db
            .query('permissions')
            .filter(q => q.eq(q.field('id'), id))
            .first();

        if (existingPermission) {
            await ctx.db.patch(existingPermission._id, { key, name, description });
        } else {
            await ctx.db.insert('permissions', { id, key, name, description });
        }
    },
});

export const remove = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const { id } = args;

        const existingPermission = await ctx.db
            .query('permissions')
            .filter(q => q.eq(q.field('id'), id))
            .first();

        if (existingPermission) {
            await ctx.db.delete(existingPermission._id);
        }
    },
});
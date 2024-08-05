
// convex/roles.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const upsert = mutation({
    args: {
        id: v.string(),
        key: v.string(),
        name: v.string(),
        description: v.string(),
        permissions: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, key, name, description, permissions } = args;

        const existingRole = await ctx.db
            .query('roles')
            .filter(q => q.eq(q.field('id'), id))
            .first();

        if (existingRole) {
            await ctx.db.patch(existingRole._id, { key, name, description, permissions });
        } else {
            await ctx.db.insert('roles', { id, key, name, description, permissions });
        }
    },
});

export const remove = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const { id } = args;

        const existingRole = await ctx.db
            .query('roles')
            .filter(q => q.eq(q.field('id'), id))
            .first();

        if (existingRole) {
            await ctx.db.delete(existingRole._id);
        }
    },
});

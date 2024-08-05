// convex/organizationMemberships.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const upsert = mutation({
    args: {
        id: v.string(),
        organizationId: v.string(),
        userId: v.string(),
        role: v.string(),
        isDeleted: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { id, organizationId, userId, role, isDeleted } = args;

        const existingMembership = await ctx.db
            .query('organizationMemberships')
            .filter(q => q.eq(q.field('id'), id))
            .first();

        if (existingMembership) {
            if (isDeleted) {
                await ctx.db.delete(existingMembership._id);
            } else {
                await ctx.db.patch(existingMembership._id, { role });
            }
        } else if (!isDeleted) {
            await ctx.db.insert('organizationMemberships', {
                id,
                organizationId,
                userId,
                role,
            });
        }
    },
});

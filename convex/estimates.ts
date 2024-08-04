import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("estimates").order("desc").take(100);
    },
});

export const create = mutation({
    args: {
        number: v.string(),
        items: v.array(v.object({
            name: v.string(),
            price: v.number(),
        })),
        clientId: v.string(),
    },
    handler: async (ctx, args) => {
        const total = args.items.reduce((sum, item) => sum + item.price, 0);
        return await ctx.db.insert("estimates", {
            ...args,
            status: "pending",
            total,
            createdAt: Date.now(),
        });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("estimates"),
        status: v.union(v.literal("approved"), v.literal("declined")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { status: args.status });
    },
});
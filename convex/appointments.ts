import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("appointments").order("desc").take(100);
    },
});

export const create = mutation({
    args: {
        date: v.number(),
        service: v.string(),
        clientId: v.id('clients'),
        depositPaid: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("appointments", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
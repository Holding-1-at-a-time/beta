
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listClients = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("clients").order("desc").take(100);
    },
});

export const createClients = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("clients", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
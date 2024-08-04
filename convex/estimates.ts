// File: convex/estimates.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listEstimates = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("estimates").collect();
    },
});

export const createEstimate = mutation({
    args: {
        number: v.string(),
        clientId: v.string(),
        items: v.array(v.object({
            name: v.string(),
            price: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const estimateId = await ctx.db.insert("estimates", {
            number: args.number,
            clientId: args.clientId,
            items: args.items,
            status: "pending",
            total: args.items.reduce((sum, item) => sum + item.price, 0),
            createdAt: new Date().toISOString(),
        });
        return estimateId;
    },
});

export const updateEstimateStatus = mutation({
    args: {
        id: v.id("estimates"),
        status: v.union(v.literal("approved"), v.literal("declined")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const listEstimates = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("estimates")
            .order("desc")
            .take(100);
    },
});

export const createEstimate = mutation({
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

export const updateEstimateStatus = mutation({
    args: {
        id: v.id("estimates"),
        status: v.union(v.literal("approved"), v.literal("declined")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { status: args.status });
    },
})
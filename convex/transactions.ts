import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("transactions").order("desc").take(100);
    },
});

export const create = mutation({
    args: {
        type: v.union(v.literal("deposit"), v.literal("payment"), v.literal("refund")),
        amount: v.number(),
        clientId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("transactions", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const summary = query({
    args: {},
    handler: async (ctx) => {
        const transactions = await ctx.db.query("transactions").collect();
        return transactions.reduce((summary, transaction) => {
            summary[transaction.type] += transaction.amount;
            summary.total += transaction.amount;
            return summary;
        }, { deposit: 0, payment: 0, refund: 0, total: 0 });
    },
});
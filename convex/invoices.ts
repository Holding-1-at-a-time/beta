import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listInvoices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("invoices").order("desc").take(100);
    },
});

export const createInvoices = mutation({
    args: {
        number: v.string(),
        items: v.array(v.object({
            name: v.string(),
            price: v.number(),
        })),
        clientId: v.string(),
        dueDate: v.number(),
    },
    handler: async (ctx, args) => {
        const total = args.items.reduce((sum, item) => sum + item.price, 0);
        return await ctx.db.insert("invoices", {
            ...args,
            status: "unpaid",
            total,
            createdAt: Date.now(),
        });
    },
});

export const updateInvoiceStatus = mutation({
    args: {
        id: v.id("invoices"),
        status: v.union(v.literal("paid"), v.literal("overdue")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { status: args.status });
    },
});
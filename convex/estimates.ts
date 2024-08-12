// File: convex/estimates.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { action } from './_generated/server';


export const listRecent = query({
  args: {
    tenantId: v.string(),
    page: v.number(),
    pageSize: v.number(),
  },
  /**
   * Handles the retrieval of paginated estimates for a given tenant.
   *
   * @param {object} ctx - The context object containing the database and authentication information.
   * @param {object} args - The arguments object containing the tenantId, page, and pageSize.
   * @return {object} An object containing the paginated estimates and the total count of estimates.
   */
  handler: async (ctx, args) => {
    const { tenantId, page, pageSize } = args;

    // Basic security check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // Fetch estimates and total count in single query
    const estimatesAndTotalCount = await ctx.db.query("estimates")
    // Fetch total count for pagination
    const totalCount = await ctx.db
      .query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .count();

    // Fetch paginated estimates and total count
    const [estimates, totalCount] = await ctx.db
      .query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .order("desc")
      .paginate(page, pageSize)
      .collectTotalCount();

    return {
      items: estimates,
      totalCount,
    };
  },
});

    const estimatesQuery = ctx.db
      .query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .order("desc")
      .paginate(page, pageSize)
      .collectTotalCount();

    const [estimates, totalCount] = await estimatesQuery;

    return {
      items: estimates,
      totalCount,
};
    
// Fetch paginated estimates
const estimates = await ctx.db
    .query("estimates")
    .filter(q => q.eq(q.field("tenantId"), tenantId))
    .order("desc")
    .paginate(page, pageSize)
    .collectTotalCount();

const [estimates, totalCount] = await estimatesQuery;

return {
    items: estimates,
    totalCount,
};


export const list = query({
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
    handler: async (ctx, { number, clientId, items }) => {
        const total = items.reduce((sum, { price }) => sum + price, 0);
        return await ctx.db.insert("estimates", { number, clientId, items, status: "pending", total, createdAt: new Date().toISOString() });
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
        };

        export const updateEstimateStatus = mutation({
            args: {
                id: v.id("estimates"),
                status: v.union(v.literal("approved"), v.literal("declined")),
            },
            handler: async (ctx, args) => {
                await ctx.db.patch(args.id, { status: args.status });
            },
        });

        export const listEstimatesQuery = query({
            args: {},
            handler: async (ctx) => {
                return await ctx.db.query("estimates")
                    .order("desc")
                    .take(100);
            },
        });

        export const createEstimatesForServices = mutation({
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
        }
    )
        export const updateEstimates = mutation({
            args: {
                id: v.id("estimates"),
                status: v.union(v.literal("approved"), v.literal("declined")),
            },
            handler: async (ctx, args) => {
                return await ctx.db.patch(args.id, { status: args.status });
            }
        });
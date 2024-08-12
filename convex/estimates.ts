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
        }
    }
});
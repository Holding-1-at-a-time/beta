// File: convex/estimates.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { action } from './_generated/server';


export const listRecentEstimates = query({
  args: {
    tenantId: v.string(),
    page: v.number(),
    pageSize: v.number(),
  },
  handler: async (ctx, { tenantId, page, pageSize }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const [estimates, totalCount] = await ctx.db
      .query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .order("desc")
      .paginate(page, pageSize)
      .collectTotalCount();

    return {
      estimates,
      totalCount,
    };
  },
});

export const listEstimates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("estimates").collect();
  },
});

export const createEstimate = mutation({
  args: {
    estimateNumber: v.string(),
    clientId: v.string(),
    estimateItems: v.array(v.object({
      name: v.string(),
      price: v.number(),
    })),
  },
  handler: async (ctx, { estimateNumber, clientId, estimateItems }) => {
    const total = estimateItems.reduce((sum, { price }) => sum + price, 0);

    const newEstimate = {
      estimateNumber,
      clientId,
      estimateItems,
      status: "pending",
      total,
      createdAt: new Date().toISOString(),
    };

    const estimateId = await ctx.db.insert("estimates", newEstimate);
    return estimateId;
  },
});


export const listRecent = query({
  args: {
    tenantId: v.string(),
    page: v.number(),
    pageSize: v.number(),
  },
  handler: async (ctx, { tenantId, page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    const estimates = await ctx.db.query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .order("desc")
      .range(start, end)
      .collect();

    const totalCount = await ctx.db.query("estimates")
      .filter(q => q.eq(q.field("tenantId"), tenantId))
      .count();

    return {
      items: estimates,
      totalCount,
    }
  }
});
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
  }
};


export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("estimates").collect();
  },
});

export const createEstimate = mutation({
  args: {
    estimateNumber: v.string(),
    number: v.string(),
    clientId: v.string(),
    estimateItems: v.array(v.object({
      name: v.string(),
      price: v.number(),
    })),
      items: v.array(v.object({
        name: v.string(),
        price: v.number(),
      })
    ),
  },
  handler: async (ctx, { estimateNumber, clientId, estimateItems }) => {
    if (!ctx || !ctx.db) {
      throw new Error("Invalid context or database");
    }

    if (!estimateNumber || !clientId || !estimateItems) {
      throw new Error("Missing required arguments");
    }

    const total = estimateItems.reduce((sum, { price }) => sum + price, 0);
    const newEstimate = {
      number: estimateNumber,
      clientId,
      estimateItems,
      items: estimateItems,
      status: "pending",
      total,
      createdAt: new Date().toISOString(),
    };

    const estimateId = await ctx.db.insert("estimates", newEstimate);
    if (!estimateId) {
      throw new Error("Failed to create estimate");
    }

    return estimateId;
  },
});
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
      createdAt: new Date().toISOString()
    });
    return estimateId;
  }
}
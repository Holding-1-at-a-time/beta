// convex/advancedSettings.ts
import { mutation, query, action } from './_generated/server'
import { v } from 'convex/values'

const advancedSettingsSchema = v.object({
    dataRetention: v.union(v.literal('6months'), v.literal('1year'), v.literal('2years'), v.literal('indefinite')),
    defaultTimezone: v.string(),
    defaultLanguage: v.union(v.literal('en'), v.literal('es'), v.literal('fr'), v.literal('de')),
});

export const get = query({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        const settings = await ctx.db
            .query('advancedSettings')
            .filter(q => q.eq(q.field('tenantId'), args.tenantId))
            .first();

        return settings ? settings.settings : null;
    },
});

export const update = mutation({
    args: {
        tenantId: v.id('tenants'),
        settings: advancedSettingsSchema,
    },
    handler: async (ctx, args) => {
        const { tenantId, settings } = args;

        const existingSettings = await ctx.db
            .query('advancedSettings')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .first();

        if (existingSettings) {
            await ctx.db.patch(existingSettings._id, { settings });
        } else {
            await ctx.db.insert('advancedSettings', { tenantId, settings });
        }

        return { success: true };
    },
});

export const exportData = action({
    args: { tenantId: v.id('tenants') },
    handler: async (ctx, args) => {
        // Here you would implement the logic to export all data for the tenant
        // This might involve querying multiple tables and formatting the data

        // For demonstration purposes, we'll just return a placeholder
        return {
            exportedAt: new Date().toISOString(),
            data: "Placeholder for exported data",
        };
    },
});
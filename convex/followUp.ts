// File: convex/followUp.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const scheduleFollowUp = mutation({
    args: {
        clientId: v.string(),
        appointmentDate: v.string(),
    },
    handler: async (ctx, args) => {
        // Schedule follow-up notifications
        const followUpDates = [
            new Date(args.appointmentDate).getTime() - 7 * 24 * 60 * 60 * 1000, // 1 week before
            new Date(args.appointmentDate).getTime() - 24 * 60 * 60 * 1000,     // 1 day before
        ];

        for (const date of followUpDates) {
            await ctx.scheduler.runAfter(date - Date.now(), 'sendReminder', {
                clientId: args.clientId,
                appointmentDate: args.appointmentDate,
            });
        }
    },
});

export const sendReminder = mutation({
    args: {
        clientId: v.string(),
        appointmentDate: v.string(),
    },
    handler: async (ctx, args) => {
        // Fetch client details
        const client = await ctx.db.get(args.clientId);

        // Send reminder (implement your preferred notification method)
        // For example, you could use an email service or SMS gateway
        console.log(`Sending reminder to ${client.email} for appointment on ${args.appointmentDate}`);
    },
});
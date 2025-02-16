// File: convex/followUp.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const scheduleFollowUp = mutation({
    args: {
        clientId: v.string(),
        appointmentDate: v.string(),
    },
    handler: async (ctx, args) => {
        // Schedule follow-up notifications
        const followUpDates = [
            new Date(args.appointmentDate).getTime() - 5 * 24 * 60 * 60 * 1000, // 5 days before
            new Date(args.appointmentDate).getTime() - 3 * 24 * 60 * 60 * 1000, // 3 days before
            new Date(args.appointmentDate).getTime() - 2 * 24 * 60 * 60 * 1000, // 2 days before
            new Date(args.appointmentDate).getTime() - 12 * 60 * 60 * 1000,     // 12 hours before
            new Date(args.appointmentDate).getTime() - 6 * 60 * 60 * 1000,      // 6 hours before
            new Date(args.appointmentDate).getTime() - 3 * 60 * 60 * 1000,      // 3 hours before
            new Date(args.appointmentDate).getTime() - 60 * 60 * 1000,          // 1 hour before
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
        clientId: v.id("clients"),
        appointmentDate: v.string(),
    },
    handler: async (ctx, args) => {
        // Fetch client details
        const client = await ctx.db.get(args.clientId);
        const transport = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: 'username',
                pass: 'password',
            },
        });
        await transport.sendMail({
            from: 'no-reply@example.com',
            to: client.email,
            subject: 'Appointment Reminder',
            text: `You have an appointment on ${args.appointmentDate}.`,
        });
        await transport.sendMail({
            from: 'your-email@gmail.com',
            to: client.email,
            subject: 'Appointment Reminder',
            text: `You have an appointment on ${args.appointmentDate}.`,
        });
        Console.log(`Sending reminder to ${client.email} for appointment on ${args.appointmentDate}`);
    },
});

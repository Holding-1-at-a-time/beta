// convex/assessments.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { requirePermission } from "./rbac";

export const createAssessment = mutation({
    args: {
        organizationId: v.string(),
        clientId: v.string(),
        vehicleType: v.string(),
        condition: v.string(),
        issues: v.array(v.string()),
        images: v.array(v.string()),
        video: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        await requirePermission(ctx, identity.subject, args.organizationId, "org:assessments:create");

        const { organizationId, clientId, vehicleType, condition, issues, images, video } = args;

        if (!vehicleType || !condition || issues.length === 0) {
            throw new ConvexError("Invalid assessment data");
        }

        const assessment = await ctx.db.insert("assessments", {
            organizationId,
            clientId,
            vehicleType,
            condition,
            issues,
            images,
            video,
            status: "pending",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return assessment;
    },
});

export const getAssessments = query({
    args: {
        organizationId: v.string(),
        status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"))),
        limit: v.number(),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        await requirePermission(ctx, identity.subject, args.organizationId, "org:assessments:read");

        let query = ctx.db
            .query("assessments")
            .filter((q) => q.eq(q.field("organizationId"), args.organizationId));

        if (args.status) {
            query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const assessments = await query
            .order("desc")
            .paginate({ cursor: args.cursor, limit: args.limit });

        return assessments;
    },
});

export const updateAssessmentStatus = mutation({
    args: {
        assessmentId: v.id("assessments"),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const assessment = await ctx.db.get(args.assessmentId);
        if (!assessment) {
            throw new ConvexError("Assessment not found");
        }

        await requirePermission(ctx, identity.subject, assessment.organizationId, "org:assessments:manage");

        const updatedAssessment = await ctx.db.patch(args.assessmentId, {
            status: args.status,
            updatedAt: Date.now(),
        });

        return updatedAssessment;
    },
});
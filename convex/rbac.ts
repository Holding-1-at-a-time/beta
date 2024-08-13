// convex/rbac.ts
import { Query, Mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export type Role = "org:admin" | "org:clients" | "org:manager_organization" | "org:member" | "org:non_member";

const roleHierarchy: { [key in Role]: number } = {
    "org:admin": 4,
    "org:manager_organization": 3,
    "org:member": 2,
    "org:clients": 1,
    "org:non_member": 0,
};

const rolePermissions: { [key in Role]: string[] } = {
    "org:admin": [
        "org:services:create", "org:client:create", "org:client:read", "org:client:update", "org:client:delete",
        "org:schedules:create", "org:feedback:read", "org:pricing:create", "org:payments:manage", "org:invoice:manage",
        "org:client:manage", "org:services:manage", "org:pricing:manage", "org:reports:view", "org:schedules:manage",
        "org:assessments:manage", "org:feedback:create", "org:appointments:read", "org:appointments:create",
        "org:schedules:read", "org:assessments:read", "org:assessments:create", "org:services:read", "org:invoices:read",
        "org:payments:create", "org:payments:read", "org:pricing:read", "org:sys_domains:manage", "org:sys_domains:read",
        "org:sys_memberships:manage", "org:sys_memberships:read", "org:sys_profile:delete", "org:sys_profile:manage",
        "org:invoice:create"
    ],
    "org:manager_organization": [
        "org:services:create", "org:client:create", "org:client:read", "org:client:update", "org:client:delete",
        "org:schedules:create", "org:feedback:read", "org:pricing:create", "org:payments:manage", "org:invoice:manage",
        "org:client:manage", "org:services:manage", "org:pricing:manage", "org:reports:view", "org:schedules:manage",
        "org:assessments:manage", "org:feedback:create", "org:appointments:read", "org:appointments:create",
        "org:schedules:read", "org:assessments:read", "org:assessments:create", "org:services:read", "org:invoices:read",
        "org:payments:create", "org:payments:read", "org:pricing:read", "org:sys_memberships:manage",
        "org:sys_memberships:read", "org:sys_profile:manage", "org:invoice:create"
    ],
    "org:member": [
        "org:client:create", "org:client:read", "org:client:update", "org:feedback:read", "org:appointments:read",
        "org:appointments:create", "org:schedules:read", "org:assessments:read", "org:assessments:create",
        "org:invoices:read", "org:payments:create", "org:payments:read", "org:pricing:read", "org:sys_memberships:read",
        "org:services:read"
    ],
    "org:clients": [
        "org:feedback:create", "org:appointments:read", "org:appointments:create", "org:assessments:read",
        "org:assessments:create", "org:services:read", "org:invoices:read", "org:payments:create", "org:payments:read",
        "org:pricing:read"
    ],
    "org:non_member": [
        "org:appointments:read", "org:schedules:read", "org:assessments:read", "org:services:read", "org:invoices:read",
        "org:payments:read", "org:pricing:read", "org:client:read", "org:feedback:read"
    ],
};

export const checkPermission = async (
    ctx: { db: Query["db"] },
    userId: string,
    organizationId: string,
    requiredPermission: string
): Promise<boolean> => {
    const membership = await ctx.db
        .query("organizationMemberships")
        .filter((q) =>
            q.and(
                q.eq(q.field("userId"), userId),
                q.eq(q.field("organizationId"), organizationId)
            )
        )
        .first();

    if (!membership) {
        return false;
    }

    const role = membership.role as Role;
    const permissions = rolePermissions[role];

    return permissions.includes(requiredPermission);
};

export const requirePermission = async (
    ctx: { db: Query["db"] },
    userId: string,
    organizationId: string,
    requiredPermission: string
): Promise<void> => {
    const hasPermission = await checkPermission(ctx, userId, organizationId, requiredPermission);
    if (!hasPermission) {
        throw new ConvexError("Insufficient permissions");
    }
};

export const getUserRole = async (
    ctx: { db: Query["db"] },
    userId: string,
    organizationId: string
): Promise<Role | null> => {
    const membership = await ctx.db
        .query("organizationMemberships")
        .filter((q) =>
            q.and(
                q.eq(q.field("userId"), userId),
                q.eq(q.field("organizationId"), organizationId)
            )
        )
        .first();

    return membership ? membership.role as Role : null;
};

export const hasHigherRole = (userRole: Role, targetRole: Role): boolean => {
    return roleHierarchy[userRole] > roleHierarchy[targetRole];
};